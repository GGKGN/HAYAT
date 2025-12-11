"use client"

import { useState } from "react"
import { Calendar, User, Clock, CheckCircle2, PlayCircle, ArrowRight } from "lucide-react"

type Project = {
    id: string
    title: string
    description: string
    status: string | null
    image: string | null
    createdAt: Date
    updatedAt: Date
}

function ProjectCard({ project }: { project: Project }) {
    const statusConfig = {
        ONGOING: { label: "Devam Ediyor", bg: "bg-green-100", text: "text-green-700", icon: PlayCircle },
        COMPLETED: { label: "Tamamlandı", bg: "bg-blue-100", text: "text-blue-700", icon: CheckCircle2 },
        PLANNED: { label: "Planlanıyor", bg: "bg-orange-100", text: "text-orange-700", icon: Clock },
    }

    const config = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.ONGOING
    const StatusIcon = config.icon

    return (
        <div className="group bg-white rounded-[2.5rem] overflow-hidden shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col border border-gray-100 transform hover:-translate-y-2">
            {/* Image Section */}
            <div className="h-72 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/0 transition-colors z-10 duration-500"></div>
                <img
                    src={project.image || "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?w=800&q=80"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ease-out"
                />

                {/* Status Badge */}
                <div className="absolute top-6 right-6 z-20">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md bg-white/95 text-gray-900 border border-white/50`}>
                        <span className={`w-2 h-2 rounded-full ${project.status === 'COMPLETED' ? 'bg-blue-500' : project.status === 'PLANNED' ? 'bg-orange-500' : 'bg-green-500'} animate-pulse`}></span>
                        {config.label}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col flex-1 relative">
                {/* Decorative Line */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

                <div className="mb-6">
                    <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight">
                        {project.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed line-clamp-3 text-base font-medium">
                        {project.description}
                    </p>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400">
                                <User className="w-3 h-3" />
                            </div>
                        ))}
                    </div>

                    <button className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                        Detaylar <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function ProjectsSection({ projects }: { projects: any[] }) {
    // Cast dates
    const typedProjects = projects.map(p => ({ ...p, createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt) })) as Project[]

    return (
        <div id="projects" className="flex-1 bg-white relative z-10 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in slide-in-from-bottom-8 fade-in duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 row-gap-12">
                    {typedProjects.length > 0 ? (
                        typedProjects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-[3rem] border border-gray-100">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Clock className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Henüz Proje Yok</h3>
                            <p className="text-gray-500 mt-2">Şu anda gösterilecek aktif bir proje bulunmuyor.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
