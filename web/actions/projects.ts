"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getProjects() {
    return await prisma.project.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })
}

export async function createProject(formData: FormData) {
    try {
        await prisma.project.create({
            data: {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                status: (formData.get("status") as string) || "ONGOING",
                image: (formData.get("image") as string) || null,
            }
        })
        revalidatePath("/")
        revalidatePath("/projects")
        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        return { error: "Failed to create project" }
    }
}

export async function deleteProject(id: string) {
    try {
        await prisma.project.delete({ where: { id } })
        revalidatePath("/projects")
        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete project" }
    }
}
