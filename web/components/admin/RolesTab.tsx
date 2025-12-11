"use client"

import { useState, useEffect } from "react"
import { Shield, Save, CheckCircle2, RotateCw, AlertTriangle } from "lucide-react"
import { getRolePermissions, updateRolePermissions } from "@/actions/permissions"
import { PERMISSIONS, PERMISSION_LABELS, Permission } from "@/lib/permissions"
import { Role } from "@prisma/client"

export default function RolesTab() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [permissions, setPermissions] = useState<Record<Role, string[]>>({} as any)
    const [error, setError] = useState("")

    useEffect(() => {
        loadPermissions()
    }, [])

    const loadPermissions = async () => {
        setLoading(true)
        const res = await getRolePermissions()
        if (res.error) {
            setError(res.error)
        } else if (res.permissions) {
            // Convert array of objects to Map-like object
            const permMap: any = {}
            res.permissions.forEach((p: any) => {
                permMap[p.role] = p.permissions
            })
            setPermissions(permMap)
        }
        setLoading(false)
    }

    const togglePermission = (role: Role, permission: string) => {
        setPermissions(prev => {
            const currentRolePerms = prev[role] || []
            const hasPerm = currentRolePerms.includes(permission)

            let newPerms
            if (hasPerm) {
                newPerms = currentRolePerms.filter(p => p !== permission)
            } else {
                newPerms = [...currentRolePerms, permission]
            }

            return {
                ...prev,
                [role]: newPerms
            }
        })
    }

    const handleSave = async (role: Role) => {
        setSaving(true)
        const res = await updateRolePermissions(role, permissions[role])
        if (res.error) {
            alert(res.error)
        } else {
            // Show success briefly?
        }
        setSaving(false)
    }

    const ROLES: Role[] = ["ADMIN", "MEMBER", "USER"]

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <RotateCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Yetkiler yükleniyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl border border-purple-100">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <Shield className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Rol ve Yetki Yönetimi</h2>
                        <p className="text-gray-500 font-medium">Hangi rolün hangi özelliklere erişebileceğini buradan yönetebilirsiniz.</p>
                    </div>
                </div>

                <div className="flex gap-2 text-sm text-purple-700 bg-white/50 p-4 rounded-xl border border-purple-100">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p>Dikkat: Yetki değişiklikleri kullanıcıların oturumlarını yenilemesini gerektirebilir.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {ROLES.map(role => (
                    <div key={role} className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col h-full">
                        {/* Header */}
                        <div className={`p-6 border-b border-gray-100 ${role === 'ADMIN' ? 'bg-red-50' :
                                role === 'MEMBER' ? 'bg-blue-50' : 'bg-gray-50'
                            }`}>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className={`text-xl font-black ${role === 'ADMIN' ? 'text-red-700' :
                                        role === 'MEMBER' ? 'text-blue-700' : 'text-gray-700'
                                    }`}>
                                    {role === 'ADMIN' ? 'Yönetici' : role === 'MEMBER' ? 'Üye' : 'Kullanıcı'}
                                </h3>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                                        role === 'MEMBER' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                                    }`}>
                                    {permissions[role]?.length || 0} Yetki
                                </div>
                            </div>
                            <p className="text-sm opacity-70 font-medium">
                                {role === 'ADMIN' ? 'Tam erişim yetkisine sahiptir.' :
                                    role === 'MEMBER' ? 'Dernek üyeleri için tanımlanan yetkiler.' : 'Standart site ziyaretçileri.'}
                            </p>
                        </div>

                        {/* Permissions List */}
                        <div className="flex-1 p-4 overflow-y-auto max-h-[600px] space-y-1">
                            {Object.values(PERMISSIONS).map((perm) => {
                                const isGranted = permissions[role]?.includes(perm)
                                const isLocked = role === 'ADMIN' && perm === PERMISSIONS.MANAGE_ROLES // Prevent removing crucial permission

                                return (
                                    <label
                                        key={perm}
                                        className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${isGranted
                                                ? 'bg-green-50/50 hover:bg-green-50 border border-green-100'
                                                : 'hover:bg-gray-50 border border-transparent'
                                            } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${isGranted ? 'bg-green-500 border-green-500' : 'border-gray-300'
                                                }`}>
                                                {isGranted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                            <span className={`text-sm font-bold ${isGranted ? 'text-gray-800' : 'text-gray-500'}`}>
                                                {PERMISSION_LABELS[perm]}
                                            </span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={isGranted}
                                            disabled={isLocked}
                                            onChange={() => !isLocked && togglePermission(role, perm)}
                                        />
                                    </label>
                                )
                            })}
                        </div>

                        {/* Footer Action */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                            <button
                                onClick={() => handleSave(role)}
                                disabled={saving}
                                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                            >
                                {saving ? <RotateCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Kaydet
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
