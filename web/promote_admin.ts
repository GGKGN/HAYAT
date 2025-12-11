import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const email = "Ali.kagan.bayram@gmail.com"
    const user = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
    })
    console.log(`User ${user.email} is now ${user.role}`)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
