"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { getSiteSettings } from "./settings"

export async function submitApplication(formData: FormData) {
    const session = await auth()
    if (!session?.user) {
        return { error: "Giriş yapmalısınız." }
    }

    // Check if system is open
    const settings = await getSiteSettings()
    const isOpen = settings.find(s => s.key === "VOLUNTEER_SYS_OPEN")?.value === "true"

    if (!isOpen) {
        // Allow if no setting exists yet (first run)? No, safer to default closed.
        // Actually, let's default to OPEN if not set for easier onboarding, or CLOSED? 
        // User asked to make it toggleable. Let's assume default closed if not set.
        if (settings.find(s => s.key === "VOLUNTEER_SYS_OPEN")?.value !== "true") {
            return { error: "Başvurular şu an kapalı." }
        }
    }

    const teamId = formData.get("teamId") as string
    if (!teamId) return { error: "Takım seçmelisiniz." }

    // Parse answers from formData
    // Format: question_{id}
    const questions = await prisma.volunteerQuestion.findMany({ where: { isActive: true } })
    const answers: { question: string, answer: string }[] = []

    for (const q of questions) {
        const ans = formData.get(`question_${q.id}`) as string
        if (ans) {
            answers.push({
                question: q.text,
                answer: ans
            })
        }
    }

    try {
        await prisma.volunteerApplication.create({
            data: {
                userId: session.user.id,
                teamId,
                answers: JSON.stringify(answers), // Store as stringified JSON or just JSON type if Prisma supports it directly, but explicit is safe
                status: "PENDING"
            }
        })
        revalidatePath("/admin")
        revalidatePath("/profile")
        return { success: true }
    } catch (e) {
        console.error("Application error:", e)
        return { error: "Başvuru alınırken hata oluştu (Zaten başvurmuş olabilirsiniz)." }
    }
}

export async function getVolunteerQuestions() {
    return await prisma.volunteerQuestion.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
    })
}

export async function getMyApplication() {
    const session = await auth()
    if (!session?.user) return null

    return await prisma.volunteerApplication.findFirst({
        where: { userId: session.user.id },
        include: { team: true },
        orderBy: { createdAt: 'desc' }
    })
}
