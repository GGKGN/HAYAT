import { prisma } from "@/lib/prisma"
import TeamsView from "@/components/TeamsView"
import { Users, Sparkles } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function TeamsPage() {
    const teams = await prisma.team.findMany({
        include: {
            members: {
                include: {
                    user: true,
                    role: true,
                    team: true
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
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
                        <Users className="w-5 h-5 mr-2 text-indigo-500 fill-indigo-500" />
                        <span className="font-bold tracking-wide text-sm uppercase">Ekiplerimiz</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-gray-800 mb-6 tracking-tight leading-tight">
                        Takımlarımız<span className="text-primary">.</span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-xl leading-relaxed font-medium">
                        Hayata dokunan projelerimizin arkasındaki kahramanlar. Birlikte daha güçlüyüz.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <TeamsView teams={teams} />
            </div>
        </div>
    )
}
