import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import Breadcrumb from "@/Components/Breadcrumb";

const processSkills = [
    {
        title: "Mengamati",
        description:
            "Mampu memilih alat bantu yang tepat untuk melakukan pengukuran dan pengamatan. Memperhatikan detail yang relevan dari obyek yang diamati.",
    },
    {
        title: "Mempertanyakan dan memprediksi",
        description:
            "Mengidentifikasi pertanyaan dan permasalahan yang dapat diselidiki secara ilmiah. Peserta didik menghubungkan pengetahuan yang telah dimiliki dengan pengetahuan baru untuk membuat prediksi.",
    },
    {
        title: "Merencanakan dan melakukan penyelidikan",
        description:
            "Peserta didik merencanakan penyelidikan ilmiah dan melakukan langkah-langkah operasional berdasarkan referensi yang benar untuk menjawab pertanyaan. Peserta didik melakukan pengukuran atau membandingkan variabel terikat dengan menggunakan alat yang sesuai serta memperhatikan kaidah ilmiah.",
    },
    {
        title: "Memproses, menganalisis data dan informasi",
        description:
            "Menafsirkan informasi yang didapatkan dengan jujur dan bertanggung jawab. Menganalisis menggunakan alat dan metode yang tepat, menilai relevansi informasi yang ditemukan dengan mencantumkan referensi rujukan, serta menyimpulkan hasil penyelidikan.",
    },
    {
        title: "Mengevaluasi dan refleksi",
        description:
            "Peserta didik berani dan santun dalam mengevaluasi kesimpulan melalui perbandingan dengan teori yang ada. Menunjukkan kelebihan dan kekurangan proses penyelidikan dan efeknya pada data. Menunjukkan permasalahan pada metodologi.",
    },
    {
        title: "Mengomunikasikan hasil",
        description:
            "Mengomunikasikan hasil penyelidikan secara utuh termasuk di dalamnya pertimbangan keamanan, lingkungan, dan etika yang ditunjang dengan argumen, bahasa serta konvensi sains yang sesuai konteks penyelidikan. Menunjukkan pola berpikir sistematis sesuai format yang ditentukan.",
    },
];

const indicators = [
    "Peserta didik mampu menyimpulkan konsep perkembangan teori atom.",
    "Peserta didik mampu menentukan nilai proton, elektron, dan neutron.",
    "Peserta didik mampu menuliskan notasi atom atau ion.",
    "Peserta didik mampu menganalisis perbedaan isotop, isobar, dan isoton dari suatu atom.",
    "Peserta didik mampu menyusun konfigurasi elektron dari suatu atom.",
];

const learningFlow = [
    "Mengidentifikasi perkembangan teori atom berdasarkan pendapat para ilmuwan.",
    "Mengidentifikasi partikel-partikel penyusun atom.",
    "Mengidentifikasi perbedaan proton, elektron, dan neutron dalam suatu atom.",
];

export default function Competencies() {
    return (
        <AppLayout title="Kompetensi Pembelajaran">
            <Head title="Kompetensi Pembelajaran" />

            <Breadcrumb
                items={[
                    { label: "Menu Utama", href: "/dashboard" },
                    { label: "Kompetensi Pembelajaran" },
                ]}
            />

            <section className="rounded-3xl border border-surface-200/70 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">
                    Kompetensi Pembelajaran
                </p>
                <h1 className="mt-3 text-3xl font-bold text-surface-900">
                    Capaian dan tujuan pembelajaran
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-surface-500 sm:text-base">
                    Halaman ini merangkum capaian pembelajaran, keterampilan
                    proses, indikator ketercapaian tujuan pembelajaran, dan
                    alur tujuan pembelajaran pada materi perkembangan teori atom.
                </p>
            </section>

            <section className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-5">
                    <div className="rounded-3xl border border-surface-200/70 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-surface-900">
                            Capaian pembelajaran
                        </h2>
                        <div className="mt-5 rounded-2xl bg-surface-50 px-4 py-4 text-sm leading-relaxed text-surface-600">
                            <h3 className="font-semibold text-surface-900">
                                Pemahaman Kimia
                            </h3>
                            <p className="mt-2">
                                Peserta didik mampu mengamati, menyelidiki dan
                                menjelaskan fenomena sesuai kaidah kerja ilmiah
                                dalam menjelaskan konsep kimia dalam kehidupan
                                sehari hari; menerapkan konsep kimia dalam
                                pengelolaan lingkungan termasuk menjelaskan
                                fenomena pemanasan global; menuliskan reaksi
                                kimia dan menerapkan hukum-hukum dasar kimia;
                                memahami struktur atom dan aplikasinya dalam
                                nanoteknologi.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-surface-200/70 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-surface-900">
                            Keterampilan proses
                        </h2>
                        <div className="mt-5 space-y-4">
                            {processSkills.map((skill, index) => (
                                <div
                                    key={skill.title}
                                    className="rounded-2xl border border-surface-200/70 bg-surface-50 px-4 py-4"
                                >
                                    <p className="text-sm font-semibold text-primary-700">
                                        {index + 1}. {skill.title}
                                    </p>
                                    <p className="mt-2 text-sm leading-relaxed text-surface-600">
                                        {skill.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="rounded-3xl border border-surface-200/70 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-surface-900">
                            Indikator ketercapaian tujuan pembelajaran
                        </h2>
                        <ol className="mt-5 space-y-3 text-sm leading-relaxed text-surface-600">
                            {indicators.map((item, index) => (
                                <li
                                    key={item}
                                    className="rounded-2xl bg-surface-50 px-4 py-4"
                                >
                                    <span className="font-semibold text-surface-900">
                                        {index + 1}.
                                    </span>{" "}
                                    {item}
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="rounded-3xl border border-surface-200/70 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-surface-900">
                            Alur tujuan pembelajaran
                        </h2>
                        <ol className="mt-5 space-y-3 text-sm leading-relaxed text-surface-600">
                            {learningFlow.map((item, index) => (
                                <li
                                    key={item}
                                    className="rounded-2xl bg-surface-50 px-4 py-4"
                                >
                                    <span className="font-semibold text-surface-900">
                                        {index + 1}.
                                    </span>{" "}
                                    {item}
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
