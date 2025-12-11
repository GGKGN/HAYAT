
import { PrismaClient } from "@prisma/client"
import { existsSync } from "fs"
import { join } from "path"

const prisma = new PrismaClient()

async function main() {
    console.log("Checking user images...")

    const users = await prisma.user.findMany({
        select: { email: true, image: true, name: true }
    })

    for (const u of users) {
        console.log(`\nUser: ${u.name} (${u.email})`)
        console.log(`Image URL: ${u.image}`)

        if (u.image && u.image.startsWith("/uploads/")) {
            const relativePath = u.image.substring(1) // remove leading /
            const fullPath = join(process.cwd(), "public", relativePath)
            const exists = existsSync(fullPath)
            console.log(`File path: ${fullPath}`)
            console.log(`Exists on disk? ${exists ? "YES" : "NO"}`)
        } else {
            console.log("Image is not a local upload or is null")
        }
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
