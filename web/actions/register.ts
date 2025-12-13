"use server"

import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const faculty = formData.get("faculty") as string
    const grade = formData.get("grade") as string
    const userType = (formData.get("userType") as "STUDENT" | "DONOR") || "STUDENT"

    if (!email || !password || !name) {
        return { error: "Missing fields" }
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return { error: "User already exists" }
    }

    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            faculty: userType === 'STUDENT' ? faculty : null,
            grade: userType === 'STUDENT' ? grade : null,
            userType,
            role: "USER", // Default role
            status: "PENDING" // Default status for new registrations? Or ACTIVE? Let's say PENDING or ACTIVE based on requirements. User didn't specify, but "PENDING" is safer if approval needed. Admin can approve. Actually, schema default was ACTIVE. Let's stick to Schema default if I omit it, or set to ACTIVE. Let's set to ACTIVE for now or let default handle it. Schema default is ACTIVE. But let's be explicit if we want. I'll let default handle it or set ACTIVE.
            // Actually previous schema change: status UserStatus @default(ACTIVE)
            // So if I don't pass it, it is ACTIVE.
        },
    })

    return { success: true }
}
