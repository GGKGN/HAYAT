"use server"

import { prisma } from "@/lib/prisma"

import { revalidatePath } from "next/cache"

export async function createFeedback(content: string) {
    try {
        if (!content || content.trim().length === 0) {
            return { error: "Mesaj boş olamaz." }
        }

        await prisma.feedback.create({
            data: {
                content: content.trim()
            }
        })

        revalidatePath("/admin")

        return { success: true }
    } catch (error) {
        console.error("Feedback error:", error)
        return { error: "Bir hata oluştu, lütfen tekrar deneyin." }
    }
}

export async function getFeedbacks() {
    try {
        return await prisma.feedback.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
    } catch (error) {
        console.error("Fetch feedbacks error:", error)
        return []
    }
}

export async function deleteFeedback(id: string) {
    try {
        await prisma.feedback.delete({
            where: { id }
        })
        revalidatePath("/admin")
        return { success: true }
    } catch (error) {
        console.error("Delete feedback error details:", error)
        return { error: "Silme işlemi başarısız: " + (error as Error).message }
    }
}
