"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import fs from "fs" // Added for debugging

export async function getTeamsData() {
    let teams = await prisma.team.findMany({
        include: { _count: { select: { members: true } } }
    })

    // Custom Sorting Logic
    const sortOrder = [
        "Yönetim Denetim",
        "Yönetim & Denetim", // Variant
        "Hastane Ziyaretleri",
        "Okul Ziyaretleri",
        "Onur Üyeleri"
    ]

    teams = teams.sort((a, b) => {
        const indexA = sortOrder.findIndex(key => a.name.includes(key)) // flexible matching
        const indexB = sortOrder.findIndex(key => b.name.includes(key))

        if (indexA !== -1 && indexB !== -1) return indexA - indexB
        if (indexA !== -1) return -1
        if (indexB !== -1) return 1
        return a.name.localeCompare(b.name)
    })

    const roles = await prisma.teamRole.findMany()
    const members = await prisma.teamMember.findMany({
        include: {
            user: { select: { id: true, name: true, email: true, image: true } },
            team: true,
            role: true
        }
    })
    return { teams, roles, members }
}

export async function createTeam(name: string) {
    try {
        await prisma.team.create({ data: { name } })
        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        return { error: "Failed to create team" }
    }
}

export async function deleteTeam(id: string) {
    try {
        fs.appendFileSync("debug_log.txt", `[${new Date().toISOString()}] Attempting to delete team ${id}\n`)

        // Manual Cascade: Delete all members of this team first
        await prisma.teamMember.deleteMany({
            where: { teamId: id }
        })
        fs.appendFileSync("debug_log.txt", `[${new Date().toISOString()}] Deleted members for team ${id}\n`)

        await prisma.team.delete({ where: { id } })

        fs.appendFileSync("debug_log.txt", `[${new Date().toISOString()}] Successfully deleted team ${id}\n`)
        revalidatePath("/admin")
        return { success: true }
    } catch (e: any) {
        fs.appendFileSync("debug_log.txt", `[${new Date().toISOString()}] Failed to delete team ${id}: ${e.message}\n`)
        return { error: "Failed to delete team: " + e.message }
    }
}

export async function createTeamRole(name: string) {
    try {
        await prisma.teamRole.create({ data: { name } })
        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        return { error: "Failed to create role" }
    }
}

export async function deleteTeamRole(id: string) {
    try {
        fs.appendFileSync("debug_log.txt", `[${new Date().toISOString()}] Attempting to delete role ${id}\n`)

        // Manual Cascade: Delete all members with this role first
        await prisma.teamMember.deleteMany({
            where: { roleId: id }
        })
        fs.appendFileSync("debug_log.txt", `[${new Date().toISOString()}] Deleted members for role ${id}\n`)

        await prisma.teamRole.delete({ where: { id } })

        fs.appendFileSync("debug_log.txt", `[${new Date().toISOString()}] Successfully deleted role ${id}\n`)
        revalidatePath("/admin")
        return { success: true }
    } catch (e: any) {
        fs.appendFileSync("debug_log.txt", `[${new Date().toISOString()}] Failed to delete role ${id}: ${e.message}\n`)
        return { error: "Failed to delete role: " + e.message }
    }
}

export async function assignUserToTeam(userId: string, teamId: string, roleId: string) {
    try {
        // Check if assignment exists
        const existing = await prisma.teamMember.findUnique({
            where: {
                userId_teamId: { userId, teamId }
            }
        })

        if (existing) {
            // Update role
            await prisma.teamMember.update({
                where: { id: existing.id },
                data: { roleId }
            })
        } else {
            // Create new assignment
            await prisma.teamMember.create({
                data: { userId, teamId, roleId }
            })
        }
        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: "Failed to assign user" }
    }
}

export async function removeUserFromTeam(memberId: string) {
    try {
        fs.appendFileSync("debug_log.txt", `[${new Date().toISOString()}] Attempting to delete member ${memberId}\n`)
        await prisma.teamMember.delete({ where: { id: memberId } })
        fs.appendFileSync("debug_log.txt", `[${new Date().toISOString()}] Successfully deleted member ${memberId}\n`)
        revalidatePath("/admin")
        return { success: true }
    } catch (e: any) {
        fs.appendFileSync("debug_log.txt", `[${new Date().toISOString()}] Failed to delete member ${memberId}: ${e.message}\n`)
        return { error: "Failed to remove user: " + e.message }
    }
}
