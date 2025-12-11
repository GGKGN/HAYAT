
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Checking user roles...")

    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true }
    })

    console.table(users)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
