"use client"

import { useTransition, useState } from "react"
import { deleteMessage } from "@/actions/contact"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DeleteMessageButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()
    const [needsConfirm, setNeedsConfirm] = useState(false)
    const router = useRouter()

    const handleDelete = async (e: React.MouseEvent) => {
        // Prevent default simply to stop any bubbling, though handled here.
        e.preventDefault()
        e.stopPropagation() // Ensure nothing else catches this

        if (!needsConfirm) {
            setNeedsConfirm(true)
            setTimeout(() => setNeedsConfirm(false), 3000)
            return
        }

        try {
            const result = await deleteMessage(id)
            if (result.success) {
                startTransition(() => {
                    router.refresh()
                })
            } else {
                alert(`Hata: ${result.error}`)
            }
        } catch (error) {
            alert("Bir hata oluştu.")
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${needsConfirm ? "bg-red-500 text-white hover:bg-red-600 px-4 w-auto" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}
            title={needsConfirm ? "Onaylamak için tekrar tıklayın" : "Mesajı Sil"}
            type="button" // Explicitly type button to avoid form submission if nested
        >
            <Trash2 className="w-4 h-4" />
            {needsConfirm && <span className="text-xs font-bold whitespace-nowrap">Sil?</span>}
        </button>
    )
}
