
import { updateUserRole, getAllUsers } from "./actions/user"
import { prisma } from "./lib/prisma"

async function main() {
    console.log("Fetching users...")
    const users = await getAllUsers()
    if (users.length === 0) {
        console.log("No users found to test.")
        return
    }

    const targetUser = users.find(u => u.email !== "ali.kagan.bayram@gmail.com") // Avoid changing self if possible
    if (!targetUser) {
        console.log("No suitable target user found.")
        return
    }

    console.log(`Targeting user: ${targetUser.name} (${targetUser.email}) - Current Role: ${targetUser.role}`)

    const newRole = targetUser.role === "ADMIN" ? "MEMBER" : "ADMIN"
    console.log(`Attempting to change role to: ${newRole}`)

    const result = await updateUserRole(targetUser.id, newRole)
    console.log("Update result:", result)

    // Verify
    const updatedUser = await prisma.user.findUnique({ where: { id: targetUser.id } })
    console.log(`Updated Role: ${updatedUser?.role}`)

    if (updatedUser?.role === newRole) {
        console.log("SUCCESS: Role updated correctly.")
        // Revert
        console.log("Reverting changes...")
        await updateUserRole(targetUser.id, targetUser.role as "ADMIN" | "MEMBER")
    } else {
        console.error("FAILURE: Role did not update.")
    }
}

main()
