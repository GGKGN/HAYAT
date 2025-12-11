"use client"

import { useState, useEffect } from "react"
import { Users, Plus, Trash2, Search, Briefcase, UserPlus } from "lucide-react"
import { createTeam, deleteTeam, createTeamRole, deleteTeamRole, assignUserToTeam, removeUserFromTeam } from "@/actions/teams"
import { useRouter } from "next/navigation"

type TeamsTabProps = {
    teams: any[]
    roles: any[]
    members: any[]
    users: any[]
}

export default function TeamsTab({ teams: initialTeams, roles: initialRoles, members: initialMembers, users }: TeamsTabProps) {
    const router = useRouter()
    const [teams, setTeams] = useState(initialTeams)
    const [roles, setRoles] = useState(initialRoles)
    const [members, setMembers] = useState(initialMembers)

    useEffect(() => {
        setTeams(initialTeams)
        setRoles(initialRoles)
        setMembers(initialMembers)
    }, [initialTeams, initialRoles, initialMembers])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    // Forms state
    const [teamName, setTeamName] = useState("")
    const [roleName, setRoleName] = useState("")

    // Assignment state
    const [selectedUser, setSelectedUser] = useState("")
    const [selectedTeam, setSelectedTeam] = useState("")
    const [selectedRole, setSelectedRole] = useState("")

    const filteredMembers = members.filter(m =>
        m.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    async function handleCreateTeam() {
        if (!teamName) return
        setIsLoading(true)
        await createTeam(teamName)
        setTeamName("")
        setIsLoading(false)
    }

    async function handleDeleteTeam(id: string) {


        const previousTeams = [...teams]
        setTeams(teams.filter(t => t.id !== id))

        setIsLoading(true)
        try {
            const result = await deleteTeam(id)
            if (result?.error) {
                setTeams(previousTeams)
                alert(`Hata: ${result.error}`)
            } else {
                router.refresh()
            }
        } catch (e) {
            setTeams(previousTeams)
            alert("Bir hata oluştu")
        }
        setIsLoading(false)
    }

    async function handleCreateRole() {
        if (!roleName) return
        setIsLoading(true)
        await createTeamRole(roleName)
        setRoleName("")
        setIsLoading(false)
    }

    async function handleDeleteRole(id: string) {


        const previousRoles = [...roles]
        setRoles(roles.filter(r => r.id !== id))

        setIsLoading(true)
        try {
            const result = await deleteTeamRole(id)
            if (result?.error) {
                setRoles(previousRoles)
                alert(`Hata: ${result.error}`)
            } else {
                router.refresh()
            }
        } catch (e) {
            setRoles(previousRoles)
            alert("Bir hata oluştu")
        }
        setIsLoading(false)
    }

    async function handleAssign() {
        if (!selectedUser || !selectedTeam || !selectedRole) return
        setIsLoading(true)
        await assignUserToTeam(selectedUser, selectedTeam, selectedRole)
        // Reset selections
        setSelectedUser("")
        setSelectedTeam("")
        setSelectedRole("")
        setIsLoading(false)
    }

    async function handleRemoveMember(id: string) {


        const previousMembers = [...members]
        setMembers(members.filter(m => m.id !== id))

        setIsLoading(true)
        try {
            const result = await removeUserFromTeam(id)
            if (result?.error) {
                setMembers(previousMembers)
                alert(`Hata: ${result.error}`)
            } else {
                router.refresh()
            }
        } catch (e) {
            setMembers(previousMembers)
            alert("Bir hata oluştu")
        }
        setIsLoading(false)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Takım Yönetimi</h2>
                    <p className="text-gray-500 font-medium">Organizasyon şemanızı ve takım rollerini buradan yönetebilirsiniz.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-400 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                    <Users className="w-4 h-4" />
                    <span>{teams.length} Takım</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{roles.length} Rol</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{members.length} Atama</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Teams & Roles (Management) */}
                <div className="lg:col-span-5 space-y-8">

                    {/* Teams Card */}
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                        <div className="relative">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Takımlar</h3>
                            </div>

                            <div className="flex gap-3 mb-6">
                                <input
                                    type="text"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    placeholder="Yeni Takım Adı..."
                                    className="flex-1 bg-gray-50 p-3 rounded-xl border-none focus:ring-2 focus:ring-blue-200 outline-none font-medium placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleCreateTeam}
                                    disabled={isLoading || !teamName}
                                    className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-100"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                {teams.map(team => (
                                    <div key={team.id} className="flex justify-between items-center p-4 bg-gray-50/80 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl transition-all group/item">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                            <span className="font-bold text-gray-700">{team.name}</span>
                                            <span className="px-2 py-0.5 bg-white rounded-lg text-xs font-bold text-blue-600 border border-blue-50 shadow-sm">{team._count.members} Üye</span>
                                        </div>
                                        <button onClick={() => handleDeleteTeam(team.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {teams.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">Henüz takım oluşturulmadı.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Roles Card */}
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                        <div className="relative">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Rol Tanımları</h3>
                            </div>

                            <div className="flex gap-3 mb-6">
                                <input
                                    type="text"
                                    value={roleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                    placeholder="Yeni Rol Adı..."
                                    className="flex-1 bg-gray-50 p-3 rounded-xl border-none focus:ring-2 focus:ring-purple-200 outline-none font-medium placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleCreateRole}
                                    disabled={isLoading || !roleName}
                                    className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-all shadow-md shadow-purple-100"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                {roles.map(role => (
                                    <div key={role.id} className="flex justify-between items-center p-4 bg-gray-50/80 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl transition-all group/item">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                            <span className="font-bold text-gray-700">{role.name}</span>
                                        </div>
                                        <button onClick={() => handleDeleteRole(role.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {roles.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">Henüz rol tanımlanmadı.</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Assignments */}
                <div className="lg:col-span-7">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm h-full flex flex-col relative overflow-hidden">

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
                                    <UserPlus className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Üye Atamaları</h3>
                                    <p className="text-sm text-gray-400">Kullanıcıları takımlara yerleştirin.</p>
                                </div>
                            </div>
                        </div>

                        {/* Assignment Interface */}
                        <div className="bg-gray-50/80 p-6 rounded-[1.5rem] border border-gray-100 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <select
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    className="w-full p-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-green-200 outline-none font-medium text-gray-700"
                                >
                                    <option value="">Kullanıcı Seçin</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={selectedTeam}
                                        onChange={(e) => setSelectedTeam(e.target.value)}
                                        className="w-full p-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-green-200 outline-none font-medium text-gray-700"
                                    >
                                        <option value="">Takım</option>
                                        {teams.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full p-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-green-200 outline-none font-medium text-gray-700"
                                    >
                                        <option value="">Rol</option>
                                        {roles.map(r => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={handleAssign}
                                disabled={isLoading || !selectedUser || !selectedTeam || !selectedRole}
                                className="w-full bg-green-600 text-white py-3.5 rounded-xl hover:bg-green-700 disabled:opacity-50 transition-all font-bold shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                            >
                                <UserPlus className="w-5 h-5" />
                                Atamayı Tamamla
                            </button>
                        </div>

                        {/* List Header & Search */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="İsim, takım veya rol ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-100 outline-none font-medium transition-all"
                                />
                            </div>
                        </div>

                        {/* Members List */}
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 max-h-[500px]">
                            {filteredMembers.map(member => (
                                <div key={member.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 p-1 border border-gray-100">
                                            <img
                                                src={member.user.image || `https://ui-avatars.com/api/?name=${member.user.name}&background=random`}
                                                alt={member.user.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">{member.user.name}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">{member.team.name}</span>
                                                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg">{member.role.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        title="Atamayı Kaldır"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {filteredMembers.length === 0 && (
                                <div className="text-center py-12 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                        <Search className="w-8 h-8" />
                                    </div>
                                    <p className="text-gray-500 font-medium">Eşleşen kayıt bulunamadı.</p>
                                    <p className="text-sm text-gray-400">Yeni bir atama yapmayı deneyin.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
