import { Heart, Target, Users, Sparkles } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Section (Hero Style - Matching Events/Projects) */}
            <div className="relative overflow-hidden bg-[#FEF9E7] pt-32 pb-20 px-4 text-center">
                {/* Playful Background Blobs */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-yellow-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-70 pointer-events-none"></div>
                <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-purple-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed opacity-70 pointer-events-none"></div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 text-primary mb-6 shadow-sm">
                        <Users className="w-5 h-5 mr-2 text-blue-500 fill-blue-500" />
                        <span className="font-bold tracking-wide text-sm uppercase">Hakkımızda</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-gray-800 mb-6 tracking-tight leading-tight">
                        Biz Kimiz<span className="text-primary">?</span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-xl leading-relaxed font-medium">
                        Rize Hayalleri Yaşatma Topluluğu (HAYAT), iyilik peşinde koşan üniversiteli gençlerin kurduğu kocaman bir ailedir.
                    </p>
                </div>
            </div>

            {/* Cards Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1: Gönüllülük */}
                    <div className="bg-white rounded-[2.5rem] p-8 text-center border border-gray-100 shadow-xl shadow-green-900/5 hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-300 hover:-translate-y-2 group">
                        <div className="w-20 h-20 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform duration-300">
                            <Heart className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-4 group-hover:text-primary transition-colors">Gönüllülük</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Karşılık beklemeden, sadece bir çocuğun yüzünde tebessüm oluşturmak için var gücümüzle çalışıyoruz.
                        </p>
                    </div>

                    {/* Card 2: Misyonumuz */}
                    <div className="bg-white rounded-[2.5rem] p-8 text-center border border-gray-100 shadow-xl shadow-green-900/5 hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-300 transform md:-translate-y-4 hover:md:-translate-y-6 z-10 group">
                        <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                            <Target className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-4 group-hover:text-primary transition-colors">Misyonumuz</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            İhtiyaç sahibi çocuklara, doğaya ve topluma fayda sağlayan sürdürülebilir projeler üretmek ve uygulamak.
                        </p>
                    </div>

                    {/* Card 3: Ailemiz */}
                    <div className="bg-white rounded-[2.5rem] p-8 text-center border border-gray-100 shadow-xl shadow-green-900/5 hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-300 hover:-translate-y-2 group">
                        <div className="w-20 h-20 mx-auto bg-pink-50 rounded-full flex items-center justify-center mb-6 text-pink-500 group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-4 group-hover:text-primary transition-colors">Ailemiz</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Tıp Fakültesinden yüzlerce gönüllü üniversite öğrencisiyle her geçen gün büyüyen kocaman bir aileyiz.
                        </p>
                    </div>
                </div>
            </div>

            {/* Story Section */}
            <div className="bg-white py-24 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Image Side */}
                        <div className="w-full lg:w-1/2">
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200 rotate-2 hover:rotate-0 transition-transform duration-500 border-8 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069&auto=format&fit=crop"
                                    alt="Hayat Topluluğu Grubu"
                                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="w-full lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-bold text-xs uppercase tracking-widest mb-6">
                                <Sparkles className="w-4 h-4" /> Hikayemiz
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
                                Küçük Bir Fikirden <br /> <span className="text-primary">Büyük Bir Harekete.</span>
                            </h2>
                            <div className="prose prose-lg text-gray-500 font-medium">
                                <p className="mb-6">
                                    2024 yılında, bir grup arkadaşın "Rize için ne yapabiliriz?" sorusuyla başlayan yolculuğumuz, bugün yüzlerce gönüllüsü olan dev bir topluluğa dönüştü.
                                </p>
                                <p>
                                    Köy okullarına kütüphaneler kurduk, sahil temizlikleri yaptık, pediatri servisindeki minik kardeşlerimizin doğum günlerini kutladık. Her geçen gün büyüyen hayallerimizle yola devam ediyoruz.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
