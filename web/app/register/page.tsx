"use client"

import { registerUser } from "@/actions/register"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Loader2, Mail, Lock, User, UserPlus, ArrowRight } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const [password, setPassword] = useState("")

    // Password Strength Logic
    const validations = [
        { label: "En az 8 karakter", valid: password.length >= 8 },
        { label: "Bir büyük harf", valid: /[A-Z]/.test(password) },
        { label: "Bir küçük harf", valid: /[a-z]/.test(password) },
        { label: "Bir rakam", valid: /[0-9]/.test(password) },
        { label: "Bir sembol (#, ?, ! vb.)", valid: /[^A-Za-z0-9]/.test(password) },
    ]

    const strengthScore = validations.filter(v => v.valid).length
    const isStrong = strengthScore === validations.length

    const getStrengthColor = () => {
        if (strengthScore <= 2) return "bg-red-500"
        if (strengthScore <= 4) return "bg-yellow-500"
        return "bg-green-500"
    }

    const getStrengthLabel = () => {
        if (strengthScore <= 2) return "Zayıf"
        if (strengthScore <= 4) return "Orta"
        return "Güçlü"
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Final Client-Side Check
        if (!isStrong) {
            setError("Lütfen şifrenizi güçlendirin.")
            return
        }

        setIsLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        const result = await registerUser(formData)

        if (result.error) {
            setError(result.error)
            setIsLoading(false)
        } else {
            router.push("/login?message=Kayıt başarılı, lütfen giriş yapın.")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-green-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-8 sm:p-12 relative z-10 animate-in fade-in zoom-in-95 duration-500 delay-100">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3 hover:rotate-6 transition-transform duration-300">
                        <UserPlus className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        Aramıza Katıl
                    </h2>
                    <p className="text-gray-500 font-medium">
                        Yeni bir hayata başlamak için kaydol.
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
                            <label className="text-sm font-bold text-gray-700 ml-1">Ad Soyad</label>
                            <div className="relative group">
                                <User className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl outline-none transition-all font-medium text-gray-800 placeholder-gray-400"
                                    placeholder="Adınız Soyadınız"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
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
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl outline-none transition-all font-medium text-gray-800 placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Strength Meter */}
                            {password && (
                                <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-gray-500">Güvenlik: {getStrengthLabel()}</span>
                                        <span className="text-xs font-bold text-gray-400">{strengthScore}/5</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                                            style={{ width: `${(strengthScore / 5) * 100}%` }}
                                        />
                                    </div>
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        {validations.map((val, i) => (
                                            <div key={i} className={`text-xs flex items-center gap-1.5 font-medium transition-colors ${val.valid ? 'text-green-600' : 'text-gray-400'}`}>
                                                <div className={`w-3 h-3 rounded-full flex items-center justify-center ${val.valid ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                    {val.valid && <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                                                </div>
                                                {val.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || (password.length > 0 && !isStrong)}
                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                Kayıt Ol
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 font-medium">
                        Zaten hesabın var mı?{" "}
                        <Link href="/login" className="font-bold text-primary hover:text-green-700 transition-colors inline-flex items-center gap-1 hover:underline decoration-2 underline-offset-4">
                            Giriş Yap
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
