"use server"

import { prisma } from "@/lib/prisma" // Use named import as fixed previously
import { revalidatePath } from "next/cache"

export async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
                createdAt: true
            }
        })
        return users
    } catch (e) {
        return []
    }
}

export async function promoteUser(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: "ADMIN" }
        })
        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        return { error: "Failed to promote user" }
    }
}

export async function deleteUser(userId: string) {
    try {
        await prisma.user.delete({
            where: { id: userId }
        })
        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete user" }
    }
}

export async function updateUserRole(userId: string, role: "ADMIN" | "MEMBER" | "USER") {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role }
        })
        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        console.error("Update Role Error:", e)
        return { error: "Failed to update user role" }
    }
}

export async function updateUserImage(userId: string, imageUrl: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { image: imageUrl }
        })
        revalidatePath("/profile")
        return { success: true }
    } catch (e) {
        return { error: "Failed to update profile image" }
    }
}

export async function updateUserProfile(userId: string, data: { name: string; title: string; bio: string }) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                title: data.title,
                bio: data.bio
            }
        })
        revalidatePath("/profile")
        return { success: true }
    } catch (e) {
        return { error: "Failed to update profile" }
    }
}
