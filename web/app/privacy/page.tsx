import { ShieldCheck } from "lucide-react"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 pt-28 pb-12 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Hero */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl mb-6 shadow-xl shadow-green-100 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                        <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                        Gizlilik Politikası
                    </h1>
                </div>

                {/* Content */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/50 shadow-xl shadow-green-900/5 text-gray-500 font-medium leading-relaxed space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">1. Giriş</h2>
                        <p>
                            Rize Hayalleri Yaşatma Topluluğu (HAYAT) olarak kişisel verilerinizin güvenliğine önem veriyoruz. Bu Gizlilik Politikası, topluluğumuza ait web sitesini ve hizmetleri kullanırken verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">2. Toplanan Veriler</h2>
                        <p>
                            Kayıt olurken, bağış yaparken veya iletişim formunu doldururken adınız, e-posta adresiniz, telefon numaranız gibi kişisel bilgileri toplayabiliriz. Bu bilgiler sadece topluluk faaliyetleri kapsamında kullanılır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">3. Verilerin Kullanımı</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Etkinlik duyuruları ve bilgilendirmeler yapmak.</li>
                            <li>Gönüllü ve üye kayıtlarını yönetmek.</li>
                            <li>Yasal yükümlülükleri yerine getirmek.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">4. Güvenlik</h2>
                        <p>
                            Verilerinizi korumak için endüstri standardı güvenlik önlemleri alıyoruz. Ancak internet üzerinden yapılan hiçbir veri iletiminin %100 güvenli olmadığını hatırlatırız.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">5. İletişim</h2>
                        <p>
                            Gizlilik politikamızla ilgili sorularınız için <a href="/contact" className="text-primary hover:underline">İletişim</a> sayfamızdan bize ulaşabilirsiniz.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
