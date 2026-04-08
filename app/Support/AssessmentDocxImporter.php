<?php

namespace App\Support;

use ZipArchive;

class AssessmentDocxImporter
{
    public function importPractice(string $docxPath, string $mediaDirectory): array
    {
        $document = $this->openDocument($docxPath);
        $paragraphs = $document['paragraphs'];
        $relationships = $document['relationships'];
        $zip = $document['zip'];

        $mode = null;
        $pendingQuestionParts = [];
        $pendingFeedbackParts = [];
        $questions = [];
        $answerLetter = null;

        foreach ($paragraphs as $paragraph) {
            $text = $paragraph['text'];
            $imagePath = $paragraph['image_path'];

            if ($text === 'LATIHAN SOAL') {
                continue;
            }

            if (str_starts_with($text, 'PILIHAN GANDA')) {
                $this->finalizePracticeQuestion(
                    $questions,
                    $mode,
                    $pendingQuestionParts,
                    $pendingFeedbackParts,
                    $answerLetter
                );

                $mode = 'multiple_choice';
                continue;
            }

            if (str_starts_with($text, 'SOAL ESAI')) {
                $this->finalizePracticeQuestion(
                    $questions,
                    $mode,
                    $pendingQuestionParts,
                    $pendingFeedbackParts,
                    $answerLetter
                );

                $mode = 'essay';
                continue;
            }

            if ($mode === null) {
                continue;
            }

            $part = [
                'text' => $text,
                'image_path' => $imagePath
                    ? $this->extractImage($zip, $relationships, $imagePath, $mediaDirectory)
                    : null,
            ];

            if ($mode === 'multiple_choice') {
                if ($this->isPracticeAnswerLine($text)) {
                    $answerLetter = $this->extractAnswerLetter($text);
                    continue;
                }

                if ($this->isFeedbackLine($text)) {
                    $pendingFeedbackParts[] = $this->stripFeedbackPrefix($part);
                    continue;
                }

                if (
                    $answerLetter !== null &&
                    $this->looksLikePracticeMultipleChoiceQuestion($text, $part['image_path'])
                ) {
                    $this->finalizePracticeQuestion(
                        $questions,
                        $mode,
                        $pendingQuestionParts,
                        $pendingFeedbackParts,
                        $answerLetter
                    );
                }

                if ($answerLetter === null) {
                    $pendingQuestionParts[] = $part;
                    continue;
                }

                $pendingFeedbackParts[] = $part;
                continue;
            }

            if ($this->isFeedbackLine($text)) {
                $pendingFeedbackParts[] = $this->stripFeedbackPrefix($part);
                continue;
            }

            if (
                $pendingFeedbackParts !== [] &&
                $this->looksLikePracticeEssayQuestion($text, $part['image_path'])
            ) {
                $this->finalizePracticeQuestion(
                    $questions,
                    $mode,
                    $pendingQuestionParts,
                    $pendingFeedbackParts,
                    $answerLetter
                );
            }

            if ($pendingFeedbackParts === []) {
                $pendingQuestionParts[] = $part;
                continue;
            }

            $pendingFeedbackParts[] = $part;
        }

        $this->finalizePracticeQuestion(
            $questions,
            $mode,
            $pendingQuestionParts,
            $pendingFeedbackParts,
            $answerLetter
        );

        $zip->close();

        return [
            'title' => 'Latihan Soal Struktur Atom',
            'description' => implode("\n", [
                '20 soal pilihan ganda dan 5 soal esai.',
                'Setiap jawaban langsung menampilkan feedback pada masing-masing soal.',
                'Latihan ini tidak menampilkan skor akhir.',
            ]),
            'questions' => $questions,
        ];
    }

