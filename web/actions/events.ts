"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getEvents() {
    return await prisma.event.findMany({
        orderBy: {
            date: "asc",
        },
    })
}

export async function createEvent(formData: FormData) {
    try {
        await prisma.event.create({
            data: {
                title: formData.get("title") as string,
                location: formData.get("location") as string,
                date: new Date(formData.get("date") as string),
                coverImage: formData.get("coverImage") as string || null,
            }
        })
        revalidatePath("/")
        revalidatePath("/events")
        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        return { error: "Failed to create event" }
    }
}

export async function deleteEvent(id: string) {
    try {
        await prisma.event.delete({ where: { id } })
        revalidatePath("/events")
        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete event" }
    }
}

export async function getEventsCount() {
    return await prisma.event.count()
}

export async function updateEvent(id: string, data: { title: string, location: string, date: Date, coverImage: string | null }) {
    try {
        await prisma.event.update({
            where: { id },
            data: {
                title: data.title,
                location: data.location,
                date: data.date,
                coverImage: data.coverImage
            }
        })
        revalidatePath("/events")
        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        console.error("Update event error:", e)
        return { error: "Failed to update event" }
    }
}
