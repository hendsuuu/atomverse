import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";

export default function Welcome() {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const glowRefs = useRef<(SVGCircleElement | null)[]>([null, null, null]);
    const dotRefs = useRef<(SVGCircleElement | null)[]>([null, null, null]);
    const coreRefs = useRef<(SVGCircleElement | null)[]>([null, null, null]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll(".reveal");
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        let animationFrameId: number;

        const CX = 210,
            CY = 185,
            A = 178,
            B = 60;
        const D2R = Math.PI / 180;

        const orbitDefs = [
            [0, 0, +0.022],
            [60, (2 * Math.PI) / 3, -0.016],
            [-60, (4 * Math.PI) / 3, +0.019],
        ];

        const phases = orbitDefs.map((o) => o[1] as number);
        const speeds = orbitDefs.map((o) => o[2] as number);
        const angles = orbitDefs.map((o) => o[0] as number);

        const position = (t: number, angleDeg: number) => {
            const theta = angleDeg * D2R;
            const cosT = Math.cos(t),
                sinT = Math.sin(t);
            const cosTheta = Math.cos(theta),
                sinTheta = Math.sin(theta);

            return [
                CX + A * cosT * cosTheta - B * sinT * sinTheta,
                CY + A * cosT * sinTheta + B * sinT * cosTheta,
            ];
        };

        const tick = () => {
            for (let i = 0; i < 3; i++) {
                phases[i] += speeds[i];
                const [x, y] = position(phases[i], angles[i]);

                if (glowRefs.current[i]) {
                    glowRefs.current[i]!.setAttribute("cx", x.toString());
                    glowRefs.current[i]!.setAttribute("cy", y.toString());
                }
                if (dotRefs.current[i]) {
                    dotRefs.current[i]!.setAttribute("cx", x.toString());
                    dotRefs.current[i]!.setAttribute("cy", y.toString());
                }
                if (coreRefs.current[i]) {
                    coreRefs.current[i]!.setAttribute("cx", x.toString());
                    coreRefs.current[i]!.setAttribute("cy", y.toString());
                }
            }

            animationFrameId = requestAnimationFrame(tick);
        };

        animationFrameId = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const faqs = [
        {
            q: "Apakah saya perlu latar belakang sains untuk mendaftar?",
            a: "Tidak sama sekali! AtomVerse dirancang untuk semua tingkat — dari pemula yang belum pernah belajar sains hingga pelajar yang ingin memperdalam pengetahuan mereka. Kurikulum kami dimulai dari konsep paling dasar secara bertahap.",
        },
        {
            q: "Bagaimana format pembelajaran di AtomVerse?",
            a: "Pembelajaran dilakukan secara online, fleksibel sesuai waktu kamu. Terdiri dari video materi HD, modul baca interaktif, kuis, dan sesi live mentoring bersama instruktur berpengalaman setiap bulannya.",
        },
        {
            q: "Apakah bisa belajar dari perangkat mobile?",
            a: "Tentu! Platform AtomVerse sepenuhnya responsif dan dapat diakses dari smartphone, tablet, maupun laptop. Kamu juga bisa mengunduh materi untuk belajar secara offline.",
        },
    ];

    return (
        <>
            <Head title="Atomverse — Modern Learning Platform" />

            <div className="overflow-x-hidden bg-white font-sans text-[#07182E] antialiased">
                <style>
                    {`
                        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                        .font-fraunces { font-family: 'Fraunces', serif; }
                        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }

                        .bg-dot-grid {
                            background-image: radial-gradient(#C6DFF6 1.4px, transparent 1.4px);
                            background-size: 26px 26px;
                        }

                        @keyframes pulse-blink {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.3; }
                        }

                        .animate-pulse-slow {
                            animation: pulse-blink 2s ease-in-out infinite;
                        }

                        .reveal {
                            opacity: 0;
                            transform: translateY(28px);
                            transition: opacity 0.6s ease, transform 0.6s ease;
                        }

                        .reveal.visible {
                            opacity: 1;
                            transform: translateY(0);
                        }

                        html {
                            scroll-behavior: smooth;
                        }
                            @keyframes float-soft {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

@keyframes float-soft-delay {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-14px); }
}

@keyframes bubble-rise {
    0% {
        transform: translateY(0) scale(0.7);
        opacity: 0;
    }
    20% {
        opacity: 1;
    }
    100% {
        transform: translateY(-85px) scale(1.08);
        opacity: 0;
    }
}

@keyframes steam {
    0% {
        transform: translateY(0) scale(0.95);
        opacity: 0;
    }
    30% {
        opacity: 0.45;
    }
    100% {
        transform: translateY(-55px) scale(1.18);
        opacity: 0;
    }
}

@keyframes liquid-sway {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-10px); }
}

@keyframes badge-float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(4deg); }
}

.animate-float-soft {
    animation: float-soft 4s ease-in-out infinite;
}

.animate-float-soft-delay {
    animation: float-soft-delay 4.8s ease-in-out infinite;
}

.animate-bubble-1 {
    animation: bubble-rise 2.6s ease-in-out infinite;
}

.animate-bubble-2 {
    animation: bubble-rise 3.1s ease-in-out infinite 0.6s;
}

.animate-bubble-3 {
    animation: bubble-rise 2.9s ease-in-out infinite 1s;
}

.animate-steam-1 {
    animation: steam 3.4s ease-in-out infinite;
}

.animate-steam-2 {
    animation: steam 3.8s ease-in-out infinite 1s;
}

.animate-liquid-sway {
    animation: liquid-sway 3.2s ease-in-out infinite;
}

.animate-badge-float {
    animation: badge-float 3s ease-in-out infinite;
}
                    `}
                </style>

                {/* NAVBAR */}
                <header className="fixed inset-x-0 top-0 z-50 border-b border-[#C6DFF6] bg-white/95 backdrop-blur-md">
                    <div className="mx-auto flex h-[68px] max-w-[1220px] items-center justify-between gap-6 px-5">
                        <a
                            href="#home"
                            className="flex items-center gap-2.5 text-[#082544]"
                        >
                            <svg
                                className="h-[38px] w-[38px] shrink-0"
                                viewBox="0 0 42 42"
                                fill="none"
                            >
                                <ellipse
                                    cx="21"
                                    cy="21"
                                    rx="19"
                                    ry="7"
                                    stroke="#1B7FE8"
                                    strokeWidth="1.7"
                                />
                                <ellipse
                                    cx="21"
                                    cy="21"
                                    rx="19"
                                    ry="7"
                                    stroke="#1B7FE8"
                                    strokeWidth="1.7"
                                    transform="rotate(60 21 21)"
                                />
                                <ellipse
                                    cx="21"
                                    cy="21"
                                    rx="19"
                                    ry="7"
                                    stroke="#1B7FE8"
                                    strokeWidth="1.7"
                                    transform="rotate(-60 21 21)"
                                />
                                <circle cx="21" cy="21" r="4.5" fill="#082544" />
                                <circle
                                    cx="19.5"
                                    cy="20"
                                    r="2.5"
                                    fill="#1B7FE8"
                                    opacity=".85"
                                />
                                <circle
                                    cx="22.5"
                                    cy="22"
                                    r="2.5"
                                    fill="#38ADEE"
                                    opacity=".85"
                                />
                            </svg>

                            <span className="font-fraunces text-xl font-extrabold tracking-tight">
                                Atom
                                <em className="not-italic text-[#1B7FE8]">
                                    verse
                                </em>
                            </span>
                        </a>

                        <ul className="hidden list-none gap-7 md:flex">
                            <li>
                                <a
                                    href="#home"
                                    className="text-[0.875rem] font-semibold text-[#3E546A] transition-colors hover:text-[#1B7FE8]"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#visi-misi"
                                    className="text-[0.875rem] font-semibold text-[#3E546A] transition-colors hover:text-[#1B7FE8]"
                                >
                                    Visi Misi
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#alur-belajar"
                                    className="text-[0.875rem] font-semibold text-[#3E546A] transition-colors hover:text-[#1B7FE8]"
                                >
                                    Alur Belajar
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#overview-materi"
                                    className="text-[0.875rem] font-semibold text-[#3E546A] transition-colors hover:text-[#1B7FE8]"
                                >
                                    Overview Materi
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#faq"
                                    className="text-[0.875rem] font-semibold text-[#3E546A] transition-colors hover:text-[#1B7FE8]"
                                >
                                    FAQ
                                </a>
                            </li>
                        </ul>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="hidden rounded-lg border border-[#D6E3F5] px-4 py-2 text-[0.88rem] font-semibold text-[#082544] transition-all hover:border-[#1B7FE8] hover:text-[#1B7FE8] sm:inline-flex"
                            >
                                Sign in
                            </Link>

                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center rounded-lg border-2 border-[#1B7FE8] bg-[#1B7FE8] px-[22px] py-[10px] text-[0.85rem] font-bold text-white transition-all duration-150 hover:-translate-y-0.5 hover:border-[#0D5CB3] hover:bg-[#0D5CB3] hover:shadow-[0_6px_20px_rgba(27,127,232,0.3)]"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </header>

                {/* HERO */}
                <section
                    id="home"
                    className="relative min-h-screen overflow-hidden bg-white pt-[68px]"
                >
                    <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-45 [clip-path:inset(0_0_0_50%)]"></div>

                    <div className="relative z-10 mx-auto grid min-h-[calc(100vh-68px)] w-full max-w-[1280px] grid-cols-1 items-center gap-10 px-5 md:grid-cols-2">
                        <div className="reveal py-[60px] md:py-[40px]">
                            <div className="mb-[22px] inline-flex items-center gap-2 rounded bg-[#EAF4FF] px-3.5 py-1.5 text-[0.78rem] font-bold uppercase tracking-wider text-[#1B7FE8]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#1B7FE8] animate-pulse-slow"></span>
                                Platform Pembelajaran Sains #1
                            </div>

                            <h1 className="font-fraunces mb-5 text-[clamp(2.3rem,4.2vw,3.6rem)] font-extrabold leading-[1.15] text-[#082544]">
                                Jelajahi Dunia
                                <br />
                                <em className="not-italic text-[#1B7FE8]">Atom</em>, Kuasai
                                <br />
                                Ilmu Sains
                            </h1>

                            <p className="mb-9 max-w-[500px] text-[1.02rem] leading-relaxed text-[#3E546A]">
                                AtomVerse menghadirkan pengalaman belajar yang interaktif,
                                terstruktur, dan menyenangkan — dirancang khusus untuk
                                membantumu memahami ilmu sains dari dasar hingga mahir.
                            </p>

                            <div className="mb-12 flex flex-wrap gap-3.5">
                                <Link
                                    href="/register"
                                    className="inline-block rounded border-2 border-[#1B7FE8] bg-[#1B7FE8] px-7 py-3 text-[0.9rem] font-bold text-white transition-all duration-150 hover:-translate-y-0.5 hover:border-[#0D5CB3] hover:bg-[#0D5CB3] hover:shadow-[0_6px_20px_rgba(27,127,232,0.3)]"
                                >
                                    Mulai Belajar Gratis
                                </Link>

                                <a
                                    href="#overview-materi"
                                    className="inline-block rounded border-2 border-[#C8D8E8] bg-transparent px-7 py-3 text-[0.9rem] font-bold text-[#07182E] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#1B7FE8] hover:text-[#1B7FE8]"
                                >
                                    Lihat Materi →
                                </a>
                            </div>

                            {/* <div className="flex flex-wrap">
                                <div className="flex flex-col pr-7 md:border-r md:border-[#C8D8E8]">
                                    <span className="font-fraunces text-[1.65rem] font-bold leading-none text-[#082544]">
                                        12K+
                                    </span>
                                    <span className="mt-1 text-[0.78rem] font-semibold text-[#7A90A8]">
                                        Pelajar Aktif
                                    </span>
                                </div>

                                <div className="flex flex-col px-0 pt-4 md:border-r md:border-[#C8D8E8] md:px-7 md:pt-0">
                                    <span className="font-fraunces text-[1.65rem] font-bold leading-none text-[#082544]">
                                        48
                                    </span>
                                    <span className="mt-1 text-[0.78rem] font-semibold text-[#7A90A8]">
                                        Modul Materi
                                    </span>
                                </div>

                                <div className="flex flex-col px-0 pt-4 md:px-7 md:pt-0">
                                    <span className="font-fraunces text-[1.65rem] font-bold leading-none text-[#082544]">
                                        4.9★
                                    </span>
                                    <span className="mt-1 text-[0.78rem] font-semibold text-[#7A90A8]">
                                        Rating Platform
                                    </span>
                                </div>
                            </div> */}
                        </div>

                       <div
                            className="reveal relative h-[calc(100vh-68px)]"
                            style={{ transitionDelay: "0.15s" }}
                        >
                            <div className="absolute bottom-0 right-[20px] h-[620px] w-[620px] rounded-full bg-[#DDE9FF] opacity-90"></div>
                            <div className="absolute bottom-[36px] right-[58px] h-[500px] w-[500px] rounded-full border-[30px] border-[#C8D8FA] opacity-80"></div>

                            <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-center">
                                <img
                                    src="/hero.png"
                                    alt="Pelajar wanita tersenyum"
                                    className="block h-full w-auto max-w-none object-contain object-bottom"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80";
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                {/* SCIENCE LAB EXPERIENCE */}
<section id="science-lab" className="relative overflow-hidden bg-[#F8FBFF] px-5 py-[96px]">
    <div className="pointer-events-none absolute left-[-80px] top-[20px] h-[260px] w-[260px] rounded-full bg-[#DDEFFF] blur-3xl opacity-70"></div>
    <div className="pointer-events-none absolute right-[-60px] bottom-[-30px] h-[280px] w-[280px] rounded-full bg-[#D8F4F8] blur-3xl opacity-70"></div>

    <div className="mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-14 md:grid-cols-2">
        <div className="reveal">
            <span className="mb-3.5 inline-block rounded bg-[#EAF4FF] px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-wider text-[#1B7FE8]">
                Experience Belajar
            </span>

            <h2 className="font-fraunces mb-4 text-[clamp(1.95rem,3vw,2.8rem)] leading-[1.15] text-[#082544]">
                Belajar Sains Jadi
                <br />
                Lebih <span className="text-[#1B7FE8]">Seru, Lucu,</span> dan
                <br />
                Mudah Dipahami
            </h2>

            <p className="max-w-[560px] text-[0.97rem] leading-[1.8] text-[#3E546A]">
                AtomVerse menghadirkan suasana belajar seperti laboratorium mini
                yang menyenangkan. Lewat visual interaktif, eksperimen virtual,
                dan ilustrasi yang ramah untuk pelajar, materi sains terasa
                lebih dekat, tidak menegangkan, dan jauh lebih menarik untuk
                dieksplorasi setiap hari.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-[20px] border border-[#D9E8F7] bg-white p-5 shadow-[0_10px_30px_rgba(27,127,232,0.06)]">
                    <div className="mb-2 text-[1.35rem]">🧪</div>
                    <h4 className="mb-1 text-[0.92rem] font-bold text-[#082544]">
                        Eksperimen Visual
                    </h4>
                    <p className="text-[0.82rem] leading-[1.65] text-[#3E546A]">
                        Konsep abstrak dijelaskan lewat ilustrasi dan simulasi
                        yang lebih mudah dipahami pelajar.
                    </p>
                </div>

                <div className="rounded-[20px] border border-[#D9E8F7] bg-white p-5 shadow-[0_10px_30px_rgba(27,127,232,0.06)]">
                    <div className="mb-2 text-[1.35rem]">🔬</div>
                    <h4 className="mb-1 text-[0.92rem] font-bold text-[#082544]">
                        Belajar Lebih Menyenangkan
                    </h4>
                    <p className="text-[0.82rem] leading-[1.65] text-[#3E546A]">
                        Gaya visual yang playful membantu siswa lebih fokus dan
                        tidak cepat bosan saat belajar.
                    </p>
                </div>

                <div className="rounded-[20px] border border-[#D9E8F7] bg-white p-5 shadow-[0_10px_30px_rgba(27,127,232,0.06)]">
                    <div className="mb-2 text-[1.35rem]">📘</div>
                    <h4 className="mb-1 text-[0.92rem] font-bold text-[#082544]">
                        Materi Bertahap
                    </h4>
                    <p className="text-[0.82rem] leading-[1.65] text-[#3E546A]">
                        Disusun dari dasar hingga lanjutan agar progres belajar
                        terasa lebih jelas dan terarah.
                    </p>
                </div>

                <div className="rounded-[20px] border border-[#D9E8F7] bg-white p-5 shadow-[0_10px_30px_rgba(27,127,232,0.06)]">
                    <div className="mb-2 text-[1.35rem]">✨</div>
                    <h4 className="mb-1 text-[0.92rem] font-bold text-[#082544]">
                        Ramah untuk Pemula
                    </h4>
                    <p className="text-[0.82rem] leading-[1.65] text-[#3E546A]">
                        Cocok untuk siswa yang baru mulai belajar kimia, fisika,
                        maupun sains umum.
                    </p>
                </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-3.5">
                <Link
                    href="/register"
                    className="inline-block rounded border-2 border-[#1B7FE8] bg-[#1B7FE8] px-7 py-3 text-[0.9rem] font-bold text-white transition-all duration-150 hover:-translate-y-0.5 hover:border-[#0D5CB3] hover:bg-[#0D5CB3] hover:shadow-[0_6px_20px_rgba(27,127,232,0.3)]"
                >
                    Coba Pengalaman Belajar
                </Link>

                <a
                    href="#overview-materi"
                    className="inline-block rounded border-2 border-[#C8D8E8] bg-transparent px-7 py-3 text-[0.9rem] font-bold text-[#07182E] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#1B7FE8] hover:text-[#1B7FE8]"
                >
                    Lihat Materi →
                </a>
            </div>
        </div>

        <div
            className="reveal relative"
            style={{ transitionDelay: "0.12s" }}
        >
            <div className="relative mx-auto flex min-h-[560px] w-full max-w-[560px] items-end justify-center overflow-hidden rounded-[32px] border border-[#D8E7F7] bg-white shadow-[0_24px_70px_rgba(27,127,232,0.12)]">
                {/* floating badges */}
                <div className="animate-badge-float absolute left-[24px] top-[26px] flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE7F0] text-[1.5rem] shadow-sm">
                    😊
                </div>
                <div
                    className="animate-badge-float absolute right-[22px] top-[24px] flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0C9] text-[1.7rem] shadow-sm"
                    style={{ animationDelay: "0.6s" }}
                >
                    ☀️
                </div>
                <div
                    className="animate-badge-float absolute right-[78px] top-[84px] flex h-10 w-10 items-center justify-center rounded-full bg-[#E7F6FF] text-[1rem] shadow-sm"
                    style={{ animationDelay: "1s" }}
                >
                    💡
                </div>
                <div
                    className="animate-badge-float absolute left-[80px] top-[92px] flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF7D6] text-[1rem] shadow-sm"
                    style={{ animationDelay: "1.3s" }}
                >
                    🐝
                </div>
                <div
                    className="animate-badge-float absolute right-[24px] top-[140px] flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF4FF] text-[1rem] shadow-sm"
                    style={{ animationDelay: "1.5s" }}
                >
                    ⚛️
                </div>

                {/* background shelves */}
                <div className="absolute left-0 top-[150px] h-[230px] w-[88px] rounded-r-[18px] bg-[#F3E8D7]">
                    <div className="absolute left-3 right-3 top-5 h-2 rounded bg-[#D3B998]"></div>
                    <div className="absolute left-3 right-3 top-[86px] h-2 rounded bg-[#D3B998]"></div>
                    <div className="absolute left-3 right-3 top-[148px] h-2 rounded bg-[#D3B998]"></div>
                </div>

                <div className="absolute right-0 top-[150px] h-[230px] w-[88px] rounded-l-[18px] bg-[#F3E8D7]">
                    <div className="absolute left-3 right-3 top-5 h-2 rounded bg-[#D3B998]"></div>
                    <div className="absolute left-3 right-3 top-[86px] h-2 rounded bg-[#D3B998]"></div>
                    <div className="absolute left-3 right-3 top-[148px] h-2 rounded bg-[#D3B998]"></div>
                </div>

                {/* desk */}
                <div className="absolute bottom-0 left-0 h-[120px] w-full bg-[#F3D89C]"></div>

                {/* notebook */}
                <div className="absolute bottom-[34px] left-1/2 h-[26px] w-[120px] -translate-x-1/2 rounded-[8px] border border-[#C88E8E] bg-white shadow-sm"></div>

                {/* left flask */}
                <div className="absolute bottom-[28px] left-[24px]">
                    <div className="relative h-[90px] w-[76px]">
                        <div className="absolute left-1/2 top-0 h-[22px] w-[12px] -translate-x-1/2 rounded-t-full bg-[#D7E7F5]"></div>
                        <div className="absolute bottom-0 left-0 h-[72px] w-[76px] rounded-b-[38px] rounded-t-[26px] border-[4px] border-[#BFD8F2] bg-[#F9FCFF]"></div>
                        <div className="absolute bottom-[4px] left-[4px] h-[42px] w-[68px] rounded-b-[34px] rounded-t-[18px] bg-[#FFB52E] opacity-85"></div>
                    </div>
                </div>

                {/* right flask */}
                <div className="absolute bottom-[26px] right-[28px]">
                    <div className="relative h-[90px] w-[76px]">
                        <div className="absolute left-1/2 top-0 h-[22px] w-[12px] -translate-x-1/2 rounded-t-full bg-[#D7E7F5]"></div>
                        <div className="absolute bottom-0 left-0 h-[72px] w-[76px] rounded-b-[38px] rounded-t-[26px] border-[4px] border-[#BFD8F2] bg-[#F9FCFF]"></div>
                        <div className="absolute bottom-[4px] left-[4px] h-[40px] w-[68px] rounded-b-[34px] rounded-t-[18px] bg-[#A55CFF] opacity-70"></div>
                    </div>
                </div>

                {/* test tubes */}
                <div className="absolute bottom-[26px] right-[96px] flex items-end gap-2 rounded-[12px] border border-[#8E6B4B] bg-[#9B724F] px-3 py-2">
                    <div className="h-[62px] w-[14px] rounded-b-[10px] rounded-t-[8px] border-[3px] border-[#BFD8F2] bg-[linear-gradient(to_top,#FF7AB6_0%,#FF7AB6_55%,#F9FCFF_55%,#F9FCFF_100%)]"></div>
                    <div className="h-[72px] w-[14px] rounded-b-[10px] rounded-t-[8px] border-[3px] border-[#BFD8F2] bg-[linear-gradient(to_top,#89D6FF_0%,#89D6FF_52%,#F9FCFF_52%,#F9FCFF_100%)]"></div>
                    <div className="h-[56px] w-[14px] rounded-b-[10px] rounded-t-[8px] border-[3px] border-[#BFD8F2] bg-[linear-gradient(to_top,#FFD257_0%,#FFD257_50%,#F9FCFF_50%,#F9FCFF_100%)]"></div>
                </div>

                {/* center chemistry bottle */}
                <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2">
                    <div className="relative h-[210px] w-[126px]">
                        <div className="absolute left-1/2 top-0 h-[46px] w-[26px] -translate-x-1/2 rounded-t-[12px] bg-[#535353]"></div>
                        <div className="absolute left-1/2 top-[18px] h-[22px] w-[50px] -translate-x-1/2 rounded-[999px] bg-[#6B6B6B]"></div>

                        <div className="absolute left-1/2 top-[34px] h-[130px] w-[126px] -translate-x-1/2 rounded-b-[58px] rounded-t-[58px] border-[5px] border-[#BCD6EE] bg-[rgba(255,255,255,0.72)] backdrop-blur-sm"></div>

                        <div className="absolute bottom-[48px] left-[9px] h-[62px] w-[108px] overflow-hidden rounded-b-[48px] rounded-t-[24px]">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#2AA7CC] via-[#4FC7DD] to-[#8CEAF5]"></div>
                            <div className="animate-liquid-sway absolute -top-2 left-[-8%] h-5 w-[116%] rounded-[100%] bg-[rgba(255,255,255,0.28)]"></div>
                        </div>

                        <span className="animate-bubble-1 absolute bottom-[72px] left-[28px] h-3 w-3 rounded-full bg-white/70"></span>
                        <span className="animate-bubble-2 absolute bottom-[88px] left-[52px] h-2.5 w-2.5 rounded-full bg-white/65"></span>
                        <span className="animate-bubble-3 absolute bottom-[68px] right-[26px] h-2 w-2 rounded-full bg-white/70"></span>

                        <span className="animate-steam-1 absolute left-[34px] top-[6px] h-[70px] w-[48px] rounded-full bg-[#CDEDCF] blur-[10px]"></span>
                        <span className="animate-steam-2 absolute left-[50px] top-[-6px] h-[80px] w-[54px] rounded-full bg-[#DFF6E0] blur-[12px]"></span>

                        <div className="absolute bottom-0 left-1/2 h-[48px] w-[150px] -translate-x-1/2 rounded-t-[12px] rounded-b-[22px] bg-[#555] shadow-md"></div>
                        <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 rounded bg-[#EEE4CF] px-4 py-1 text-[0.72rem] font-bold text-[#5A4E39]">
                            Atom Lab
                        </div>
                    </div>
                </div>

                {/* character left */}
                <div className="animate-float-soft absolute bottom-[118px] left-[76px]">
                    <div className="relative h-[250px] w-[170px]">
                        <div className="absolute left-[28px] top-[24px] h-[108px] w-[108px] rounded-full bg-[#4E3940]"></div>
                        <div className="absolute left-[34px] top-[38px] h-[92px] w-[96px] rounded-full bg-[#FFE0D2]"></div>

                        <div className="absolute left-[50px] top-[74px] h-3 w-3 rounded-full bg-[#5E413F]"></div>
                        <div className="absolute left-[92px] top-[74px] h-3 w-3 rounded-full bg-[#5E413F]"></div>
                        <div className="absolute left-[70px] top-[94px] h-[10px] w-[24px] rounded-full border-b-[3px] border-[#D17B7B]"></div>

                        <div className="absolute left-[45px] top-[74px] h-[26px] w-[26px] rounded-full border-[3px] border-[#8F7B6D] bg-transparent"></div>
                        <div className="absolute left-[86px] top-[74px] h-[26px] w-[26px] rounded-full border-[3px] border-[#8F7B6D] bg-transparent"></div>
                        <div className="absolute left-[71px] top-[84px] h-[3px] w-[18px] bg-[#8F7B6D]"></div>

                        <div className="absolute left-[40px] top-[130px] h-[98px] w-[96px] rounded-t-[24px] rounded-b-[16px] bg-white border border-[#D9E8F7]"></div>
                        <div className="absolute left-[60px] top-[132px] h-[90px] w-[44px] bg-[#D9C6B4]"></div>
                        <div className="absolute left-[69px] top-[132px] h-[58px] w-[20px] bg-[#C96E23]"></div>

                        <div className="absolute left-[22px] top-[144px] h-[18px] w-[42px] rounded-full bg-[#FFE0D2] rotate-[-18deg]"></div>
                        <div className="absolute left-[112px] top-[140px] h-[18px] w-[42px] rounded-full bg-[#FFE0D2] rotate-[20deg]"></div>
                    </div>
                </div>

                {/* character right */}
                <div className="animate-float-soft-delay absolute bottom-[114px] right-[66px]">
                    <div className="relative h-[248px] w-[172px]">
                        <div className="absolute left-[30px] top-[28px] h-[102px] w-[108px] rounded-full bg-[#C98245]"></div>
                        <div className="absolute left-[38px] top-[42px] h-[92px] w-[96px] rounded-full bg-[#FFE2D0]"></div>

                        <div className="absolute left-[56px] top-[78px] h-3 w-3 rounded-full bg-[#5E413F]"></div>
                        <div className="absolute left-[97px] top-[78px] h-3 w-3 rounded-full bg-[#5E413F]"></div>
                        <div className="absolute left-[76px] top-[96px] h-[10px] w-[22px] rounded-full border-b-[3px] border-[#D17B7B]"></div>

                        <div className="absolute left-[44px] top-[134px] h-[98px] w-[96px] rounded-t-[24px] rounded-b-[16px] border border-[#D9E8F7] bg-white"></div>
                        <div className="absolute left-[65px] top-[136px] h-[88px] w-[42px] bg-[#CBB8A9]"></div>
                        <div className="absolute left-[74px] top-[136px] h-[58px] w-[20px] bg-[#BE4A45]"></div>

                        <div className="absolute left-[20px] top-[160px] h-[18px] w-[44px] rounded-full bg-[#FFE2D0] rotate-[-20deg]"></div>
                        <div className="absolute left-[114px] top-[150px] h-[18px] w-[42px] rounded-full bg-[#FFE2D0] rotate-[22deg]"></div>

                        {/* tube in hand */}
                        <div className="absolute left-[112px] top-[122px] rotate-[24deg]">
                            <div className="h-[54px] w-[14px] rounded-b-[10px] rounded-t-[8px] border-[3px] border-[#BFD8F2] bg-[linear-gradient(to_top,#FFD257_0%,#FFD257_40%,#F9FCFF_40%,#F9FCFF_100%)]"></div>
                        </div>
                    </div>
                </div>

                {/* small desk flasks */}
                <div className="absolute bottom-[24px] left-[112px]">
                    <div className="relative h-[78px] w-[58px]">
                        <div className="absolute left-1/2 top-0 h-[18px] w-[10px] -translate-x-1/2 rounded-t-full bg-[#D7E7F5]"></div>
                        <div className="absolute bottom-0 left-0 h-[60px] w-[58px] rounded-b-[30px] rounded-t-[22px] border-[4px] border-[#BFD8F2] bg-[#F9FCFF]"></div>
                        <div className="absolute bottom-[4px] left-[4px] h-[28px] w-[50px] rounded-b-[26px] rounded-t-[14px] bg-[#B267FF] opacity-75"></div>
                    </div>
                </div>

                <div className="absolute bottom-[26px] left-[176px]">
                    <div className="relative h-[66px] w-[18px] rounded-b-[10px] rounded-t-[10px] border-[3px] border-[#BFD8F2] bg-[linear-gradient(to_top,#FF7AB6_0%,#FF7AB6_44%,#F9FCFF_44%,#F9FCFF_100%)]"></div>
                </div>
            </div>
        </div>
    </div>
</section>

                {/* WHAT IS ATOM */}
                <section id="atom" className="bg-[#EAF4FF] px-5 py-[96px]">
                    <div className="mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-[80px] md:grid-cols-2">
                        <div className="reveal">
                            <span className="mb-3.5 inline-block rounded bg-[#EAF4FF] px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-wider text-[#1B7FE8]">
                                Pengetahuan Dasar
                            </span>

                            <h2 className="font-fraunces mb-3.5 text-[clamp(1.85rem,3vw,2.7rem)] leading-[1.15] text-[#082544]">
                                Apa Itu Atom?
                            </h2>

                            <p className="text-[0.97rem] leading-[1.75] text-[#3E546A]">
                                Atom adalah unit terkecil dari materi yang masih
                                mempertahankan sifat kimia suatu unsur. Kata{" "}
                                <em className="italic">atom</em> berasal dari
                                bahasa Yunani{" "}
                                <strong className="font-bold">atomos</strong> —
                                berarti "tidak dapat dibagi."
                            </p>

                            <br />

                            <p className="text-[0.97rem] leading-[1.75] text-[#3E546A]">
                                Setiap atom memiliki{" "}
                                <strong className="font-bold">
                                    inti (nukleus)
                                </strong>{" "}
                                yang tersusun dari proton dan neutron, serta
                                dikelilingi oleh{" "}
                                <strong className="font-bold">elektron</strong>{" "}
                                yang bergerak dalam lapisan-lapisan kulit atom
                                dengan tingkat energi berbeda.
                            </p>

                            <div className="mt-9 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                <div className="rounded-lg border border-[#C6DFF6] bg-white p-5 transition-shadow hover:shadow-[0_4px_20px_rgba(27,127,232,0.1)]">
                                    <div className="mb-2.5 text-[1.4rem]">🔵</div>
                                    <h4 className="mb-1 text-[0.875rem] font-bold text-[#082544]">
                                        Proton
                                    </h4>
                                    <p className="text-[0.8rem] leading-relaxed text-[#3E546A]">
                                        Partikel bermuatan positif di dalam inti
                                        atom. Jumlahnya menentukan nomor atom
                                        suatu unsur.
                                    </p>
                                </div>

                                <div className="rounded-lg border border-[#C6DFF6] bg-white p-5 transition-shadow hover:shadow-[0_4px_20px_rgba(27,127,232,0.1)]">
                                    <div className="mb-2.5 text-[1.4rem]">⚪</div>
                                    <h4 className="mb-1 text-[0.875rem] font-bold text-[#082544]">
                                        Neutron
                                    </h4>
                                    <p className="text-[0.8rem] leading-relaxed text-[#3E546A]">
                                        Partikel netral di dalam inti atom.
                                        Berperan menjaga kestabilan inti atom.
                                    </p>
                                </div>

                                <div className="rounded-lg border border-[#C6DFF6] bg-white p-5 transition-shadow hover:shadow-[0_4px_20px_rgba(27,127,232,0.1)]">
                                    <div className="mb-2.5 text-[1.4rem]">🟡</div>
                                    <h4 className="mb-1 text-[0.875rem] font-bold text-[#082544]">
                                        Elektron
                                    </h4>
                                    <p className="text-[0.8rem] leading-relaxed text-[#3E546A]">
                                        Partikel bermuatan negatif yang
                                        mengorbit inti dalam lapisan kulit
                                        energi.
                                    </p>
                                </div>

                                <div className="rounded-lg border border-[#C6DFF6] bg-white p-5 transition-shadow hover:shadow-[0_4px_20px_rgba(27,127,232,0.1)]">
                                    <div className="mb-2.5 text-[1.4rem]">🔬</div>
                                    <h4 className="mb-1 text-[0.875rem] font-bold text-[#082544]">
                                        Kulit Atom
                                    </h4>
                                    <p className="text-[0.8rem] leading-relaxed text-[#3E546A]">
                                        Lapisan orbital tempat elektron
                                        berpindah dan memancarkan atau menyerap
                                        energi.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="reveal flex flex-col items-center gap-5"
                            style={{ transitionDelay: "0.12s" }}
                        >
                            <svg
                                viewBox="0 0 420 380"
                                className="w-full max-w-[420px]"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    cx="210"
                                    cy="185"
                                    r="145"
                                    fill="#C6DFF6"
                                    opacity=".14"
                                />

                                <ellipse
                                    cx="210"
                                    cy="185"
                                    rx="178"
                                    ry="60"
                                    fill="none"
                                    stroke="#A8CCE8"
                                    strokeWidth="1.6"
                                    strokeDasharray="6 4"
                                />
                                <ellipse
                                    cx="210"
                                    cy="185"
                                    rx="178"
                                    ry="60"
                                    fill="none"
                                    stroke="#A8CCE8"
                                    strokeWidth="1.6"
                                    strokeDasharray="6 4"
                                    transform="rotate(60 210 185)"
                                />
                                <ellipse
                                    cx="210"
                                    cy="185"
                                    rx="178"
                                    ry="60"
                                    fill="none"
                                    stroke="#A8CCE8"
                                    strokeWidth="1.6"
                                    strokeDasharray="6 4"
                                    transform="rotate(-60 210 185)"
                                />

                                <circle cx="210" cy="185" r="36" fill="#082544" />
                                <circle
                                    cx="201"
                                    cy="177"
                                    r="12"
                                    fill="#1B7FE8"
                                    opacity=".92"
                                />
                                <circle
                                    cx="219"
                                    cy="177"
                                    r="12"
                                    fill="#0D5CB3"
                                    opacity=".92"
                                />
                                <circle
                                    cx="210"
                                    cy="195"
                                    r="12"
                                    fill="#38ADEE"
                                    opacity=".92"
                                />
                                <text
                                    x="210"
                                    y="248"
                                    textAnchor="middle"
                                    className="fill-[#7A90A8] text-[11px] font-semibold tracking-widest"
                                >
                                    NUKLEUS
                                </text>

                                <g>
                                    <circle
                                        ref={(el) => {
                                            glowRefs.current[0] = el;
                                        }}
                                        r="15"
                                        fill="#1B7FE8"
                                        opacity=".15"
                                    />
                                    <circle
                                        ref={(el) => {
                                            dotRefs.current[0] = el;
                                        }}
                                        r="10"
                                        fill="#1B7FE8"
                                    />
                                    <circle
                                        ref={(el) => {
                                            coreRefs.current[0] = el;
                                        }}
                                        r="5"
                                        fill="#90D4FF"
                                    />
                                </g>

                                <g>
                                    <circle
                                        ref={(el) => {
                                            glowRefs.current[1] = el;
                                        }}
                                        r="15"
                                        fill="#38ADEE"
                                        opacity=".15"
                                    />
                                    <circle
                                        ref={(el) => {
                                            dotRefs.current[1] = el;
                                        }}
                                        r="10"
                                        fill="#38ADEE"
                                    />
                                    <circle
                                        ref={(el) => {
                                            coreRefs.current[1] = el;
                                        }}
                                        r="5"
                                        fill="#B8E8FF"
                                    />
                                </g>

                                <g>
                                    <circle
                                        ref={(el) => {
                                            glowRefs.current[2] = el;
                                        }}
                                        r="15"
                                        fill="#0D5CB3"
                                        opacity=".15"
                                    />
                                    <circle
                                        ref={(el) => {
                                            dotRefs.current[2] = el;
                                        }}
                                        r="10"
                                        fill="#0D5CB3"
                                    />
                                    <circle
                                        ref={(el) => {
                                            coreRefs.current[2] = el;
                                        }}
                                        r="5"
                                        fill="#7FB8E8"
                                    />
                                </g>
                            </svg>

                            {/* <div className="w-full max-w-[420px] overflow-hidden rounded-lg border-2 border-[#C6DFF6]">
                                <img
                                    src="https://images.unsplash.com/photo-1532094349884-543559c4c0f0?w=700&q=80"
                                    alt="Laboratorium kimia"
                                    className="h-[200px] w-full object-cover"
                                    onError={(e) => {
                                        (
                                            e.target as HTMLImageElement
                                        ).src =
                                            "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=700&q=80";
                                    }}
                                />
                            </div> */}
                        </div>
                    </div>
                </section>

                {/* VISI MISI */}
                <section id="visi-misi" className="bg-white px-5 py-[96px]">
                    <div className="mx-auto max-w-[1220px]">
                        <div className="reveal mb-14">
                            <span className="mb-3.5 inline-block rounded bg-[#EAF4FF] px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-wider text-[#1B7FE8]">
                                Tujuan Kami
                            </span>
                            <h2 className="font-fraunces mb-3.5 text-[clamp(1.85rem,3vw,2.7rem)] leading-[1.15] text-[#082544]">
                                Visi &amp; Misi AtomVerse
                            </h2>
                            <p className="max-w-[520px] text-[0.97rem] leading-[1.75] text-[#3E546A]">
                                Kami hadir dengan tekad kuat untuk merevolusi
                                cara belajar sains di Indonesia melalui
                                teknologi dan pendekatan yang tepat.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="reveal relative overflow-hidden rounded-lg border border-[#EEF3F8] p-10 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[#1B7FE8]">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#EAF4FF] text-[1.4rem]">
                                    🔭
                                </div>
                                <h3 className="font-fraunces mb-3.5 text-[1.3rem] leading-[1.15] text-[#082544]">
                                    Visi
                                </h3>
                                <p className="text-[0.92rem] leading-[1.75] text-[#3E546A]">
                                    Menjadi platform edukasi sains berbasis
                                    teknologi terdepan di Asia Tenggara yang
                                    melahirkan generasi ilmuwan dan inovator
                                    masa depan yang berkarakter dan berdaya
                                    saing global.
                                </p>
                            </div>

                            <div
                                className="reveal relative overflow-hidden rounded-lg border border-[#EEF3F8] p-10 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[#1B7FE8]"
                                style={{ transitionDelay: "0.1s" }}
                            >
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#EAF4FF] text-[1.4rem]">
                                    🎯
                                </div>
                                <h3 className="font-fraunces mb-3.5 text-[1.3rem] leading-[1.15] text-[#082544]">
                                    Misi
                                </h3>
                                <ul className="mt-3.5 flex list-none flex-col gap-2.5">
                                    {[
                                        "Menyediakan materi pembelajaran sains yang terstruktur, akurat, dan mudah dipahami",
                                        "Menghadirkan pengalaman belajar interaktif berbasis data dan penelitian ilmiah",
                                        "Membangun komunitas pelajar yang aktif, kolaboratif, dan saling mendukung",
                                        "Menjamin aksesibilitas pendidikan sains berkualitas untuk seluruh lapisan masyarakat",
                                    ].map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-2.5 text-[0.9rem] leading-[1.6] text-[#3E546A]"
                                        >
                                            <span className="mt-2 h-[7px] w-[7px] min-w-[7px] rounded-full bg-[#1B7FE8]"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ALUR BELAJAR */}
                <section
                    id="alur-belajar"
                    className="bg-[#F6FAFE] px-5 py-[96px]"
                >
                    <div className="mx-auto max-w-[1220px]">
                        <div className="reveal mx-auto mb-16 max-w-[560px] text-center">
                            <span className="mb-3.5 inline-block rounded bg-[#EAF4FF] px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-wider text-[#1B7FE8]">
                                Cara Kerja
                            </span>
                            <h2 className="font-fraunces mb-3.5 text-[clamp(1.85rem,3vw,2.7rem)] leading-[1.15] text-[#082544]">
                                Alur Belajar AtomVerse
                            </h2>
                            <p className="text-[0.97rem] leading-[1.75] text-[#3E546A]">
                                Lima langkah sederhana untuk memulai perjalanan
                                belajar sainsmu bersama kami.
                            </p>
                        </div>

                        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-0">
                            <div className="absolute left-[14%] right-[14%] top-[27px] hidden h-[2px] bg-[#C6DFF6] md:block"></div>

                            {[
                                ["01", "Daftar Akun", "Buat akun gratis dalam hitungan detik tanpa kartu kredit.", "#082544"],
                                ["02", "Pilih Materi", "Telusuri kurikulum dan tentukan topik yang ingin kamu kuasai.", "#1B7FE8"],
                                ["03", "Ikuti Kelas", "Belajar lewat video, modul, dan sesi tanya jawab bersama mentor.", "#1B7FE8"],
                                ["04", "Ujian & Evaluasi", "Uji pemahamanmu dengan soal latihan dan ujian akhir modul.", "#1B7FE8"],
                                ["05", "Raih Sertifikat", "Dapatkan sertifikat resmi yang dapat kamu bagikan ke LinkedIn.", "#0D5CB3"],
                            ].map(([num, title, desc, bg], idx) => (
                                <div
                                    key={num}
                                    className="reveal relative z-10 flex flex-col items-center px-2.5 text-center"
                                    style={{
                                        transitionDelay: `${0.05 + idx * 0.07}s`,
                                    }}
                                >
                                    <div
                                        className="mb-5 flex h-[54px] w-[54px] items-center justify-center rounded text-xl font-bold text-white shadow-[0_4px_14px_rgba(27,127,232,0.3)]"
                                        style={{ backgroundColor: bg }}
                                    >
                                        {num}
                                    </div>
                                    <div className="mb-1.5 text-[0.9rem] font-bold text-[#082544]">
                                        {title}
                                    </div>
                                    <div className="text-[0.78rem] leading-[1.55] text-[#3E546A]">
                                        {desc}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* OVERVIEW MATERI */}
                <section
                    id="overview-materi"
                    className="bg-white px-5 py-[96px]"
                >
                    <div className="mx-auto max-w-[1220px]">
                        <div className="reveal mb-12 flex items-end justify-between gap-5">
                            <div>
                                <span className="mb-3.5 inline-block rounded bg-[#EAF4FF] px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-wider text-[#1B7FE8]">
                                    Kurikulum
                                </span>
                                <h2 className="font-fraunces text-[clamp(1.85rem,3vw,2.7rem)] leading-[1.15] text-[#082544]">
                                    Overview Materi
                                </h2>
                            </div>

                            <a
                                href="#promo"
                                className="inline-block whitespace-nowrap rounded border-2 border-[#C8D8E8] bg-transparent px-7 py-3 text-[0.9rem] font-bold text-[#07182E] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#1B7FE8] hover:text-[#1B7FE8]"
                            >
                                Lihat Semua Kelas →
                            </a>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                            {[
                                {
                                    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&q=80",
                                    alt: "Struktur Atom",
                                    level: "Dasar",
                                    title: "Struktur Atom & Tabel Periodik",
                                    desc: "Pelajari susunan atom, proton, neutron, elektron, serta cara membaca tabel periodik unsur secara lengkap.",
                                    jam: "8 Jam",
                                    rating: "4.9",
                                },
                                {
                                    image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&q=80",
                                    alt: "Ikatan Kimia",
                                    level: "Menengah",
                                    title: "Ikatan Kimia & Molekul",
                                    desc: "Memahami ikatan ion, kovalen, dan logam; serta cara pembentukan molekul dan senyawa dalam reaksi kimia.",
                                    jam: "6 Jam",
                                    rating: "4.8",
                                },
                                {
                                    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=80",
                                    alt: "Reaksi Kimia",
                                    level: "Lanjutan",
                                    title: "Reaksi Kimia & Stoikiometri",
                                    desc: "Kupas tuntas hukum kekekalan massa, persamaan reaksi, dan perhitungan stoikiometri dalam kimia.",
                                    jam: "10 Jam",
                                    rating: "4.9",
                                },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="reveal group overflow-hidden rounded-lg border border-[#EEF3F8] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_14px_44px_rgba(27,127,232,0.1)]"
                                    style={{
                                        transitionDelay: `${0.06 + idx * 0.06}s`,
                                    }}
                                >
                                    <div className="h-[185px] overflow-hidden bg-[#EAF4FF]">
                                        <img
                                            src={item.image}
                                            alt={item.alt}
                                            className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="p-6">
                                        <span className="mb-3 inline-block rounded bg-[#EAF4FF] px-2.5 py-[3px] text-[0.7rem] font-bold uppercase tracking-wider text-[#1B7FE8]">
                                            {item.level}
                                        </span>

                                        <h3 className="font-fraunces mb-2 text-[1.05rem] leading-[1.15] text-[#082544]">
                                            {item.title}
                                        </h3>

                                        <p className="mb-4.5 text-[0.84rem] leading-[1.65] text-[#3E546A]">
                                            {item.desc}
                                        </p>

                                        <div className="flex gap-4.5 border-t border-[#EEF3F8] pt-4">
                                            <span className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-[#7A90A8]">
                                                ⏱ {item.jam}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-[#7A90A8]">
                                                ⭐ {item.rating}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PROMO */}
                <section
                    id="promo"
                    className="relative overflow-hidden bg-[#082544] px-5 py-[96px]"
                >
                    <div className="pointer-events-none absolute -right-[80px] -top-[80px] h-[500px] w-[500px] rounded-full bg-[rgba(27,127,232,0.1)]"></div>
                    <div className="pointer-events-none absolute -bottom-[60px] -left-[60px] h-[340px] w-[340px] rounded-full bg-[rgba(56,173,238,0.07)]"></div>

                    <div className="reveal relative z-10 mx-auto max-w-[820px] text-center">
                        <span className="mb-4.5 inline-block rounded bg-[rgba(255,255,255,0.1)] px-3.5 py-1.5 text-[0.72rem] font-bold uppercase tracking-wider text-[#7FCCFF]">
                            🎉 Bergabung Sekarang
                        </span>

                        <h2 className="font-fraunces mb-4 text-[clamp(1.9rem,3.5vw,3rem)] leading-[1.15] text-white">
                            Jadilah Bagian dari
                            <br />
                            Komunitas AtomVerse
                        </h2>

                        <p className="mx-auto mb-9 max-w-[600px] text-base leading-[1.75] text-[#7FAACC]">
                            Bergabunglah bersama pelajar aktif lainnya.
                            Dapatkan akses penuh ke seluruh materi dan komunitas yang mendukungmu
                            berkembang.
                        </p>

                        <ul className="mb-12 flex list-none flex-wrap justify-center gap-x-7 gap-y-3">
                            {[
                                "Akses modul materi lengkap",
                                "Update materi gratis selamanya",
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-center gap-2.5 text-[0.9rem] text-[#AACCE8]"
                                >
                                    <span className="flex h-5 w-5 min-w-[20px] items-center justify-center rounded bg-[#1B7FE8] text-[0.7rem] text-white">
                                        ✓
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-wrap justify-center gap-3.5">
                            <Link
                                href="/register"
                                className="inline-block rounded border-2 border-white bg-white px-7 py-3 text-[0.9rem] font-bold text-[#082544] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#EAF4FF] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]"
                            >
                                Daftar Sekarang — Gratis
                            </Link>

                            <a
                                href="#overview-materi"
                                className="inline-block rounded border-2 border-[rgba(255,255,255,0.35)] bg-transparent px-7 py-3 text-[0.9rem] font-bold text-white transition-all duration-150 hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.75)]"
                            >
                                Lihat Materi Lebih Lanjut
                            </a>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="bg-white px-5 py-[96px]">
                    <div className="mx-auto max-w-[1220px]">
                        <div className="reveal mx-auto mb-14 max-w-[520px] text-center">
                            <span className="mb-3.5 inline-block rounded bg-[#EAF4FF] px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-wider text-[#1B7FE8]">
                                FAQ
                            </span>
                            <h2 className="font-fraunces mb-3.5 text-[clamp(1.85rem,3vw,2.7rem)] leading-[1.15] text-[#082544]">
                                Pertanyaan yang Sering Diajukan
                            </h2>
                            <p className="text-[0.97rem] leading-[1.75] text-[#3E546A]">
                                Belum menemukan jawaban? Hubungi tim kami kapan
                                saja.
                            </p>
                        </div>

                        <div className="mx-auto flex max-w-[800px] flex-col gap-3">
                            {faqs.map((faq, i) => (
                                <div
                                    key={i}
                                    className="reveal overflow-hidden rounded-lg border border-[#EEF3F8]"
                                    style={{ transitionDelay: `${i * 0.05}s` }}
                                >
                                    <button
                                        type="button"
                                        className={`flex w-full items-center justify-between gap-4 border-none bg-transparent px-6 py-5 text-left text-[0.95rem] font-semibold transition-colors duration-150 ${
                                            openFaqIndex === i
                                                ? "bg-[#EAF4FF] text-[#1B7FE8]"
                                                : "text-[#082544] hover:bg-[#EAF4FF]"
                                        }`}
                                        onClick={() => toggleFaq(i)}
                                    >
                                        {faq.q}
                                        <span
                                            className={`flex h-[26px] w-[26px] min-w-[26px] items-center justify-center rounded bg-[#C6DFF6] text-[1.1rem] font-bold transition-all duration-250 ${
                                                openFaqIndex === i
                                                    ? "rotate-45 bg-[#1B7FE8] text-white"
                                                    : "text-[#1B7FE8]"
                                            }`}
                                        >
                                            +
                                        </span>
                                    </button>

                                    <div
                                        className={`border-t border-[#EEF3F8] px-6 pb-5 text-[0.9rem] leading-[1.75] text-[#3E546A] ${
                                            openFaqIndex === i ? "block" : "hidden"
                                        }`}
                                    >
                                        {faq.a}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-[#082544] px-5 pb-8 pt-16">
                    <div className="mx-auto max-w-[1220px]">
                        <div className="mb-7 flex justify-between gap-12 border-b border-[rgba(255,255,255,0.1)] pb-12 lg:flex-row flex-col">
                            <div className="w-4/8">
                                <div className="flex items-center gap-2.5 text-white">
                                    <svg
                                        className="h-[38px] w-[38px] shrink-0"
                                        viewBox="0 0 42 42"
                                        fill="none"
                                    >
                                        <ellipse
                                            cx="21"
                                            cy="21"
                                            rx="19"
                                            ry="7"
                                            stroke="#1B7FE8"
                                            strokeWidth="1.7"
                                        />
                                        <ellipse
                                            cx="21"
                                            cy="21"
                                            rx="19"
                                            ry="7"
                                            stroke="#1B7FE8"
                                            strokeWidth="1.7"
                                            transform="rotate(60 21 21)"
                                        />
                                        <ellipse
                                            cx="21"
                                            cy="21"
                                            rx="19"
                                            ry="7"
                                            stroke="#1B7FE8"
                                            strokeWidth="1.7"
                                            transform="rotate(-60 21 21)"
                                        />
                                        <circle
                                            cx="21"
                                            cy="21"
                                            r="4.5"
                                            fill="#1B7FE8"
                                        />
                                        <circle
                                            cx="39.5"
                                            cy="21"
                                            r="2.2"
                                            fill="#38ADEE"
                                        />
                                    </svg>

                                    <span className="font-fraunces text-xl font-extrabold tracking-tight">
                                        Atom
                                        <em className="not-italic text-[#1B7FE8]">
                                            verse
                                        </em>
                                    </span>
                                </div>

                                <p className="mt-3.5 text-[0.85rem] leading-[1.7] text-[#5A85A5]">
                                    Platform pembelajaran sains berbasis
                                    teknologi untuk generasi pelajar Indonesia
                                    yang ingin menguasai ilmu pengetahuan secara
                                    mendalam.
                                </p>
                            </div>

                            <div>
                                <h4 className="mb-4 text-[0.78rem] font-bold uppercase tracking-wider text-white">
                                    Platform
                                </h4>
                                <ul className="flex list-none flex-col gap-2.5">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-[0.85rem] text-[#5A85A5] transition-colors duration-150 hover:text-white"
                                        >
                                            Tentang Kami
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-[0.85rem] text-[#5A85A5] transition-colors duration-150 hover:text-white"
                                        >
                                            Kelas &amp; Materi
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-[0.85rem] text-[#5A85A5] transition-colors duration-150 hover:text-white"
                                        >
                                            Blog Sains
                                        </a>
                                    </li>
                                </ul>
                            </div>


                            <div>
                                <h4 className="mb-4 text-[0.78rem] font-bold uppercase tracking-wider text-white">
                                    Dukungan
                                </h4>
                                <ul className="flex list-none flex-col gap-2.5">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-[0.85rem] text-[#5A85A5] transition-colors duration-150 hover:text-white"
                                        >
                                            Pusat Bantuan
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-[0.85rem] text-[#5A85A5] transition-colors duration-150 hover:text-white"
                                        >
                                            Hubungi Kami
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-[0.85rem] text-[#5A85A5] transition-colors duration-150 hover:text-white"
                                        >
                                            Syarat &amp; Ketentuan
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-[0.85rem] text-[#5A85A5] transition-colors duration-150 hover:text-white"
                                        >
                                            Kebijakan Privasi
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2.5 text-[0.78rem] text-[#3A5A70]">
                            <span>
                                © {new Date().getFullYear()} AtomVerse. Hak
                                cipta dilindungi undang-undang.
                            </span>
                            <span>Dibuat dengan ❤️ untuk pelajar Indonesia</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}