    public function importExam(string $docxPath, string $mediaDirectory): array
    {
        $document = $this->openDocument($docxPath);
        $paragraphs = $document['paragraphs'];
        $relationships = $document['relationships'];
        $zip = $document['zip'];

        $instructions = [];
        $inInstructions = false;
        $inQuestions = false;
        $questionParts = [];
        $questions = [];
        $currentNumber = null;
        $answerLetter = null;

        foreach ($paragraphs as $paragraph) {
            $text = $paragraph['text'];
            $imagePath = $paragraph['image_path']
                ? $this->extractImage($zip, $relationships, $paragraph['image_path'], $mediaDirectory)
                : null;

            if ($text === 'SOAL TES' || $text === '1. Petunjuk Pengerjaan') {
                continue;
            }

            if ($text === 'Petunjuk Tes') {
                $inInstructions = true;
                continue;
            }

            if ($text === 'Tes Evaluasi') {
                $inInstructions = false;
                $inQuestions = true;
                continue;
            }

            if ($inInstructions) {
                $instructions[] = preg_replace('/^\d+\.\s*/', '', $text);
                continue;
            }

            if (! $inQuestions) {
                continue;
            }

            if (preg_match('/^Soal\s+(\d+)/i', $text, $matches)) {
                $this->finalizeExamQuestion($questions, $questionParts, $answerLetter);

                $currentNumber = (int) $matches[1];
                $answerLetter = null;
                continue;
            }

            if ($currentNumber === null) {
                continue;
            }

            if ($this->isPracticeAnswerLine($text)) {
                $answerLetter = $this->extractAnswerLetter($text);
                continue;
            }

            $questionParts[] = [
                'text' => $text,
                'image_path' => $imagePath,
            ];
        }

        $this->finalizeExamQuestion($questions, $questionParts, $answerLetter);

        $zip->close();

        return [
            'title' => 'Tes Evaluasi Struktur Atom',
            'description' => implode("\n", $instructions),
            'questions' => $questions,
        ];
    }

    private function openDocument(string $docxPath): array
    {
        $zip = new ZipArchive();
        $zip->open($docxPath);

        $documentXml = $zip->getFromName('word/document.xml');
        $relationshipsXml = $zip->getFromName('word/_rels/document.xml.rels');

        $document = new \DOMDocument();
        $document->loadXML($documentXml);

        $relationships = [];
        if ($relationshipsXml) {
            $rels = new \SimpleXMLElement($relationshipsXml);
            foreach ($rels->Relationship as $relationship) {
                $attributes = $relationship->attributes();
                $relationships[(string) $attributes['Id']] = (string) $attributes['Target'];
            }
        }

        return [
            'zip' => $zip,
            'relationships' => $relationships,
            'paragraphs' => $this->extractParagraphs($document),
        ];
    }

