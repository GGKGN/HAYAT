"use client"

import { useEffect, useState } from "react"
import { getCompletedWishesCount } from "@/actions/wishes"
import { getEventsCount } from "@/actions/events"
import { Sparkles, Heart, Smile } from "lucide-react"

export default function WishCounter() {
    const [count, setCount] = useState(0)
    const [eventsCount, setEventsCount] = useState(0)

    useEffect(() => {
        getCompletedWishesCount().then(val => setCount(val))
        getEventsCount().then(val => setEventsCount(val))
    }, [])

    // Mock stats for demo purposes based on real count
    const smilesCount = count * 12 + 45

    return (
        <div className="relative z-20 -mt-12 mb-12 px-4 pointer-events-none">
            <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] border border-white/50 flex flex-col md:flex-row justify-around items-center gap-8 md:gap-4 animate-in slide-in-from-bottom-6 duration-700 delay-300 pointer-events-auto">
                <div className="flex items-center gap-4 text-center md:text-left transition-transform hover:scale-105 duration-300 group cursor-default">
                    <div className="bg-gradient-to-br from-green-300 to-green-500 p-4 rounded-2xl text-white shadow-lg shadow-green-200 group-hover:rotate-6 transition-transform">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-4xl font-black text-gray-800 tabular-nums">{count}</div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Dilek Gerçekleşti</div>
                    </div>
                </div>

                <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

                <div className="flex items-center gap-4 text-center md:text-left transition-transform hover:scale-105 duration-300 group cursor-default">
                    <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-4 rounded-2xl text-white shadow-lg shadow-yellow-200 group-hover:rotate-6 transition-transform">
                        <Smile className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-4xl font-black text-gray-800 tabular-nums">{smilesCount}</div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Gülümseme</div>
                    </div>
                </div>

                <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

                <div className="flex items-center gap-4 text-center md:text-left transition-transform hover:scale-105 duration-300 group cursor-default">
                    <div className="bg-gradient-to-br from-red-300 to-red-500 p-4 rounded-2xl text-white shadow-lg shadow-red-200 group-hover:rotate-6 transition-transform">
                        <Heart className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-4xl font-black text-gray-800 tabular-nums">{eventsCount}</div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Etkinlik</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
