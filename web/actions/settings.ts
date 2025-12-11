"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const DEFAULT_NAV_ORDER = [
    { name: "Ana Sayfa", path: "/" },
    { name: "Takımlar", path: "/teams" },
    { name: "Etkinlikler", path: "/events" },
    { name: "Projeler", path: "/projects" },
    { name: "Destek Ol", path: "/support" }, // Added
    { name: "Hakkımızda", path: "/about" },
    { name: "İletişim", path: "/contact" }
]

export async function getNavSettings() {
    try {
        const settings = await prisma.siteSettings.findUnique({
            where: { key: "NAV_ORDER" }
        })

        if (!settings) return DEFAULT_NAV_ORDER

        let navOrder = JSON.parse(settings.value)

        // Auto-patch: Ensure all DEFAULT links exist in the stored order
        // This fixes the issue where old DB state hides new added pages
        let hasChanges = false
        DEFAULT_NAV_ORDER.forEach(defLink => {
            const exists = navOrder.some((l: any) => l.path === defLink.path)
            if (!exists) {
                // Insert before 'Contact' if possible, or just push
                const contactIndex = navOrder.findIndex((l: any) => l.path === "/contact")
                if (contactIndex !== -1) {
                    navOrder.splice(contactIndex, 0, defLink)
                } else {
                    navOrder.push(defLink)
                }
                hasChanges = true
            }
        })

        // If we patched it, update the DB to make it permanent
        if (hasChanges) {
            await prisma.siteSettings.update({
                where: { key: "NAV_ORDER" },
                data: { value: JSON.stringify(navOrder) }
            })
        }

        return navOrder
    } catch (error) {
        console.error("Failed to fetch nav settings:", error)
        return DEFAULT_NAV_ORDER
    }
}

export async function updateNavSettings(newOrder: any[]) {
    try {
        await prisma.siteSettings.upsert({
            where: { key: "NAV_ORDER" },
            update: { value: JSON.stringify(newOrder) },
            create: { key: "NAV_ORDER", value: JSON.stringify(newOrder) }
        })
        revalidatePath("/")
        revalidatePath("/admin")
        return { success: true }
    } catch (error) {
        console.error("Failed to update nav settings:", error)
        return { success: false, error: "Failed to update settings" }
    }
}

export async function getSiteSettings() {
    return await prisma.siteSettings.findMany()
}

export async function updateSiteSetting(key: string, value: string) {
    try {
        await prisma.siteSettings.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        })
        revalidatePath("/")
        revalidatePath("/admin")
        return { success: true }
    } catch (error) {
        console.error("Failed to update site setting:", error)
        return { success: false, error: "Failed to update setting" }
    }
}