    private function extractParagraphs(\DOMDocument $document): array
    {
        $xpath = new \DOMXPath($document);
        $xpath->registerNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        $xpath->registerNamespace('m', 'http://schemas.openxmlformats.org/officeDocument/2006/math');
        $xpath->registerNamespace('a', 'http://schemas.openxmlformats.org/drawingml/2006/main');
        $xpath->registerNamespace('r', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships');

        $paragraphs = [];

        foreach ($xpath->query('//w:body/w:p') as $paragraphNode) {
            $text = '';
            $imageRelationship = null;

            foreach ($paragraphNode->childNodes as $child) {
                if ($child->nodeType !== XML_ELEMENT_NODE) {
                    continue;
                }

                $localName = $child->localName;

                if ($localName === 'r') {
                    foreach ($child->childNodes as $runChild) {
                        if ($runChild->nodeType !== XML_ELEMENT_NODE) {
                            continue;
                        }

                        if ($runChild->localName === 't') {
                            $text .= $runChild->textContent;
                        }

                        if ($runChild->localName === 'br') {
                            $text .= "\n";
                        }

                        if ($runChild->localName === 'drawing') {
                            $blip = $xpath->query('.//a:blip', $runChild)->item(0);
                            if ($blip instanceof \DOMElement) {
                                $imageRelationship = $blip->getAttributeNS(
                                    'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
                                    'embed'
                                );
                            }
                        }
                    }

                    continue;
                }

                if ($localName === 'oMath') {
                    $text .= $this->extractMathText($child);
                }
            }

            $normalized = $this->normalizeParagraphText($text);
            if ($normalized === '' && ! $imageRelationship) {
                continue;
            }

            $paragraphs[] = [
                'text' => $normalized,
                'image_path' => $imageRelationship,
            ];
        }

        return $paragraphs;
    }

    private function extractMathText(\DOMNode $node): string
    {
        if ($node->localName === 'oMath') {
            $text = '';
            foreach ($node->childNodes as $child) {
                $text .= $this->extractMathText($child);
            }

            return $text;
        }

        if ($node->localName === 'sPre') {
            $sup = '';
            $sub = '';
            $base = '';

            foreach ($node->childNodes as $child) {
                if ($child->localName === 'sup') {
                    $sup = trim($this->extractMathText($child));
                } elseif ($child->localName === 'sub') {
                    $sub = trim($this->extractMathText($child));
                } elseif ($child->localName === 'e') {
                    $base = trim($this->extractMathText($child));
                }
            }

            return sprintf('%s/%s %s', $sup, $sub, $base);
        }

        if (in_array($node->localName, ['sup', 'sub', 'e'], true)) {
            $text = '';
            foreach ($node->childNodes as $child) {
                $text .= $this->extractMathText($child);
            }

            return $text;
        }

        if ($node->localName === 'r' || $node->localName === 'ctrlPr' || $node->localName === 'sPrePr') {
            $text = '';
            foreach ($node->childNodes as $child) {
                $text .= $this->extractMathText($child);
            }

            return $text;
        }

        if ($node->localName === 't') {
            return $node->textContent;
        }

        $text = '';
        foreach ($node->childNodes as $child) {
            $text .= $this->extractMathText($child);
        }

        return $text;
    }

    private function normalizeParagraphText(string $text): string
    {
        $text = preg_replace('/(?<!\n)([A-Ea-e])\. /', "\n$1. ", $text) ?? $text;
        $text = preg_replace('/\n+/', "\n", $text) ?? $text;
        $text = str_replace(["\r\n", "\r"], "\n", $text);

        return trim($text);
    }

    private function extractImage(ZipArchive $zip, array $relationships, ?string $relationshipId, string $mediaDirectory): ?string
    {
        if (! $relationshipId || ! isset($relationships[$relationshipId])) {
            return null;
        }

        $source = 'word/' . ltrim($relationships[$relationshipId], '/');
        $contents = $zip->getFromName($source);

        if ($contents === false) {
            return null;
        }

        if (! is_dir(public_path($mediaDirectory))) {
            mkdir(public_path($mediaDirectory), 0755, true);
        }

        $filename = basename($source);
        $destination = public_path(trim($mediaDirectory, '/') . DIRECTORY_SEPARATOR . $filename);

        file_put_contents($destination, $contents);

        return trim($mediaDirectory, '/') . '/' . $filename;
    }

    private function isPracticeAnswerLine(string $text): bool
    {
        return str_starts_with($text, 'Jawaban:');
    }

    private function extractAnswerLetter(string $text): ?string
    {
        if (preg_match('/Jawaban:\s*([A-Ea-e])/', $text, $matches)) {
            return strtoupper($matches[1]);
        }

        return null;
    }

    private function isFeedbackLine(string $text): bool
    {
        return str_starts_with($text, 'Feedback');
    }

    private function stripFeedbackPrefix(array $part): array
    {
        $part['text'] = trim((string) preg_replace('/^Feedback\s*:?\s*/', '', $part['text']));

        return $part;
    }

    private function looksLikePracticeMultipleChoiceQuestion(string $text, ?string $imagePath): bool
    {
        if ($imagePath) {
            return true;
        }

        if (str_starts_with($text, 'Perhatikan gambar')) {
            return true;
        }

        return preg_match('/(?:^|\n)[a-e]\.\s+/i', $text) === 1;
    }

    private function looksLikePracticeEssayQuestion(string $text, ?string $imagePath): bool
    {
        if ($imagePath) {
            return true;
        }

        return str_contains($text, '?') || str_contains($text, '!');
    }

    private function finalizePracticeQuestion(
        array &$questions,
        ?string $mode,
        array &$pendingQuestionParts,
        array &$pendingFeedbackParts,
        ?string &$answerLetter
    ): void {
        if ($mode === null || $pendingQuestionParts === []) {
            $pendingQuestionParts = [];
            $pendingFeedbackParts = [];
            $answerLetter = null;

            return;
        }

        $imagePath = $this->extractPartImage($pendingQuestionParts) ?? $this->extractPartImage($pendingFeedbackParts);
        $questionText = $this->combineTextParts($pendingQuestionParts);
        $feedbackText = $this->combineTextParts($pendingFeedbackParts);

        if ($mode === 'multiple_choice') {
            [$prompt, $options] = $this->parseMultipleChoiceContent($questionText);
            $questions[] = [
                'type' => 'multiple_choice',
                'question' => $prompt,
                'image_path' => $imagePath,
                'options' => $options !== [] ? array_values($options) : ['A', 'B', 'C', 'D', 'E'],
                'correct_answer' => $options !== []
                    ? ($options[$answerLetter] ?? null)
                    : $answerLetter,
                'points' => 1,
                'explanation' => $feedbackText !== '' ? $feedbackText : null,
            ];
        }

        if ($mode === 'essay') {
            $questions[] = [
                'type' => 'essay',
                'question' => $questionText,
                'image_path' => $imagePath,
                'options' => [],
                'correct_answer' => '',
                'points' => 1,
                'explanation' => $feedbackText !== '' ? $feedbackText : null,
            ];
        }

        $pendingQuestionParts = [];
        $pendingFeedbackParts = [];
        $answerLetter = null;
    }

    private function finalizeExamQuestion(array &$questions, array &$questionParts, ?string &$answerLetter): void
    {
        if ($questionParts === []) {
            $questionParts = [];
            $answerLetter = null;

            return;
        }

        $imagePath = $this->extractPartImage($questionParts);
        $content = $this->combineTextParts($questionParts);
        [$prompt, $options] = $this->parseMultipleChoiceContent($content);

        $questions[] = [
            'type' => 'multiple_choice',
            'question' => $prompt,
            'image_path' => $imagePath,
            'options' => $options !== [] ? array_values($options) : ['A', 'B', 'C', 'D', 'E'],
            'correct_answer' => $options !== []
                ? ($options[$answerLetter] ?? null)
                : $answerLetter,
            'points' => 4,
            'explanation' => null,
        ];

        $questionParts = [];
        $answerLetter = null;
    }

    private function combineTextParts(array $parts): string
    {
        $lines = [];

        foreach ($parts as $part) {
            if (! empty($part['text'])) {
                $lines[] = $part['text'];
            }
        }

        return trim(implode("\n", $lines));
    }

    private function extractPartImage(array $parts): ?string
    {
        foreach ($parts as $part) {
            if (! empty($part['image_path'])) {
                return $part['image_path'];
            }
        }

        return null;
    }

    private function parseMultipleChoiceContent(string $content): array
    {
        preg_match_all('/(?:^|\n)([A-Ea-e])\.\s*(.+?)(?=(?:\n[A-Ea-e]\.\s)|$)/s', $content, $matches, PREG_SET_ORDER);

        if ($matches === []) {
            return [trim($content), []];
        }

        $firstOptionPosition = strpos($content, $matches[0][0]);
        $prompt = trim((string) substr($content, 0, $firstOptionPosition));
        $options = [];

        foreach ($matches as $match) {
            $options[strtoupper($match[1])] = trim($match[2]);
        }

        return [$prompt, $options];
    }
}
