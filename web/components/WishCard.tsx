import { Wish as PrismaWish } from "@prisma/client"
import { Calendar, User, Clock, CheckCircle2, Sparkles, Link2, Heart } from "lucide-react"

type Wish = PrismaWish & {
    user: {
        name: string | null
        image: string | null
    } | null
    volunteer?: {
        name: string | null
        image: string | null
    } | null
    url: string | null
    childName?: string | null
    childAge?: number | null
    estimatedDate?: Date | null
    imageUrl?: string | null
}

export type { Wish }

export default function WishCard({ wish, onClick }: { wish: Wish; onClick?: () => void }) {

    // Status helpers
    const getStatusInfo = () => {
        switch (wish.status) {
            case 'COMPLETED': return { label: 'Gerçekleşti', color: 'bg-green-500', icon: CheckCircle2, animation: 'animate-bounce' };
            case 'IN_PROCESS': return { label: 'Hazırlanıyor', color: 'bg-blue-500', icon: Clock, animation: 'animate-[spin_3s_linear_infinite]' };
            default: return { label: 'Bekliyor', color: 'bg-yellow-500', icon: Sparkles, animation: 'animate-pulse' };
        }
    }

    const status = getStatusInfo()
    const StatusIcon = status.icon

    return (
        <div
            onClick={onClick}
            className={`group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 transform hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''}`}
        >
            {/* Image Area */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
                {wish.imageUrl ? (
                    <img
                        src={wish.imageUrl}
                        alt={wish.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${wish.status === 'COMPLETED' ? 'from-green-400 to-green-600' : wish.status === 'IN_PROCESS' ? 'from-blue-400 to-blue-600' : 'from-yellow-300 to-yellow-500'} p-6 flex items-center justify-center`}>
                        <StatusIcon className="w-16 h-16 text-white/50" />
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 right-4 animate-in fade-in slide-in-from-top-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md shadow-sm border border-white/20 ${status.color}`}>
                        <StatusIcon className={`w-3 h-3 ${status.animation}`} />
                        {status.label}
                    </div>
                </div>

                {/* Volunteer Badge (if assigned) */}
                {wish.volunteer && (
                    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm p-1.5 pr-3 rounded-full shadow-sm border border-white/20">
                        <div className="w-6 h-6 rounded-full bg-gray-100 relative overflow-hidden">
                            {wish.volunteer.image ? (
                                <img src={wish.volunteer.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-3 h-3 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 leading-none">Gönüllü</span>
                            <span className="text-xs font-bold text-gray-800 leading-none">{wish.volunteer.name?.split(' ')[0]}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-1">
                {/* Child Info */}
                {(wish.childName || wish.childAge) && (
                    <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-400">
                        <User className="w-4 h-4" />
                        <span>{wish.childName || "İsimsiz"}</span>
                        {wish.childAge && <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-600 font-extrabold">{wish.childAge} Yaş</span>}
                    </div>
                )}

                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                    {wish.title}
                </h3>

                {wish.description && (
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
                        {wish.description}
                    </p>
                )}

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
                    {/* User who added the wish */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            {wish.user?.image ? ( // Keeping user image for now as child might not have one, or use generic
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 w-full h-full flex items-center justify-center text-white text-[10px] font-bold">
                                    {wish.childName ? wish.childName.charAt(0) : <User className="w-3 h-3" />}
                                </div>
                            ) : (
                                <User className="w-3 h-3 text-gray-400" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="truncate max-w-[100px] leading-none">{wish.childName || wish.user?.name || "Anonim"}</span>
                            {wish.childName && <span className="text-[9px] text-gray-300 font-normal leading-none mt-0.5">Dilek Sahibi</span>}
                        </div>
                    </div>

                    {/* Estimated Date or Created At */}
                    <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1.5" />
                        <span suppressHydrationWarning>
                            {wish.estimatedDate
                                ? new Date(wish.estimatedDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
                                : new Date(wish.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric', year: 'numeric' })
                            }
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
