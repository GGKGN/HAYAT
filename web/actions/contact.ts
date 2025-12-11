"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// --- Public Actions ---

export async function submitContactMessage(formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    if (!name || !email || !message) {
        return { error: "Lütfen gerekli alanları doldurunuz." }
    }

    try {
        await prisma.contactMessage.create({
            data: {
                name,
                email,
                subject: subject || "Konusuz",
                message
            }
        })
        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        console.error("Contact Error:", e)
        return { error: "Mesaj gönderilemedi." }
    }
}

export async function getContactInfo() {
    try {
        let info = await prisma.contactInfo.findFirst()

        if (!info) {
            // Seed default if not exists
            info = await prisma.contactInfo.create({
                data: {
                    email: "iletisim@rteuhayat.org",
                    phone: "+90 (464) 223 61 26",
                    address: "Recep Tayyip Erdoğan Üniversitesi, Zihni Derin Yerleşkesi, Merkez, Rize"
                }
            })
        }
        return info
    } catch (e) {
        return null
    }
}

// --- Admin Actions ---

export async function getContactMessages() {
    try {
        return await prisma.contactMessage.findMany({
            orderBy: { createdAt: "desc" }
        })
    } catch (e) {
        return []
    }
}

export async function toggleMessageReadStatus(id: string, currentStatus: boolean) {
    try {
        await prisma.contactMessage.update({
            where: { id },
            data: { isRead: !currentStatus }
        })
        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        return { error: "Durum güncellenemedi." }
    }
}

export async function deleteMessage(id: string) {
    console.log("[SERVER ACTION] Delete request received for ID:", id)
    if (!id) {
        console.error("[SERVER ACTION] Error: No ID provided")
        return { error: "ID bulunamadı" }
    }
    try {
        await prisma.contactMessage.delete({ where: { id } })
        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        console.error("Delete Message Error:", e)
        return { error: "Silme işlemi başarısız: " + (e as Error).message }
    }
}

export async function updateContactInfo(formData: FormData) {
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string

    const info = await prisma.contactInfo.findFirst()

    if (info) {
        await prisma.contactInfo.update({
            where: { id: info.id },
            data: { email, phone, address }
        })
    } else {
        await prisma.contactInfo.create({
            data: { email, phone, address }
        })
    }
    revalidatePath("/contact")
    revalidatePath("/admin")
    return { success: true }
}
