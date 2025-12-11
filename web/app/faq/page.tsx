"use client"
import { useState } from "react"
import { Plus, Minus, HelpCircle } from "lucide-react"

const FAQItem = ({ question, answer, isOpen, toggle }: { question: string, answer: string, isOpen: boolean, toggle: () => void }) => {
    return (
        <div className={`bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/50 overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-lg shadow-green-900/5' : 'hover:bg-white/80'}`}>
            <button
                onClick={toggle}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <h3 className={`text-lg font-bold transition-colors ${isOpen ? 'text-primary' : 'text-gray-800'}`}>
                    {question}
                </h3>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
            </button>
            <div
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-6 pt-0 text-gray-500 font-medium leading-relaxed border-t border-gray-100/50 mt-2">
                    {answer}
                </div>
            </div>
        </div>
    )
}

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs = [
        {
            question: "Gönüllü olmak için yaş sınırı var mı?",
            answer: "Hayır, HAYAT ailesine katılmak için herhangi bir yaş sınırı yoktur. İyilik yapmak isteyen herkese kapımız açık!"
        },
        {
            question: "Bağışlar nereye gidiyor?",
            answer: "Toplanan tüm bağışlar doğrudan proje masraflarına ve ihtiyaç sahibi çocuklara ulaştırılmaktadır. Düzenli olarak şeffaf raporlar yayınlıyoruz."
        },
        {
            question: "Hangi şehirlere yardım ediyorsunuz?",
            answer: "Merkezimiz Rize'de olmakla birlikte, Türkiye'nin dört bir yanındaki köy okullarına ve ihtiyaç sahiplerine ulaşmaya çalışıyoruz."
        },
        {
            question: "Etkinliklere nasıl katılabilirim?",
            answer: "Etkinlikler sayfamızdan veya sosyal medya hesaplarımızdan duyuruları takip edebilir, takvim üzerinden katılım bildirebilirsiniz."
        },
        {
            question: "Dernek üyesi olmak ücretli mi?",
            answer: "Gönüllülük esasına dayalı çalışmalarımızda üyelik ücreti bulunmamaktadır."
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 pt-28 pb-12 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="max-w-3xl mx-auto relative z-10 transition-all">
                {/* Hero */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl mb-6 shadow-xl shadow-green-100 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <HelpCircle className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        Sıkça Sorulan <span className="text-primary">Sorular</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed">
                        Aklınıza takılan soruların cevaplarını burada bulabilirsiniz.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            toggle={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
