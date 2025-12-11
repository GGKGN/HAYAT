"use client"

import { useState } from "react"
import {
    Save,
    LayoutDashboard,
    Settings,
    Mail,
    Phone,
    MapPin,
    ArrowUp,
    ArrowDown,
    SaveAll
} from "lucide-react"
import { updateContactInfo } from "@/actions/contact"
import { updateNavSettings } from "@/actions/settings"

interface SettingsTabProps {
    contactInfo: any
    navSettings: any[]
}

export default function SettingsTab({ contactInfo, navSettings }: SettingsTabProps) {
    // Nav Settings State
    const [navOrder, setNavOrder] = useState(navSettings || [])
    const [isSavingNav, setIsSavingNav] = useState(false)

    async function handleSaveContacts(formData: FormData) {
        await updateContactInfo(formData)
        alert("İletişim bilgileri başarıyla güncellendi!")
    }

    async function handleSaveNavOrder() {
        setIsSavingNav(true)
        try {
            await updateNavSettings(navOrder)
            alert("Menü sıralaması güncellendi!")
        } finally {
            setIsSavingNav(false)
        }
    }

    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === navOrder.length - 1) return;

        const newOrder = [...navOrder];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];

        setNavOrder(newOrder);
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information Section */}
            <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Settings className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800">İletişim Bilgileri</h2>
                            <p className="text-sm text-gray-500 font-medium">Sitenizde görünecek iletişim detayları</p>
                        </div>
                    </div>

                    <form action={handleSaveContacts} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">E-Posta Adresi</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    name="email"
                                    defaultValue={contactInfo?.email}
                                    type="email"
                                    placeholder="ornek@email.com"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border border-gray-100 focus:border-blue-500/20 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Telefon Numarası</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <input
                                    name="phone"
                                    defaultValue={contactInfo?.phone}
                                    type="text"
                                    placeholder="+90 555 ..."
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border border-gray-100 focus:border-green-500/20 focus:bg-white focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-medium text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Adres</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <textarea
                                    name="address"
                                    defaultValue={contactInfo?.address}
                                    rows={4}
                                    placeholder="Açık adres..."
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border border-gray-100 focus:border-purple-500/20 focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all outline-none font-medium text-gray-700 resize-none"
                                />
                            </div>
                        </div>

                        <button className="w-full bg-gray-900 text-white p-4 rounded-2xl font-bold hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-gray-200">
                            <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Değişiklikleri Kaydet
                        </button>
                    </form>
                </div>
            </div>

            {/* Navigation Order Section */}
            <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-800">Menü Sıralaması</h2>
                                <p className="text-sm text-gray-500 font-medium">Navigasyon çubuğu düzeni</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSaveNavOrder}
                            disabled={isSavingNav}
                            className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-orange-100 transition-colors flex items-center gap-2"
                        >
                            <SaveAll className="w-4 h-4" />
                            {isSavingNav ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>

                    <div className="space-y-3">
                        {navOrder.map((item: any, index: number) => (
                            <div
                                key={item.path}
                                className="group flex items-center justify-between bg-white p-4 rounded-2xl border-2 border-transparent hover:border-gray-100 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center font-bold text-sm group-hover:bg-gray-900 group-hover:text-white transition-colors">
                                        {index + 1}
                                    </div>
                                    <span className="font-bold text-gray-700 text-lg">{item.name}</span>
                                </div>
                                <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => moveItem(index, 'up')}
                                        disabled={index === 0}
                                        className="p-2 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl text-gray-600 disabled:opacity-30 disabled:hover:bg-gray-50 transition-all shadow-sm"
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => moveItem(index, 'down')}
                                        disabled={index === navOrder.length - 1}
                                        className="p-2 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl text-gray-600 disabled:opacity-30 disabled:hover:bg-gray-50 transition-all shadow-sm"
                                    >
                                        <ArrowDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                        <p className="text-xs text-gray-500 font-medium text-center">
                            İpucu: Değişiklikleri yaptıktan sonra sağ üstteki "Kaydet" butonuna basmayı unutmayın.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
