import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { PlusCircle, Clock, CheckCircle2, PlayCircle, Loader2, Briefcase, ArrowRight } from "lucide-react"
import ProfileHeader from "@/components/ProfileHeader"

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/api/auth/signin")
    }

    const userWishes = await prisma.wish.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" }
    })

    // Fetch fresh user data to ensure profile image is up to date
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            teamMembers: {
                include: {
                    team: true,
                    role: true
                }
            }
        }
    })

    if (!user) return null

    // Old handleCreateWish removed since we moved logic to new page.

    return (
        <div className="min-h-screen bg-gray-50/50 pt-36 pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <ProfileHeader user={user} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar / Create Wish */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Teams Card */}
                        {(user.teamMembers && user.teamMembers.length > 0) && (
                            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Takımlarım</h3>
                                </div>
                                <div className="space-y-4">
                                    {user.teamMembers.map((member: any) => (
                                        <div key={member.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="font-bold text-gray-800">{member.team.name}</div>
                                            <div className="text-sm text-blue-600 font-bold mt-1 bg-blue-50 inline-block px-2 py-0.5 rounded-lg border border-blue-100">
                                                {member.role.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Wish Link Card - Only for MEMBER and ADMIN */}
                        {(session.user.role === "ADMIN" || session.user.role === "MEMBER") && (
                            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 sticky top-24">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                        <PlusCircle className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Yeni Dilek</h3>
                                </div>
                                <p className="text-gray-500 font-medium text-sm mb-6 leading-relaxed">
                                    Bir çocuğun hayalini gerçekleştirmek için yeni bir dilek oluşturun. Detaylı form sayfasına giderek tüm bilgileri girebilirsiniz.
                                </p>
                                <a href="/wishes/new" className="block w-full text-center bg-gray-900 text-white py-4 rounded-xl hover:bg-black transition-all hover:shadow-lg font-bold flex items-center justify-center gap-2 group">
                                    Dilek Ekleme Sayfasına Git
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Main Content / Wishes List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-2xl font-black text-gray-900 ml-2">Dileklerim</h3>

                        {userWishes.length > 0 ? (
                            <div className="grid gap-4">
                                {userWishes.map(wish => (
                                    <div key={wish.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5
                                                ${wish.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    wish.status === 'IN_PROCESS' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                {wish.status === 'PENDING' ? <Clock className="w-3 h-3 animate-spin" /> :
                                                    wish.status === 'IN_PROCESS' ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                                {wish.status === 'PENDING' ? 'Değerlendiriliyor' : wish.status === 'IN_PROCESS' ? 'İşleme Alındı' : 'Gerçekleşti!'}
                                            </span>
                                            <span className="text-xs font-bold text-gray-300">{new Date(wish.createdAt).toLocaleDateString("tr-TR")}</span>
                                        </div>

                                        <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">{wish.title}</h4>
                                        <p className="text-gray-500 text-sm leading-relaxed">{wish.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2rem] border border-dashed border-gray-200 p-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <PlayCircle className="w-8 h-8 text-gray-300" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-800">Henüz hiç dilek tutmadınız.</h4>
                                <p className="text-gray-500 mt-2 text-sm">Hayallerinizi bizimle paylaşmak için yandaki formu kullanın.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
