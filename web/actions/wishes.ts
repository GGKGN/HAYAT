"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getWishes() {
    return await prisma.wish.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    })
}

import { auth } from "@/lib/auth"

export async function createWish(title: string, description: string, userId: string, url?: string) {
    const session = await auth()
    if (!session || session.user.role === "USER") {
        return { error: "Unauthorized" }
    }
    await prisma.wish.create({
        data: {
            title,
            description,
            userId,
            status: "PENDING",
            url,
        },
    })
    revalidatePath("/")
}

export async function updateWishStatus(id: string, status: "PENDING" | "IN_PROCESS" | "COMPLETED") {
    await prisma.wish.update({
        where: { id },
        data: { status },
    })
    revalidatePath("/")
    revalidatePath("/admin")
}

export async function deleteWish(id: string) {
    try {
        await prisma.wish.delete({ where: { id } })
        revalidatePath("/admin")
        revalidatePath("/wishes")
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete wish" }
    }
}

export async function getCompletedWishesCount() {
    return await prisma.wish.count({
        where: {
            status: "COMPLETED",
        },
    })
}
