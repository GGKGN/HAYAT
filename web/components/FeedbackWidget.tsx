"use client"

import { useState } from "react"
import { MessageSquare, X, Send, Loader2 } from "lucide-react"
import { createFeedback } from "@/actions/feedback"

export default function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim()) return

        setIsLoading(true)
        setStatus("IDLE")

        const result = await createFeedback(message)

        setIsLoading(false)
        if (result.success) {
            setStatus("SUCCESS")
            setMessage("")
            setTimeout(() => {
                setIsOpen(false)
                setStatus("IDLE")
            }, 2000)
        } else {
            setStatus("ERROR")
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white rounded-full p-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group"
                >
                    <MessageSquare className="w-6 h-6" />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold">
                        Görüş Bildir
                    </span>
                </button>
            )}

            {/* Popover Form */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 md:w-96 border border-gray-100 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-primary font-bold">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <span>Görüşünüz Önemli</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {status === "SUCCESS" ? (
                        <div className="bg-green-50 text-green-600 rounded-xl p-6 text-center animate-in zoom-in spin-in-12 duration-300">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Send className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-lg mb-1">Teşekkürler!</h4>
                            <p className="text-sm">Görüşünüz bize ulaştı.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Fikir, öneri veya şikayetlerinizi bizimle anonim olarak paylaşabilirsiniz..."
                                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm mb-4 placeholder:text-gray-400 text-gray-700"
                                required
                            />

                            {status === "ERROR" && (
                                <div className="text-red-500 text-xs mb-3 font-medium bg-red-50 p-2 rounded-lg text-center">
                                    Bir hata oluştu. Lütfen tekrar deneyin.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || !message.trim()}
                                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Gönderiliyor...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Gönder
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    )
}
