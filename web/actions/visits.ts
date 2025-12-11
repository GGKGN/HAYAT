"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createVisit(date: Date, experience: string, note?: string) {
    const session = await auth()
    if (!session || !session.user) {
        return { error: "Unauthorized" }
    }

    try {
        // Ensure date is stored at UTC midnight or consistent timezone handling if needed
        // For simplicity, we just store the full date/time passed, usually midnight from calendar
        await prisma.visitSchedule.create({
            data: {
                date,
                userId: session.user.id,
                experience,
                note
            }
        })
        revalidatePath("/calendar")
        return { success: true }
    } catch (error: any) {
        console.error("Failed to create visit:", error)
        if (error.code === 'P2002') {
            return { error: "Bu tarih için zaten bir kaydınız bulunuyor." }
        }
        return { error: "Beklenmedik bir hata oluştu. Lütfen veritabanı bağlantısını kontrol edin." }
    }
}

export async function deleteVisit(id: string) {
    const session = await auth()
    if (!session || !session.user) {
        return { error: "Unauthorized" }
    }

    try {
        const visit = await prisma.visitSchedule.findUnique({
            where: { id }
        })

        if (!visit) return { error: "Visit not found" }

        // Only allow deleting own visit or if admin
        if (visit.userId !== session.user.id && session.user.role !== "ADMIN") {
            return { error: "Unauthorized" }
        }

        await prisma.visitSchedule.delete({
            where: { id }
        })
        revalidatePath("/calendar")
        return { success: true }
    } catch (error) {
        return { error: "Failed to delete visit" }
    }
}

export async function getVisits(startDate: Date, endDate: Date) {
    try {
        const visits = await prisma.visitSchedule.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                        id: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        })
        return visits
    } catch (error) {
        console.error("Failed to fetch visits:", error)
        return []
    }
}
