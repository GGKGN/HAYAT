"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createWish } from "@/actions/wishes"
import { uploadWishImage } from "@/actions/upload"
import { Loader2, PlusCircle, Upload, Calendar, X, Save, ArrowLeft, Lock, Info } from "lucide-react"
import Image from "next/image"

interface Volunteer {
    id: string
    name: string | null
    image: string | null
    role: string
}

interface CreateWishFormProps {
    volunteers: Volunteer[]
}

export default function CreateWishForm({ volunteers }: CreateWishFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFile(file)
        }
    }

    const handleFile = (file: File) => {
        if (file.type.startsWith("image/")) {
            setSelectedImage(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) {
            handleFile(file)
        }
    }

    const clearImage = () => {
        setSelectedImage(null)
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(e.currentTarget)

            // Upload image if selected
            if (selectedImage) {
                const imageForm = new FormData()
                imageForm.append("file", selectedImage)
                const uploadResult = await uploadWishImage(imageForm)
                if (uploadResult.success && uploadResult.imageUrl) {
                    formData.append("imageUrl", uploadResult.imageUrl)
                }
            }

            const result = await createWish(formData)
            if (result?.success) {
                router.push("/profile")
                router.refresh()
            } else {
                alert("Bir hata oluştu. Lütfen tekrar deneyin.")
            }
        } catch (error) {
            console.error(error)
            alert("Bir hata oluştu.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Child Info Section */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-blue-100 transition-all">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-500/10 group-hover:bg-blue-500 transition-colors" />
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        👶
                    </div>
                    Çocuk Bilgileri
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-700 ml-1">Çocuğun Adı / Rumuzu</label>
                            <span className="text-xs font-bold text-blue-500 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                                <Lock className="w-3 h-3" /> Gizli Tutulabilir
                            </span>
                        </div>
                        <input
                            type="text"
                            name="childName"
                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500/20 rounded-xl p-4 transition-all font-medium outline-none"
                            placeholder="Örn: Ali K. veya Süper Kahraman"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Yaşı</label>
                        <input
                            type="number"
                            name="childAge"
                            min="0"
                            max="18"
                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500/20 rounded-xl p-4 transition-all font-medium outline-none"
                            placeholder="Örn: 8"
                        />
                    </div>
                </div>
            </div>

            {/* Wish Details Section */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-purple-100 transition-all">
                <div className="absolute top-0 left-0 w-2 h-full bg-purple-500/10 group-hover:bg-purple-500 transition-colors" />
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        ⭐
                    </div>
                    Dilek Detayları
                </h3>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Dilek Başlığı</label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-purple-500/20 rounded-xl p-4 transition-all font-medium outline-none"
                            placeholder="Örn: Kırmızı bir bisiklet"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Dilek Hikayesi ve Detaylar</label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-purple-500/20 rounded-xl p-4 transition-all font-medium outline-none resize-none"
                            placeholder="Çocuğun dileği neden istediği, varsa özel marka/model tercihleri, renk seçenekleri vb. detayları buraya yazınız..."
                        ></textarea>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Dilek Bağlantısı (Opsiyonel)</label>
                        <input
                            type="url"
                            name="url"
                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-purple-500/20 rounded-xl p-4 transition-all font-medium outline-none"
                            placeholder="https://..."
                        />
                    </div>
                </div>
            </div>

            {/* Planning Section */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-teal-100 transition-all">
                    <div className="absolute top-0 left-0 w-2 h-full bg-teal-500/10 group-hover:bg-teal-500 transition-colors" />
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                            📅
                        </div>
                        Planlama
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Tahmini Gerçekleşme Tarihi</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    name="estimatedDate"
                                    className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-teal-500/20 rounded-xl p-4 pl-12 transition-all font-medium outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Sorumlu Gönüllü</label>
                            <div className="relative">
                                <select
                                    name="volunteerId"
                                    className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-teal-500/20 rounded-xl p-4 appearance-none transition-all font-medium outline-none cursor-pointer"
                                >
                                    <option value="NO_VOLUNTEER">Gönüllü Seçiniz</option>
                                    {volunteers.map(v => (
                                        <option key={v.id} value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 font-bold text-xs">▼</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Images Section */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-orange-100 transition-all">
                    <div className="absolute top-0 left-0 w-2 h-full bg-orange-500/10 group-hover:bg-orange-500 transition-colors" />
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                            🖼️
                        </div>
                        Görseller
                    </h3>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Resim / Çizim Yükle</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center
                                ${isDragging ? 'border-orange-500 bg-orange-50 scale-[0.99]' : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'}`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                                accept="image/*"
                                className="hidden"
                            />

                            {previewUrl ? (
                                <div className="relative w-full h-full min-h-[160px]">
                                    <Image
                                        src={previewUrl}
                                        alt="Preview"
                                        fill
                                        className="object-contain rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); clearImage(); }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <div className="text-gray-600 font-medium">
                                        <span className="text-blue-600 font-bold">Tıkla</span> veya sürükle bırak
                                    </div>
                                    <div className="text-xs text-gray-400 font-bold">SVG, PNG, JPG (MAX. 5MB)</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end items-center gap-4 pt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-4 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all hover:-translate-y-1"
                >
                    Vazgeç
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-70 flex items-center gap-2"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Dileği Kaydet
                </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-blue-900 text-sm">Unutmayın</h4>
                    <p className="text-blue-700 text-sm mt-0.5">
                        Kaydettiğiniz dilekler önce "Onay Bekliyor" durumuna düşecektir. Yönetici onayından sonra gönüllülere açılacaktır.
                    </p>
                </div>
            </div>

        </form>
    )
}
