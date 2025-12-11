"use server"

import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { revalidatePath } from "next/cache"

export async function uploadReport(formData: FormData, userId: string) {
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const tagsJson = formData.get("tags") as string // Expecting JSON array of tag IDs

    if (!file) {
        throw new Error("No file uploaded")
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    const filename = `${Date.now()}-${file.name}`
    const filepath = join(uploadDir, filename)

    await writeFile(filepath, buffer)

    const publicPath = `/uploads/${filename}`

    // Parse tags
    let tagConnect: { id: string }[] = []
    if (tagsJson) {
        try {
            const tagIds = JSON.parse(tagsJson) as string[]
            tagConnect = tagIds.map(id => ({ id }))
        } catch (e) {
            console.error("Failed to parse tags", e)
        }
    }

    await prisma.report.create({
        data: {
            title,
            description,
            filePath: publicPath,
            uploadedByUserId: userId,
            tags: {
                connect: tagConnect
            }
        },
    })

    revalidatePath("/reports")
    revalidatePath("/admin")
}

export async function createTag(name: string) {
    try {
        await prisma.tag.create({
            data: { name }
        })
        revalidatePath("/reports")
        return { success: true }
    } catch (e) {
        return { error: "Failed to create tag" }
    }
}

export async function deleteTag(id: string) {
    try {
        await prisma.tag.delete({ where: { id } })
        revalidatePath("/reports")
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete tag" }
    }
}

export async function getTags() {
    return await prisma.tag.findMany({
        orderBy: { name: 'asc' }
    })
}

export async function getReports() {
    return await prisma.report.findMany({
        include: {
            uploadedBy: {
                select: {
                    name: true,
                    image: true
                },
            },
            tags: true
        },
        orderBy: {
            uploadedAt: "desc",
        },
    })
}

export async function deleteReport(id: string) {
    try {
        await prisma.report.delete({ where: { id } })
        revalidatePath("/reports")
        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete report" }
    }
}

// Keep getReportMetadata for Admin tabs compatibility if needed
export async function getReportMetadata() {
    return await prisma.report.findMany({
        include: {
            uploadedBy: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            uploadedAt: "desc",
        },
    })
}
