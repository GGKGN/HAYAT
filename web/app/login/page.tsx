"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2, Mail, Lock, LogIn, ArrowRight } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const { status } = useSession()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/")
        }
    }, [status, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (res?.error) {
            setError("Giriş yapılamadı. Bilgilerinizi kontrol ediniz.")
            setIsLoading(false)
        } else {
            router.push("/")
        }
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-green-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-8 sm:p-12 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3 hover:rotate-6 transition-transform duration-300">
                        <LogIn className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        Tekrar Hoşgeldin!
                    </h2>
                    <p className="text-gray-500 font-medium">
                        Hesabına giriş yaparak devam et.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm font-bold text-center p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl outline-none transition-all font-medium text-gray-800 placeholder-gray-400"
                                    placeholder="ornek@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Şifre</label>
                            <div className="relative group">
                                <Lock className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl outline-none transition-all font-medium text-gray-800 placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                Giriş Yap
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 font-medium">
                        Hesabın yok mu?{" "}
                        <Link href="/register" className="font-bold text-primary hover:text-green-700 transition-colors inline-flex items-center gap-1 hover:underline decoration-2 underline-offset-4">
                            Hemen Kayıt Ol
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
