"use client"

import { Mail, Phone, MapPin, Send, Loader2, MessageCircle } from "lucide-react"
import { getContactInfo, submitContactMessage } from "@/actions/contact"
import { useState, useEffect } from "react"

export default function ContactPage() {
    const [info, setInfo] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        getContactInfo().then(setInfo)
    }, [])

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const result = await submitContactMessage(formData)
        setLoading(false)

        if (result.success) {
            setSuccess(true)
            const form = document.querySelector('form') as HTMLFormElement
            form?.reset()
            setTimeout(() => setSuccess(false), 5000)
        } else {
            alert("Bir hata oluştu: " + (result.error || "Bilinmeyen hata"))
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Section (Hero Style - Matching Events/Projects) */}
            <div className="relative overflow-hidden bg-[#FEF9E7] pt-32 pb-20 px-4 text-center">
                {/* Playful Background Blobs */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-yellow-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-70 pointer-events-none"></div>
                <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-purple-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed opacity-70 pointer-events-none"></div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 text-primary mb-6 shadow-sm">
                        <MessageCircle className="w-5 h-5 mr-2 text-violet-500 fill-violet-500" />
                        <span className="font-bold tracking-wide text-sm uppercase">Bize Ulaşın</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-gray-800 mb-6 tracking-tight leading-tight">
                        İletişime Geç<span className="text-primary">.</span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-xl leading-relaxed font-medium">
                        Soruların, önerilerin veya sadece merhaba demek için bize yazabilirsin.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
                    {/* Left Panel - Dark Theme */}
                    <div className="bg-gray-900 lg:w-5/12 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 pointer-events-none blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full -ml-32 -mb-32 pointer-events-none blur-3xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-black mb-2">İletişim Bilgileri</h2>
                            <p className="text-gray-400 text-sm mb-12 font-medium">Bize aşağıdaki kanallardan ulaşabilirsiniz.</p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-5 group">
                                    <div className="p-4 bg-white/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-gray-400 mb-1 uppercase tracking-wider">E-Posta</h3>
                                        <p className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer break-all">{info?.email || "iletisim@rteuhayat.org"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="p-4 bg-white/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                                        <Phone className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-gray-400 mb-1 uppercase tracking-wider">Telefon</h3>
                                        <p className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer">{info?.phone || "+90 (464) 223 61 26"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="p-4 bg-white/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-gray-400 mb-1 uppercase tracking-wider">Adres</h3>
                                        <p className="font-semibold text-lg leading-relaxed max-w-xs">{info?.address || "Rize"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 text-gray-500 text-sm font-medium relative z-10">
                            Bizi sosyal medyada takip etmeyi unutma! <span className="text-white font-bold">@rteuhayat</span>
                        </div>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="lg:w-7/12 p-12 bg-white relative">
                        {success && (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 border border-green-100 shadow-lg shadow-green-100/50">
                                    <Send className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 mb-2">Mesajınız Gönderildi!</h3>
                                <p className="text-gray-500 max-w-md font-medium text-lg">Bizimle iletişime geçtiğiniz için teşekkür ederiz. En kısa sürede size dönüş yapacağız.</p>
                                <button onClick={() => setSuccess(false)} className="mt-8 text-primary font-bold hover:underline text-lg">Yeni Mesaj Gönder</button>
                            </div>
                        )}

                        <form action={handleSubmit} className="space-y-6 h-full flex flex-col justify-center">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Adın Soyadın</label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Ahmet Yılmaz"
                                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-medium placeholder-gray-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">E-Posta Adresin</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="ornek@email.com"
                                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-medium placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Konu</label>
                                <input
                                    name="subject"
                                    type="text"
                                    placeholder="Ne hakkında görüşmek istersin?"
                                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-medium placeholder-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Mesajın</label>
                                <textarea
                                    name="message"
                                    required
                                    rows={5}
                                    placeholder="Bize iletmek istediklerini buraya yaz..."
                                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-medium resize-none placeholder-gray-400"
                                ></textarea>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group text-lg"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Mesajı Gönder <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
