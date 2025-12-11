"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function uploadProfileImage(userId: string, formData: FormData) {
    const file = formData.get("file") as File

    if (!file) {
        return { error: "No file uploaded" }
    }

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = file.name.split('.').pop()
        const filename = `profile-${userId}-${uniqueSuffix}.${ext}`

        // Save to public/uploads
        const uploadDir = join(process.cwd(), 'public', 'uploads')

        try {
            await require("fs/promises").mkdir(uploadDir, { recursive: true })
        } catch (error) {
            // Ignore error if folder exists
        }

        const path = join(uploadDir, filename)
        await writeFile(path, buffer)

        // Public URL
        const imageUrl = `/uploads/${filename}`

        // Update User
        await prisma.user.update({
            where: { id: userId },
            data: { image: imageUrl }
        })

        revalidatePath("/profile")
        return { success: true, imageUrl }

    } catch (e) {
        console.error("Upload error:", e)
        return { error: "Failed to upload image" }
    }
}
