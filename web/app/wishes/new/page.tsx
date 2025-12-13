import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import CreateWishForm from "@/components/wishes/CreateWishForm"
import { getVolunteers } from "@/actions/user"
import Link from "next/link"

export default async function NewWishPage() {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MEMBER")) {
        redirect("/")
    }

    const volunteers = await getVolunteers()

    return (
        <div className="min-h-screen bg-gray-50/50 pt-36 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-4">
                        <Link href="/" className="hover:text-gray-600 transition-colors">Ana Sayfa</Link>
                        <span>/</span>
                        <Link href="/profile" className="hover:text-gray-600 transition-colors">Dilekler</Link>
                        <span>/</span>
                        <span className="text-gray-800">Yeni Ekle</span>
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
                        Yeni Bir Dilek Ekle
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-wide uppercase">Taslak</span>
                    </h1>

                    <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-2xl">
                        Lütfen çocuğun dileğini ve detaylarını aşağıya giriniz. Hassas bilgileri korumaya özen gösterelim ve ailenin mahremiyet taleplerine saygı duyalım.
                    </p>
                </div>

                <CreateWishForm volunteers={volunteers} />

            </div>
        </div>
    )
}
