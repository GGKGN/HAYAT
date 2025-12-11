
import { PrismaClient } from "@prisma/client"
import { getRolePermissions } from "./actions/permissions"

const prisma = new PrismaClient()

async function main() {
    console.log("Inspecting permissions...")

    // 1. Get all users and their roles
    const users = await prisma.user.findMany({
        select: { email: true, role: true }
    })
    console.log("\nUsers:", users)

    // 2. Get all role permissions in DB
    const rolePerms = await prisma.rolePermission.findMany()
    console.log("\nDB Permissions:", rolePerms)

    // 3. Simulate getting permissions for ADMIN
    // Note: We can't easily simulate session in script, but we can call the DB logic directly
    const adminPerms = await prisma.rolePermission.findUnique({
        where: { role: 'ADMIN' }
    })
    console.log("\nADMIN Permissions direct lookup:", adminPerms?.permissions)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
