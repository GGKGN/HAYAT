"use client"

import { useState } from "react"
import Modal from "./Modal"
import { Calendar, MapPin, ArrowRight, ChevronLeft, ChevronRight, Clock } from "lucide-react"

type Event = {
    id: string
    title: string
    date: Date
    location: string
    coverImage: string | null
    description?: string | null
    isPast: boolean
}

function EventCard({ event, onClick }: { event: Event; onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-green-100 transition-all duration-300 flex flex-col h-full border border-gray-100 transform hover:-translate-y-2 cursor-pointer"
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={event.coverImage || "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80"}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl text-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{new Date(event.date).toLocaleString('tr-TR', { month: 'short' })}</span>
                    <span className="block text-xl font-black text-primary leading-none">{new Date(event.date).getDate()}</span>
                </div>

                <div className="absolute bottom-4 left-4 z-10">
                    <div className="inline-flex items-center bg-primary/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-2 shadow-sm">
                        <Clock className="w-3 h-3 mr-1.5" />
                        {new Date(event.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="flex-1">
                    <h3 className="text-xl font-black text-gray-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                        {event.title}
                    </h3>

                    <div className="flex items-start text-gray-500 font-medium text-sm mb-4">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-secondary shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                    </div>

                    {event.description && (
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                            {event.description}
                        </p>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <button className="text-sm font-bold text-gray-900 group-hover:text-primary flex items-center transition-colors">
                        İncele
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary -rotate-45 group-hover:rotate-0 transition-all duration-300" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function EventsSection({ events, className }: { events: any[], className?: string }) {
    const [tab, setTab] = useState<"UPCOMING" | "PAST">("UPCOMING")
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 6
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

    // Cast dates properly if serialized
    const typedEvents = events.map(e => ({ ...e, date: new Date(e.date) })) as Event[]

    const now = new Date()
    const upcomingEvents = typedEvents.filter(e => e.date >= now).sort((a, b) => a.date.getTime() - b.date.getTime())
    const pastEvents = typedEvents.filter(e => e.date < now).sort((a, b) => b.date.getTime() - a.date.getTime())

    const activeList = tab === "UPCOMING" ? upcomingEvents : pastEvents

    // Calculate pagination
    const totalPages = Math.ceil(activeList.length / ITEMS_PER_PAGE)
    const paginatedEvents = activeList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const handleTabChange = (newTab: "UPCOMING" | "PAST") => {
        setTab(newTab)
        setCurrentPage(1)
    }

    return (
        <div className={`flex-1 bg-transparent relative z-10 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Filters - Centered */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-1.5 rounded-full border border-gray-100 shadow-sm inline-flex">
                        <button
                            onClick={() => handleTabChange("UPCOMING")}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${tab === "UPCOMING"
                                ? "bg-gray-900 text-white shadow-md"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                        >
                            Yaklaşan
                        </button>
                        <button
                            onClick={() => handleTabChange("PAST")}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${tab === "PAST"
                                ? "bg-gray-900 text-white shadow-md"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                        >
                            Geçmiş
                        </button>
                    </div>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${paginatedEvents.length === 0 ? 'min-h-[400px]' : ''}`}>
                    {paginatedEvents.length > 0 ? (
                        paginatedEvents.map(event => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onClick={() => setSelectedEvent(event)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center text-center p-12 border border-gray-200 rounded-3xl bg-white/40 backdrop-blur-sm">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-3xl border border-gray-100 shadow-sm">
                                📅
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Etkinlik Bulunamadı</h3>
                            <p className="text-gray-500 max-w-md">Bu kategoride henüz bir etkinlik planlanmamış. Takipte kal!</p>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 space-x-4">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex space-x-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-full font-bold transition-all ${currentPage === page
                                        ? "bg-primary text-white shadow-lg scale-110"
                                        : "text-gray-500 hover:bg-gray-100"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                )}
            </div>

            {/* Event Detail Modal */}
            <Modal
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                title={selectedEvent?.title}
            >
                {selectedEvent && (
                    <div className="space-y-6">
                        {/* Event Cover Image */}
                        <div className="rounded-2xl overflow-hidden shadow-lg h-60 w-full relative">
                            <img
                                src={selectedEvent.coverImage || "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80"}
                                alt={selectedEvent.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <span className="inline-flex items-center bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold shadow-sm">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {new Date(selectedEvent.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-100">
                            <div className="flex items-center text-gray-700 mb-2 sm:mb-0">
                                <Calendar className="w-5 h-5 mr-3 text-primary" />
                                <span className="font-bold text-lg">{new Date(selectedEvent.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                                <MapPin className="w-5 h-5 mr-2 text-secondary" />
                                <span className="font-medium">{selectedEvent.location}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose prose-lg prose-stone max-w-none">
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {selectedEvent.description || "Bu etkinlik için detaylı açıklama bulunmamaktadır."}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
