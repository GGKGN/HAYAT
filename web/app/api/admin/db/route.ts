import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const secret = req.headers.get("x-admin-secret")
        if (secret !== process.env.NEXTAUTH_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { model, action = "findMany", args = {} } = body

        // @ts-ignore - Dynamic access to prisma models
        if (!prisma[model]) {
            return NextResponse.json({ error: `Model ${model} not found` }, { status: 400 })
        }

        // @ts-ignore - Dynamic access to prisma models
        if (!prisma[model][action]) {
            return NextResponse.json({ error: `Action ${action} not allowed or found` }, { status: 400 })
        }

        // @ts-ignore
        const result = await prisma[model][action](args)

        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
