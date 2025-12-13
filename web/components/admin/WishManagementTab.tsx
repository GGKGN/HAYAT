"use client"

import React, { useState } from "react"
import { Wish, User } from "@prisma/client"
import { Search, Filter, MoreHorizontal, User as UserIcon, Calendar, Flag, CheckCircle2, Clock, Sparkles, ChevronDown, ArrowRight, XCircle, Edit2 } from "lucide-react"
import { updateWishDetails } from "@/actions/wishes"

type WishWithRelations = Wish & {
    user?: { name: string | null, image: string | null },
    volunteer?: { name: string | null, image: string | null }
    childName?: string | null
    childAge?: number | null
    estimatedDate?: Date | null
    priority?: string // Using string instead of enum import to simplify
    url?: string | null
    volunteerId?: string | null
}

interface WishManagementTabProps {
    wishes: WishWithRelations[]
    users: any[]
}

const FilterDropdown = ({
    label,
    value,
    options,
    onChange
}: {
    label: string,
    value: string,
    options: { value: string, label: string }[],
    onChange: (val: string) => void
}) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="relative group">
            <button
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className={`flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 rounded-xl font-bold text-sm text-gray-600 hover:border-blue-200 hover:shadow-sm transition-all ${isOpen ? 'ring-2 ring-blue-100 border-blue-200' : ''}`}
            >
                {label}: <span className="text-gray-900">{options.find(o => o.value === value)?.label || "Tümü"}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setIsOpen(false) }}
                            className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-gray-50 flex items-center justify-between ${value === opt.value ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                        >
                            {opt.label}
                            {value === opt.value && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

const AnimatedCounter = ({ value, duration = 1500 }: { value: number, duration?: number }) => {
    const [count, setCount] = useState(0)

    React.useEffect(() => {
        let startTime: number | null = null
        let animationFrameId: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = timestamp - startTime
            const percentage = Math.min(progress / duration, 1)

            // Ease out quart function
            const easeOutQuart = 1 - Math.pow(1 - percentage, 4)

            setCount(Math.floor(easeOutQuart * value))

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate)
            } else {
                setCount(value)
            }
        }

        animationFrameId = requestAnimationFrame(animate)

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId)
        }
    }, [value, duration])

    return <>{count}</>
}

