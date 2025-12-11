import { LayoutDashboard, Users, Calendar, FolderHeart, Settings, Gift, MessageSquare, CheckCircle, Layers, FileText, Shield } from "lucide-react"
import { PERMISSIONS } from "@/lib/permissions"

type AdminSidebarProps = {
    activeTab: string
    setActiveTab: (tab: string) => void
    permissions: string[]
}

export default function AdminSidebar({ activeTab, setActiveTab, permissions }: AdminSidebarProps) {
    const menuItems = [
        { id: "wishes", name: "Dilek Yönetimi", icon: CheckCircle, permission: PERMISSIONS.MANAGE_WISHES },
        { id: "events", name: "Etkinlikler", icon: Calendar, permission: PERMISSIONS.MANAGE_EVENTS },
        { id: "projects", name: "Projeler", icon: Layers, permission: PERMISSIONS.MANAGE_PROJECTS },
        { id: "teams", name: "Takımlar", icon: Users, permission: PERMISSIONS.MANAGE_TEAMS },
        { id: "support", name: "Destek Ol", icon: Gift, permission: PERMISSIONS.MANAGE_SUPPORT },
        { id: "feedbacks", name: "Geri Bildirimler", icon: MessageSquare, permission: PERMISSIONS.MANAGE_FEEDBACK },
        { id: "messages", name: "Mesajlar", icon: MessageSquare, permission: PERMISSIONS.MANAGE_MESSAGES },
        { id: "reports", name: "Raporlar", icon: FileText, permission: PERMISSIONS.MANAGE_REPORTS },
        { id: "users", name: "Kullanıcılar", icon: Users, permission: PERMISSIONS.MANAGE_USERS },
        { id: "roles", name: "Rol ve Yetkiler", icon: Shield, permission: PERMISSIONS.MANAGE_ROLES },
        { id: "settings", name: "Ayarlar", icon: Settings, permission: PERMISSIONS.MANAGE_SETTINGS },
    ]

    // Only show items that user has permission for (or if no permission required, though all ours do)
    const allowedItems = menuItems.filter(item =>
        !item.permission || (permissions && permissions.includes(item.permission))
    )

    return (
        <div className="w-full md:w-64 bg-white rounded-3xl shadow-sm border border-gray-100 flex-shrink-0 md:h-[calc(100vh-8rem)] sticky top-24 p-4 overflow-y-auto">
            <div className="flex items-center px-4 py-3 mb-6 bg-primary/10 rounded-2xl">
                <LayoutDashboard className="w-5 h-5 text-primary mr-3" />
                <span className="font-bold text-primary tracking-wide">Yönetim Paneli</span>
            </div>

            <nav className="space-y-2">
                {allowedItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                                ? "bg-primary text-white shadow-md shadow-green-100 transform translate-x-1"
                                : "text-gray-500 hover:bg-gray-50 hover:text-primary"
                                }`}
                        >
                            <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-gray-400 group-hover:text-primary"}`} />
                            {item.name}
                        </button>
                    )
                })}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-100 px-4">
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-4">Sistem Durumu</div>
                <div className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Sistem Aktif
                </div>
            </div>
        </div>
    )
}
