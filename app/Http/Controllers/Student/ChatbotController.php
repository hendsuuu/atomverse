<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Material;
use App\Models\MaterialSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class ChatbotController extends Controller
{
    public function chat(Request $request): JsonResponse
    {
        $request->validate([
            'message' => ['required', 'string', 'max:1000'],
            'history' => ['nullable', 'array', 'max:20'],
            'history.*.role' => ['required', 'string', 'in:user,model'],
            'history.*.text' => ['required', 'string'],
        ]);

        $apiKey = config('services.gemini.api_key');
        $model = config('services.gemini.model', 'gemini-2.0-flash');

        if (empty($apiKey)) {
            return response()->json([
                'reply' => 'Chatbot belum dikonfigurasi. Hubungi administrator.',
            ], 503);
        }

        $userMessage = $request->input('message');
        $history = $request->input('history', []);

        // Build knowledge context
        $context = $this->buildContext($request->user());

        $systemPrompt = <<<PROMPT
Kamu adalah "Atom", asisten AI untuk platform pembelajaran Atomverse.

ATURAN PENTING:
1. Kamu HANYA boleh menjawab pertanyaan tentang:
   - Materi pembelajaran yang tersedia di Atomverse
   - Cara penggunaan sistem/platform Atomverse
   - Penjelasan konsep dari materi yang ada
2. Jika ditanya di luar topik tersebut, jawab dengan sopan: "Maaf, saya hanya bisa membantu mengenai materi pembelajaran dan penggunaan sistem Atomverse."
3. Jawab dalam bahasa yang sama dengan pertanyaan user (Indonesia/English).
4. Jawab dengan ringkas, jelas, dan ramah.
5. Jika user bertanya tentang materi tertentu, gunakan data materi yang tersedia di bawah.
6. Jangan pernah membuat informasi palsu tentang materi yang tidak ada.

PANDUAN PENGGUNAAN SISTEM ATOMVERSE:
- Dashboard: Halaman utama setelah login, menampilkan kursus yang diikuti
- My Courses (/courses): Daftar semua kursus yang tersedia
- Detail Kursus: Klik kursus untuk melihat daftar materi
- Materi: Klik materi untuk membaca konten lengkap (ada section-section yang bisa di-scroll)
- Quiz: Di akhir materi ada quiz untuk menguji pemahaman
- Ujian (Exam): Ujian akhir per kursus untuk evaluasi menyeluruh
- Riwayat Belajar (/history): Melihat riwayat quiz dan ujian yang sudah dikerjakan
- Navigasi Materi: Gunakan tombol Previous/Next di bawah materi untuk pindah antar materi
- Table of Contents: Di sidebar kanan ada daftar section untuk navigasi cepat

DATA MATERI YANG TERSEDIA:
{$context}
PROMPT;

        // Build Gemini API request
        $contents = [];

        // Add conversation history
        foreach ($history as $msg) {
            $contents[] = [
                'role' => $msg['role'],
                'parts' => [['text' => $msg['text']]],
            ];
        }

        // Add current user message
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $userMessage]],
        ];

        try {
            $response = Http::timeout(30)->post(
                "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}",
                [
                    'system_instruction' => [
                        'parts' => [['text' => $systemPrompt]],
                    ],
                    'contents' => $contents,
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'maxOutputTokens' => 1024,
                    ],
                    'safetySettings' => [
                        ['category' => 'HARM_CATEGORY_HARASSMENT', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
                        ['category' => 'HARM_CATEGORY_HATE_SPEECH', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
                        ['category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
                        ['category' => 'HARM_CATEGORY_DANGEROUS_CONTENT', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
                    ],
                ]
            );

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Maaf, saya tidak bisa memproses permintaan ini.';

                return response()->json(['reply' => $reply]);
            }

            return response()->json([
                'reply' => 'Maaf, terjadi kesalahan saat memproses permintaan. Silakan coba lagi.',
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'reply' => 'Maaf, layanan chatbot sedang tidak tersedia. Silakan coba lagi nanti.',
            ], 500);
        }
    }

    private function buildContext($user): string
    {
        // Cache for 10 minutes to avoid repeated DB queries
        return Cache::remember('chatbot_context', 600, function () {
            $lines = [];

            $courses = Course::where('status', 'published')
                ->with(['materials' => function ($q) {
                    $q->where('status', 'published')
                        ->orderBy('sort_order')
                        ->with(['sections' => function ($sq) {
                            $sq->orderBy('sort_order');
                        }]);
                }])
                ->get();

            foreach ($courses as $course) {
                $lines[] = "\n## Kursus: {$course->title}";
                if ($course->description) {
                    $lines[] = "Deskripsi: {$course->description}";
                }

                foreach ($course->materials as $material) {
                    $lines[] = "\n### Materi: {$material->title}";
                    if ($material->excerpt) {
                        $lines[] = "Ringkasan: {$material->excerpt}";
                    }

                    foreach ($material->sections as $section) {
                        $lines[] = "- Section: {$section->title}";
                        // Extract text content from blocks
                        if (is_array($section->blocks)) {
                            foreach ($section->blocks as $block) {
                                if (isset($block['type'])) {
                                    if ($block['type'] === 'rich_text' && !empty($block['content'])) {
                                        $text = strip_tags($block['content']);
                                        // Limit to 300 chars per block
                                        if (strlen($text) > 300) {
                                            $text = substr($text, 0, 300) . '...';
                                        }
                                        $lines[] = "  Konten: {$text}";
                                    } elseif ($block['type'] === 'quote' && !empty($block['content'])) {
                                        $lines[] = "  Quote: \"{$block['content']}\"";
                                    } elseif ($block['type'] === 'callout' && !empty($block['content'])) {
                                        $lines[] = "  Catatan ({$block['variant']}): {$block['content']}";
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return implode("\n", $lines) ?: 'Belum ada materi yang tersedia.';
        });
    }
}
