"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { ChevronLeft, ChevronRight, User, Plus, X, Calendar as CalendarIcon, MapPin, Info } from "lucide-react"
import { createVisit, deleteVisit, getVisits } from "@/actions/visits"
import { redirect } from "next/navigation"

export default function CalendarPage() {
    const { data: session, status } = useSession()

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [visits, setVisits] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)

    // Form State
    const [createLoading, setCreateLoading] = useState(false)
    const [note, setNote] = useState("")
    const [experience, setExperience] = useState("TECRUBELI") // Default

    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/api/auth/signin")
        }
    }, [status])

    const fetchVisits = async () => {
        setLoading(true)
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()

        // Get start and end of month
        const start = new Date(year, month, 1)
        const end = new Date(year, month + 1, 0, 23, 59, 59)

        const data = await getVisits(start, end)
        setVisits(data)
        setLoading(false)
    }

    useEffect(() => {
        if (session) {
            fetchVisits()
        }
    }, [currentDate, session])

    // Calendar Helper Functions
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const days = new Date(year, month + 1, 0).getDate()
        return Array.from({ length: days }, (_, i) => i + 1)
    }

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        // 0 = Sunday, 1 = Monday... but we want Monday start usually? Let's stick to Sunday start (0) for standard layout or adjust.
        // Let's do Monday start (1)
        let day = new Date(year, month, 1).getDay()
        // Convert to Monday=0, Sunday=6
        // JS: Sun=0, Mon=1...Sat=6
        // Target: Mon=0, ... Sun=6
        if (day === 0) day = 7
        return day - 1
    }

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentDate)
        newDate.setMonth(newDate.getMonth() + delta)
        setCurrentDate(newDate)
    }

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        // Check if past date
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Reset time portion

        if (clickedDate < today) {
            // Can view past visits but maybe not join?
            // Let's allow viewing
        }

        setSelectedDate(clickedDate)
        setModalOpen(true)
    }

    const handleJoin = async () => {
        if (!selectedDate) return
        setCreateLoading(true)
        const res = await createVisit(selectedDate, experience, note)
        if (res.error) {
            alert(res.error)
        } else {
            await fetchVisits()
            setModalOpen(false) // Close or stay?
            setNote("") // Reset form
        }
        setCreateLoading(false)
    }

    const handleDelete = async (id: string) => {

        setCreateLoading(true)
        const res = await deleteVisit(id)
        if (res.error) {
            alert(res.error)
        } else {
            await fetchVisits()
        }
        setCreateLoading(false)
    }

    // Render Helpers
    const getVisitsForDay = (day: number) => {
        return visits.filter(v => {
            const d = new Date(v.date)
            return d.getDate() === day
        })
    }

    const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
    const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]

    if (status === "loading") return <div className="min-h-screen pt-32 text-center">Yükleniyor...</div>

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">

                    {/* Header */}
                    <div className="bg-primary p-6 md:p-10 flex items-center justify-between text-white">
                        <div>
                            <h1 className="text-3xl font-black mb-1">Ziyaret Takvimi</h1>
                            <p className="text-primary-100 font-medium">Hastane ve okul ziyaretlerimizi buradan planlıyoruz.</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 p-2 rounded-2xl backdrop-blur-sm">
                            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <div className="text-xl font-bold min-w-[140px] text-center">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </div>
                            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="p-6 md:p-8">
                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 mb-4">
                            {dayNames.map(day => (
                                <div key={day} className="text-center font-bold text-gray-400 text-sm uppercase tracking-wider py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days */}
                        <div className="grid grid-cols-7 gap-2 ash">
                            {/* Empty cells for offset */}
                            {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square bg-transparent" />
                            ))}

                            {getDaysInMonth(currentDate).map(day => {
                                const dayVisits = getVisitsForDay(day)
                                const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

                                return (
                                    <div
                                        key={day}
                                        onClick={() => handleDateClick(day)}
                                        className={`aspect-square rounded-2xl border p-2 relative cursor-pointer group transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${isToday
                                            ? "bg-green-50 border-primary shadow-sm"
                                            : "bg-white border-gray-100 hover:border-green-200"
                                            }`}
                                    >
                                        <span className={`text-sm font-bold ${isToday ? "text-primary" : "text-gray-700"} block mb-1`}>
                                            {day}
                                        </span>

                                        {/* Avatars & Names */}
                                        <div className="flex flex-col gap-1 mt-2 overflow-hidden">
                                            {dayVisits.slice(0, 3).map((v) => (
                                                <div key={v.id} className="flex items-center gap-1.5 bg-gray-50/80 px-1.5 py-1 rounded-lg border border-gray-100/50">
                                                    <div className="w-4 h-4 rounded-full overflow-hidden border border-white shadow-sm flex-shrink-0">
                                                        {v.user.image ? (
                                                            <img src={v.user.image} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[6px] font-bold">
                                                                {v.user.name?.[0]}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-700 truncate max-w-[80px]">
                                                        {v.user.name?.split(' ')[0]}
                                                    </span>
                                                </div>
                                            ))}
                                            {dayVisits.length > 3 && (
                                                <div className="bg-gray-50 text-[10px] font-bold text-gray-400 text-center py-0.5 rounded-lg">
                                                    +{dayVisits.length - 3} kişi daha
                                                </div>
                                            )}
                                        </div>

                                        {dayVisits.length === 0 && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Plus className="w-6 h-6 text-green-200" />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && selectedDate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-primary p-6 text-white flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-black">{selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h3>
                                <p className="text-primary-100 font-medium">Ziyaretçi Listesi</p>
                            </div>
                            <button onClick={() => setModalOpen(false)} className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {/* List */}
                            <div className="space-y-4 mb-8">
                                {getVisitsForDay(selectedDate.getDate()).length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <User className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p>Henüz kimse kayıt olmamış.</p>
                                    </div>
                                ) : (
                                    getVisitsForDay(selectedDate.getDate()).map(v => (
                                        <div key={v.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                                    {v.user.image ? (
                                                        <img src={v.user.image} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                                            {v.user.name?.[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{v.user.name}</p>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${v.experience === 'TECRUBELI' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {v.experience === 'TECRUBELI' ? 'Tecrübeli' : 'Gözlemci'}
                                                    </span>
                                                    {v.note && <p className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">{v.note}</p>}
                                                </div>
                                            </div>

                                            {/* Delete Button (Own or Admin) */}
                                            {(session?.user.id === v.user.id || session?.user.role === 'ADMIN') && (
                                                <button
                                                    onClick={() => handleDelete(v.id)}
                                                    disabled={createLoading}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Join Form */}
                            {selectedDate >= new Date(new Date().setHours(0, 0, 0, 0)) && (
                                <div className="border-t border-gray-100 pt-6">
                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-primary" />
                                        Ben de Geleceğim
                                    </h4>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <label className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all ${experience === 'TECRUBELI' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-100 hover:border-gray-200'}`}>
                                                <input type="radio" name="exp" value="TECRUBELI" className="hidden" checked={experience === 'TECRUBELI'} onChange={() => setExperience('TECRUBELI')} />
                                                <span className="font-bold text-sm block">Tecrübeli</span>
                                                <span className="text-[10px] text-gray-400">Daha önce katıldım</span>
                                            </label>
                                            <label className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all ${experience === 'GOZLEMCI' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-gray-200'}`}>
                                                <input type="radio" name="exp" value="GOZLEMCI" className="hidden" checked={experience === 'GOZLEMCI'} onChange={() => setExperience('GOZLEMCI')} />
                                                <span className="font-bold text-sm block">Gözlemci</span>
                                                <span className="text-[10px] text-gray-400">İlk kez geleceğim</span>
                                            </label>
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Notunuz (Opsiyonel)"
                                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20"
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                        />

                                        <button
                                            onClick={handleJoin}
                                            disabled={createLoading}
                                            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {createLoading ? 'Kaydediliyor...' : 'Listeye Ekle'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
