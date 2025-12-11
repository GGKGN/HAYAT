
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function setupTestEnv() {
    const email = "browser_test_admin@example.com"
    const password = "password123"
    const hashedPassword = await hash(password, 12)

    // 1. Upsert Admin User
    const user = await prisma.user.upsert({
        where: { email },
        update: { role: 'ADMIN' },
        create: {
            email,
            name: "Browser Test Admin",
            password: hashedPassword,
            role: 'ADMIN'
        }
    })
    console.log(`User ready: ${email} / ${password}`)

    // 2. Create Test Message
    const msg = await prisma.contactMessage.create({
        data: {
            name: "Browser Eraser",
            email: "eraser@example.com",
            subject: "Delete Me Please",
            message: "This message exists only to be deleted by the browser agent."
        }
    })
    console.log(`Message created: ${msg.subject}`)
}

setupTestEnv()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
