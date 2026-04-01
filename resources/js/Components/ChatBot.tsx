import { useState, useRef, useEffect, type FormEvent } from "react";
import axios from "axios";

interface Message {
    role: "user" | "model";
    text: string;
}

interface ChatBotProps {
    variant?: "floating" | "sidebar";
}

export default function ChatBot({ variant = "floating" }: ChatBotProps) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMsg: Message = { role: "user", text: trimmed };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const history = messages.map((m) => ({
                role: m.role,
                text: m.text,
            }));

            const response = await axios.post("/chatbot", {
                message: trimmed,
                history: history.slice(-18),
            });

            const botMsg: Message = {
                role: "model",
                text: response.data.reply,
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    text: "Maaf, terjadi kesalahan. Silakan coba lagi.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const chatHeader = (
        <div
            className={`flex items-center gap-3 flex-shrink-0 cursor-pointer ${
                variant === "sidebar"
                    ? "px-4 py-3 rounded-xl gradient-primary"
                    : "px-4 py-3 gradient-primary"
            }`}
            onClick={() => variant === "sidebar" && setOpen(!open)}
        >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm">Atom AI</h4>
                <p className="text-white/70 text-xs">Asisten Materi & Sistem</p>
            </div>
            {variant === "sidebar" ? (
                <svg
                    className={`w-4 h-4 text-white/70 transition-transform ${open ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            ) : (
                messages.length > 0 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setMessages([]); }}
                        className="text-white/60 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                        title="Clear chat"
                    >
                        Clear
                    </button>
                )
            )}
        </div>
    );

    const emptyState = (
        <div className="text-center py-6">
            <div className="w-10 h-10 rounded-full gradient-primary mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold text-base">A</span>
            </div>
            <p className="text-sm font-medium text-surface-900 mb-1">
                Halo! Saya Atom 👋
            </p>
            <p className="text-xs text-surface-500 mb-3 max-w-[220px] mx-auto">
                Saya bisa membantu menjelaskan materi pembelajaran dan cara menggunakan Atomverse.
            </p>
            <div className="space-y-1.5">
                {[
                    "Apa saja materi yang tersedia?",
                    "Bagaimana cara mengerjakan quiz?",
                    "Jelaskan cara navigasi materi",
                ].map((q) => (
                    <button
                        key={q}
                        onClick={() => {
                            setInput(q);
                            inputRef.current?.focus();
                        }}
                        className="block w-full text-left text-xs px-3 py-2 rounded-lg border border-surface-200 text-surface-600 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-colors"
                    >
                        {q}
                    </button>
                ))}
            </div>
        </div>
    );

    const chatMessages = (
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.length === 0 && !loading && emptyState}

            {messages.map((msg, i) => (
                <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                    <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                            msg.role === "user"
                                ? "bg-primary-600 text-white rounded-br-md"
                                : "bg-surface-100 text-surface-800 rounded-bl-md"
                        }`}
                    >
                        <MessageContent text={msg.text} isUser={msg.role === "user"} />
                    </div>
                </div>
            ))}

            {loading && (
                <div className="flex justify-start">
                    <div className="bg-surface-100 rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1.5">
                            <span className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );

    const chatInput = (
        <form
            onSubmit={handleSubmit}
            className="px-3 py-3 border-t border-surface-100 flex-shrink-0"
        >
            <div className="flex items-center gap-2 bg-surface-50 rounded-xl px-3 py-1.5 border border-surface-200 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanya tentang materi..."
                    className="flex-1 bg-transparent text-sm text-surface-900 placeholder:text-surface-400 outline-none py-1.5"
                    disabled={loading}
                    maxLength={1000}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
            {variant === "sidebar" && messages.length > 0 && (
                <button
                    type="button"
                    onClick={() => setMessages([])}
                    className="w-full text-center text-xs text-surface-400 hover:text-surface-600 mt-2 transition-colors"
                >
                    Hapus percakapan
                </button>
            )}
        </form>
    );

    /* ── Sidebar variant (embedded in page) ── */
    if (variant === "sidebar") {
        return (
            <div className="card overflow-hidden mt-4">
                {chatHeader}
                {open && (
                    <div className="flex flex-col animate-fade-in" style={{ height: "360px" }}>
                        {chatMessages}
                        {chatInput}
                    </div>
                )}
            </div>
        );
    }

    /* ── Floating variant (FAB + popup) ── */
    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                    open
                        ? "bg-surface-700 hover:bg-surface-800 rotate-0"
                        : "gradient-primary hover:shadow-xl scale-100 hover:scale-105"
                }`}
                title="Chat dengan Atom AI"
            >
                {open ? (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                )}
            </button>

            {open && (
                <div
                    className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-surface-200/60 flex flex-col animate-fade-in overflow-hidden"
                    style={{ height: "min(520px, calc(100vh - 8rem))" }}
                >
                    {chatHeader}
                    {chatMessages}
                    {chatInput}
                </div>
            )}
        </>
    );
}

function MessageContent({ text, isUser }: { text: string; isUser: boolean }) {
    if (isUser) {
        return <span>{text}</span>;
    }

    const parts = text.split(/(\*\*.*?\*\*|\n|`.*?`)/g);

    return (
        <span className="whitespace-pre-wrap">
            {parts.map((part, i) => {
                if (part === "\n") return <br key={i} />;
                if (part.startsWith("**") && part.endsWith("**")) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith("`") && part.endsWith("`")) {
                    return (
                        <code key={i} className="bg-surface-200 px-1 py-0.5 rounded text-xs">
                            {part.slice(1, -1)}
                        </code>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
}
