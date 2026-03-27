import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({
    content,
    onChange,
    placeholder,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Underline,
            Image.configure({ inline: false }),
        ],
        content: content || "",
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose-editor-content min-h-[120px] outline-none p-3 text-sm text-surface-900",
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || "");
        }
    }, []);

    if (!editor) return null;

    return (
        <div className="border border-surface-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-surface-100 bg-surface-50/50">
                <ToolbarBtn
                    active={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                >
                    <span className="font-bold text-xs">B</span>
                </ToolbarBtn>
                <ToolbarBtn
                    active={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                >
                    <span className="italic text-xs">I</span>
                </ToolbarBtn>
                <ToolbarBtn
                    active={editor.isActive("underline")}
                    onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                    title="Underline"
                >
                    <span className="underline text-xs">U</span>
                </ToolbarBtn>
                <ToolbarBtn
                    active={editor.isActive("strike")}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    title="Strikethrough"
                >
                    <span className="line-through text-xs">S</span>
                </ToolbarBtn>

                <div className="w-px h-5 bg-surface-200 mx-1" />

                <ToolbarBtn
                    active={editor.isActive("heading", { level: 2 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    title="Heading 2"
                >
                    <span className="text-xs font-bold">H2</span>
                </ToolbarBtn>
                <ToolbarBtn
                    active={editor.isActive("heading", { level: 3 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    title="Heading 3"
                >
                    <span className="text-xs font-bold">H3</span>
                </ToolbarBtn>

                <div className="w-px h-5 bg-surface-200 mx-1" />

                <ToolbarBtn
                    active={editor.isActive("bulletList")}
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    title="Bullet List"
                >
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                    </svg>
                </ToolbarBtn>
                <ToolbarBtn
                    active={editor.isActive("orderedList")}
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    title="Numbered List"
                >
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h10M7 16h10M3 8h.01M3 12h.01M3 16h.01"
                        />
                    </svg>
                </ToolbarBtn>
                <ToolbarBtn
                    active={editor.isActive("blockquote")}
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    title="Blockquote"
                >
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                    </svg>
                </ToolbarBtn>

                <div className="w-px h-5 bg-surface-200 mx-1" />

                <ToolbarBtn
                    active={editor.isActive("code")}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    title="Inline Code"
                >
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                    </svg>
                </ToolbarBtn>
                <ToolbarBtn
                    active={editor.isActive("codeBlock")}
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                    title="Code Block"
                >
                    <span className="text-[10px] font-mono">{"{}"}</span>
                </ToolbarBtn>

                <div className="w-px h-5 bg-surface-200 mx-1" />

                <ToolbarBtn
                    active={false}
                    onClick={() =>
                        editor.chain().focus().setHorizontalRule().run()
                    }
                    title="Horizontal Rule"
                >
                    <span className="text-xs">—</span>
                </ToolbarBtn>
                <ToolbarBtn
                    active={false}
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Undo"
                >
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                    </svg>
                </ToolbarBtn>
                <ToolbarBtn
                    active={false}
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Redo"
                >
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
                        />
                    </svg>
                </ToolbarBtn>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
}

function ToolbarBtn({
    active,
    onClick,
    title,
    children,
}: {
    active: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded-lg transition-colors ${
                active
                    ? "bg-primary-100 text-primary-700"
                    : "text-surface-500 hover:bg-surface-100 hover:text-surface-700"
            }`}
        >
            {children}
        </button>
    );
}
