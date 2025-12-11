"use client"

import { Users, Briefcase, X, User } from "lucide-react"
import { useState } from "react"
import Modal from "@/components/Modal"

export default function TeamsView({ teams }: { teams: any[] }) {
    const [selectedMember, setSelectedMember] = useState<any>(null)

    return (
        <div className="space-y-12">
            {teams.map((team) => (
                <div key={team.id} className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-blue-50/50 shadow-xl shadow-blue-50/20">
                    <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-6">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl transform rotate-3">
                            <Users className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-800 tracking-tight">{team.name}</h2>
                        <span className="ml-auto px-4 py-2 bg-gray-50 text-gray-400 rounded-full text-sm font-bold">
                            {team.members.length} Üye
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {team.members.map((member: any) => (
                            <button
                                key={member.id}
                                onClick={() => setSelectedMember(member)}
                                className="group relative bg-gray-50 hover:bg-white rounded-3xl p-6 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-gray-100 text-left w-full"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full p-1 border-2 border-white shadow-md bg-white mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <img
                                            src={member.user.image || `https://ui-avatars.com/api/?name=${member.user.name}&background=random`}
                                            alt={member.user.name || "Üye"}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>

                                    <h3 className="font-bold text-lg text-gray-900 mb-1">{member.user.name}</h3>

                                    {member.user.title && (
                                        <span className="text-xs font-bold text-primary mb-2 block">{member.user.title}</span>
                                    )}

                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-100 shadow-sm mt-auto">
                                        <Briefcase className="w-3 h-3 text-blue-500" />
                                        <span className="text-xs font-bold text-gray-500">{member.role.name}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                        {team.members.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3 opacity-50" />
                                <p className="text-gray-400 font-medium">Bu takımda henüz üye yok.</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {teams.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Henüz takım oluşturulmadı.</h3>
                </div>
            )}

            {/* Member Details Modal */}
            <Modal isOpen={!!selectedMember} onClose={() => setSelectedMember(null)} title="Üye Detayı">
                {selectedMember && (
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-32 h-32 rounded-full p-1.5 border-4 border-gray-50 shadow-xl bg-white mb-6">
                            <img
                                src={selectedMember.user.image || `https://ui-avatars.com/api/?name=${selectedMember.user.name}&background=random`}
                                alt={selectedMember.user.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 mb-1">{selectedMember.user.name}</h2>
                        <div className="flex items-center gap-2 mb-6">
                            {selectedMember.user.title && (
                                <span className="text-primary font-bold bg-primary/5 px-3 py-1 rounded-full text-sm">
                                    {selectedMember.user.title}
                                </span>
                            )}
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 font-medium">{selectedMember.team.name} / {selectedMember.role.name}</span>
                        </div>

                        {selectedMember.user.bio ? (
                            <div className="bg-gray-50 rounded-2xl p-6 text-gray-600 leading-relaxed text-sm w-full text-left">
                                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Hakkında
                                </h4>
                                {selectedMember.user.bio}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">Henüz bir özgeçmiş eklenmemiş.</p>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    )
}
