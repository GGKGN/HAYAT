
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function promoteExistingUser() {
    const name = "Ali Kağan Bayram" // From browser output

    const user = await prisma.user.findFirst({
        where: { name: { contains: name } }
    })

    if (!user) {
        console.error(`User ${name} not found! Listing all users...`)
        const users = await prisma.user.findMany()
        users.forEach(u => console.log(u.name, u.email))
        return
    }

    console.log(`Found user: ${user.name} (${user.email}) - Role: ${user.role}`)

    await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' }
    })

    console.log("Successfully promoted to ADMIN.")
}

promoteExistingUser()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
