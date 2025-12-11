import { prisma } from "@/lib/prisma"
import { Gift, Heart, Sparkles, MapPin } from "lucide-react"

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'

export default async function SupportPage() {
    const packages = await prisma.supportPackage.findMany({
        orderBy: { price: 'asc' }
    })

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Section (Hero Style - Matching Events/Projects) */}
            <div className="relative overflow-hidden bg-[#FEF9E7] pt-32 pb-20 px-4 text-center">
                {/* Playful Background Blobs */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-yellow-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-70 pointer-events-none"></div>
                <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-purple-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed opacity-70 pointer-events-none"></div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 text-primary mb-6 shadow-sm">
                        <Heart className="w-5 h-5 mr-2 text-red-500 fill-red-500" />
                        <span className="font-bold tracking-wide text-sm uppercase">İyilik Hareketi</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-gray-800 mb-6 tracking-tight leading-tight">
                        İyiliğe <span className="text-primary">Destek Ol.</span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-xl leading-relaxed font-medium">
                        Yapacağınız her katkı, bir çocuğun hayatında yeni bir umut ışığı yakmamıza yardımcı oluyor.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                {/* Shipping Address Notice */}
                <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm">
                    <div className="p-4 bg-orange-100 rounded-2xl text-orange-600 shrink-0">
                        <MapPin className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Önemli Kargo Bilgilendirmesi</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">
                            Bağışlarınızın bize ulaşması için kargo adresi olarak lütfen <span className="text-gray-900 font-bold">"Recep Tayyip Erdoğan Üniversitesi Tıp Fakültesi Dekanlığı İslampaşa Mah. 53100 RİZE merkez"</span> adresini kullanınız.
                        </p>
                    </div>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packages.map((pkg, index) => (
                        <div
                            key={pkg.id}
                            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-green-900/5 hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-300 group flex flex-col relative overflow-hidden hover:-translate-y-2"
                        >

                            {/* Image Container */}
                            <div className="h-64 bg-gray-50 rounded-3xl mb-8 overflow-hidden relative shadow-inner flex items-center justify-center border border-gray-100">
                                {pkg.image ? (
                                    <img
                                        src={pkg.image}
                                        alt={pkg.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-red-400 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                                        <Gift className="w-24 h-24 text-red-400 relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-md" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-black text-gray-800 group-hover:text-primary transition-colors">
                                        {pkg.name}
                                    </h3>
                                    <span className="bg-primary/10 text-primary px-4 py-2 rounded-2xl text-lg font-bold">
                                        ₺{pkg.price}
                                    </span>
                                </div>

                                <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                                    {pkg.content}
                                </p>

                                <div className="mt-auto">
                                    <a
                                        href={pkg.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all hover:shadow-lg block text-center flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                                    >
                                        <Heart className="w-5 h-5 fill-white/20" />
                                        Destek Ol
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {packages.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Gift className="w-10 h-10 text-primary/40" />
                        </div>
                        <p className="text-2xl text-gray-400 font-bold mb-2">Henüz destek paketi bulunmuyor.</p>
                        <p className="text-gray-400">Çok yakında burada olacaklar.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