export default function WishManagementTab({ wishes, users }: WishManagementTabProps) {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [volunteerFilter, setVolunteerFilter] = useState("ALL")
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [editingWish, setEditingWish] = useState<WishWithRelations | null>(null)

    // Filter Logic
    const filteredWishes = wishes.filter(wish => {
        const matchesSearch =
            wish.title.toLowerCase().includes(search.toLowerCase()) ||
            (wish.childName && wish.childName.toLowerCase().includes(search.toLowerCase())) ||
            (wish.user?.name && wish.user.name.toLowerCase().includes(search.toLowerCase())) ||
            (wish.volunteer?.name && wish.volunteer.name.toLowerCase().includes(search.toLowerCase()))

        const matchesStatus = statusFilter === "ALL" || wish.status === statusFilter
        const matchesVolunteer = volunteerFilter === "ALL" || (volunteerFilter === "ASSIGNED" ? !!wish.volunteerId : !wish.volunteerId)

        return matchesSearch && matchesStatus && matchesVolunteer
    })

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8
    const totalPages = Math.ceil(filteredWishes.length / itemsPerPage)
    const paginatedWishes = filteredWishes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    // Stats & Trends Logic
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const isSameMonth = (date: Date, month: number, year: number) => {
        const d = new Date(date)
        return d.getMonth() === month && d.getFullYear() === year
    }

    const calculateStats = (wishList: WishWithRelations[]) => {
        const current = {
            total: 0,
            pending: 0,
            inProcess: 0,
            completed: 0
        }
        const previous = { ...current }

        wishList.forEach(w => {
            const date = new Date(w.createdAt)
            if (isSameMonth(date, currentMonth, currentYear)) {
                current.total++
                if (w.status === "PENDING") current.pending++
                if (w.status === "IN_PROCESS") current.inProcess++
                if (w.status === "COMPLETED") current.completed++
            } else if (isSameMonth(date, lastMonth, lastMonthYear)) {
                previous.total++
                if (w.status === "PENDING") previous.pending++
                if (w.status === "IN_PROCESS") previous.inProcess++
                if (w.status === "COMPLETED") previous.completed++
            }
        })

        const getTrend = (curr: number, prev: number) => {
            if (prev === 0) return { percent: curr > 0 ? 100 : 0, direction: 'up' }
            const diff = ((curr - prev) / prev) * 100
            return { percent: Math.abs(Math.round(diff)), direction: diff >= 0 ? 'up' : 'down' }
        }

        return {
            total: { value: wishes.length, ...getTrend(current.total, previous.total) }, // Keeping total overall count, but trend is monthly
            pending: { value: wishes.filter(w => w.status === "PENDING").length, ...getTrend(current.pending, previous.pending) },
            inProcess: { value: wishes.filter(w => w.status === "IN_PROCESS").length, ...getTrend(current.inProcess, previous.inProcess) },
            completed: { value: wishes.filter(w => w.status === "COMPLETED").length, ...getTrend(current.completed, previous.completed) },
        }
    }

    const statsData = calculateStats(wishes)

    const handleUpdate = async (id: string, data: any) => {
        setLoadingId(id)
        try {
            await updateWishDetails(id, data)
        } catch (error) {
            console.error(error)
            alert("Güncelleme başarısız")
        } finally {
            setLoadingId(null)
            setEditingWish(null)
        }
    }

    const handleEditSubmit = async (formData: FormData) => {
        if (!editingWish) return
        const data = {
            title: formData.get("title"),
            description: formData.get("description"),
            childName: formData.get("childName"),
            childAge: parseInt(formData.get("childAge") as string) || null,
            estimatedDate: formData.get("estimatedDate") ? new Date(formData.get("estimatedDate") as string) : null,
            url: formData.get("url"),
        }
        await handleUpdate(editingWish.id, data)
    }

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case "HIGH": return "bg-rose-50 text-rose-600 ring-1 ring-rose-200";
            case "MEDIUM": return "bg-blue-50 text-blue-600 ring-1 ring-blue-200";
            case "LOW": return "bg-slate-50 text-slate-600 ring-1 ring-slate-200";
            default: return "bg-slate-50 text-slate-600 ring-1 ring-slate-200";
        }
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "COMPLETED": return "bg-emerald-50 text-emerald-600 border border-emerald-100";
            case "IN_PROCESS": return "bg-blue-50 text-blue-600 border border-blue-100";
            case "PENDING": return "bg-amber-50 text-amber-600 border border-amber-100";
            default: return "bg-slate-50 text-slate-600";
        }
    }

    return (
        <div className="space-y-8 font-sans">
            {/* Top Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Toplam Dilek", item: statsData.total, icon: Sparkles, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Bekleyen", item: statsData.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Süreçte", item: statsData.inProcess, icon: UserIcon, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Tamamlanan", item: statsData.completed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${stat.item.direction === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.item.direction === 'up' ? '↑' : '↓'} %{stat.item.percent}
                                <span className="text-gray-300 font-medium hidden xl:inline">bu ay</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
                                <AnimatedCounter value={stat.item.value} />
                            </h3>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Dilek, çocuk veya gönüllü ara..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary/20 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400 h-[50px]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 flex-wrap">
                    <FilterDropdown
                        label="Durum"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            { value: "ALL", label: "Tümü" },
                            { value: "PENDING", label: "Bekleyen" },
                            { value: "IN_PROCESS", label: "Süreçte" },
                            { value: "COMPLETED", label: "Tamamlanan" }
                        ]}
                    />
                    <FilterDropdown
                        label="Sorumlu"
                        value={volunteerFilter}
                        onChange={setVolunteerFilter}
                        options={[
                            { value: "ALL", label: "Tümü" },
                            { value: "ASSIGNED", label: "Atanmış" },
                            { value: "UNASSIGNED", label: "Atanmamış" },
                        ]}
                    />
                </div>
            </div>

            {/* Edit Modal */}
            {editingWish && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl relative">
                        <button onClick={() => setEditingWish(null)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                            <XCircle className="w-5 h-5 text-gray-500" />
                        </button>
                        <h3 className="text-xl font-bold mb-6">Dilek Düzenle</h3>
                        <form action={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1">Dilek Başlığı</label>
                                <input name="title" defaultValue={editingWish.title} className="w-full p-3 bg-gray-50 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1">Açıklama</label>
                                <textarea name="description" defaultValue={editingWish.description} rows={3} className="w-full p-3 bg-gray-50 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1">Dilek Bağlantısı (URL)</label>
                                <input name="url" defaultValue={editingWish.url || ""} placeholder="https://..." className="w-full p-3 bg-gray-50 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1">Çocuk Adı</label>
                                    <input name="childName" defaultValue={editingWish.childName || ""} className="w-full p-3 bg-gray-50 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1">Yaş</label>
                                    <input name="childAge" type="number" defaultValue={editingWish.childAge || ""} className="w-full p-3 bg-gray-50 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1">Tahmini Tarih</label>
                                <input name="estimatedDate" type="date" defaultValue={editingWish.estimatedDate ? new Date(editingWish.estimatedDate).toISOString().split('T')[0] : ""} className="w-full p-3 bg-gray-50 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <button type="submit" disabled={loadingId === editingWish.id} className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all mt-4">
                                {loadingId === editingWish.id ? "Güncelleniyor..." : "Kaydet"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* List View */}
            <div className="space-y-4">
                {paginatedWishes.length > 0 ? (
                    paginatedWishes.map((wish) => (
                        <div key={wish.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:border-gray-200 transition-all duration-300 group relative overflow-visible">
                            {/* Loading Overlay */}
                            {loadingId === wish.id && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-3xl">
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}

                            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                {/* Child & Wish Info */}
                                <div className="flex items-center gap-5 flex-1 min-w-0">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform">
                                        {wish.childName ? (
                                            <span className="text-xl font-black text-gray-400">{wish.childName.charAt(0)}</span>
                                        ) : (
                                            <Sparkles className="w-6 h-6 text-gray-300" />
                                        )}
                                        {/* Status Indicator Bar */}
                                        <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${wish.status === 'COMPLETED' ? 'bg-emerald-500' : wish.status === 'IN_PROCESS' ? 'bg-blue-500' : 'bg-amber-400'}`}></div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <h4 className="text-lg font-bold text-gray-900 truncate">{wish.title}</h4>
                                                {wish.childName && (
                                                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wide shrink-0">
                                                        {wish.childName}, {wish.childAge}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-1 group-hover:text-gray-700 transition-colors">{wish.description}</p>
                                    </div>
                                    <button
                                        onClick={() => setEditingWish(wish)}
                                        className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        title="Dileği Düzenle"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Controls Grid */}
                                <div className="flex flex-wrap lg:grid lg:grid-cols-4 gap-4 items-center mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50">

                                    {/* Priority */}
                                    <div className="relative group/priority w-full sm:w-auto">
                                        <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Öncelik</label>
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer hover:shadow-sm ${getPriorityStyle(wish.priority || "MEDIUM")}`}>
                                            <Flag className="w-3.5 h-3.5" />
                                            <span className="text-xs font-bold">{wish.priority === "HIGH" ? "Yüksek" : wish.priority === "LOW" ? "Düşük" : "Normal"}</span>
                                        </div>
                                        <select
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            value={wish.priority || "MEDIUM"}
                                            onChange={(e) => handleUpdate(wish.id, { priority: e.target.value })}
                                            disabled={loadingId === wish.id}
                                        >
                                            <option value="LOW">Düşük</option>
                                            <option value="MEDIUM">Normal</option>
                                            <option value="HIGH">Yüksek</option>
                                        </select>
                                    </div>

                                    {/* Status */}
                                    <div className="relative group/status w-full sm:w-auto">
                                        <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Durum</label>
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer hover:shadow-sm ${getStatusStyle(wish.status)}`}>
                                            <div className={`w-2 h-2 rounded-full ${wish.status === 'COMPLETED' ? 'bg-emerald-500' : wish.status === 'IN_PROCESS' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                                            <span className="text-xs font-bold">
                                                {wish.status === "COMPLETED" ? "Tamamlandı" : wish.status === "IN_PROCESS" ? "Süreçte" : "Bekliyor"}
                                            </span>
                                        </div>
                                        <select
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            value={wish.status}
                                            onChange={(e) => handleUpdate(wish.id, { status: e.target.value })}
                                            disabled={loadingId === wish.id}
                                        >
                                            <option value="PENDING">Bekliyor</option>
                                            <option value="IN_PROCESS">Süreçte</option>
                                            <option value="COMPLETED">Tamamlandı</option>
                                        </select>
                                    </div>

                                    {/* Volunteer */}
                                    <div className="relative group/volunteer w-full sm:col-span-2">
                                        <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Sorumlu Gönüllü</label>
                                        <div className={`flex items-center gap-3 p-1.5 pr-4 rounded-xl border transition-all cursor-pointer ${wish.volunteer ? 'bg-white border-gray-100 hover:border-blue-200 shadow-sm' : 'bg-gray-50 border-dashed border-gray-200 hover:bg-white hover:border-blue-300'}`}>
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                {wish.volunteer?.image ? (
                                                    <img src={wish.volunteer.image} className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserIcon className="w-4 h-4 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className={`block text-xs font-bold truncate ${wish.volunteer ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {wish.volunteer?.name || "Gönüllü Ata"}
                                                </span>
                                            </div>
                                            <ChevronDown className="w-3 h-3 text-gray-400 group-hover/volunteer:text-blue-500 transition-colors" />
                                        </div>

                                        <select
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            value={wish.volunteerId || ""}
                                            onChange={(e) => handleUpdate(wish.id, { volunteerId: e.target.value === "" ? null : e.target.value })}
                                        >
                                            <option value="">İptal / Atanmadı</option>
                                            {users.filter(u => u.role === "MEMBER" || u.role === "ADMIN").map(u => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl border border-gray-100">
                            🔍
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Sonuç Bulunamadı</h3>
                        <p className="text-gray-500">Arama kriterlerinize uygun dilek yok.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center pt-8">
                        <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === i + 1 ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
