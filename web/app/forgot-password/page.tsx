"use client"

import { useState } from "react"
import { requestPasswordReset } from "@/actions/auth-reset"
import Link from "next/link"
import { ArrowLeft, Mail, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        setStatus(null)

        try {
            const res = await requestPasswordReset(email)
            if (res.success) {
                setStatus({ type: 'success', message: res.message! })
                setEmail("") // Clear form
            } else {
                setStatus({ type: 'error', message: res.error || "Bir hata oluştu." })
            }
        } catch (error) {
            setStatus({ type: 'error', message: "Sunucu hatası." })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-[2rem] shadow-xl border border-gray-100">
                <Link href="/login" className="inline-flex items-center text-gray-400 hover:text-gray-600 mb-6 transition-colors font-medium text-sm">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Giriş'e Dön
                </Link>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-800 mb-2">Şifremi Unuttum</h1>
                    <p className="text-gray-500 text-sm">Hesabınıza ait e-posta adresini girin, size sıfırlama bağlantısı gönderelim.</p>
                </div>

                {status && (
                    <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">E-Posta Adresi</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-xl p-4 font-medium text-gray-800 focus:ring-2 focus:ring-purple-100 transition-all"
                            placeholder="ornek@email.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white p-4 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 disabled:scale-100"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sıfırlama Bağlantısı Gönder"}
                    </button>
                </form>
            </div>
        </div>
    )
}
