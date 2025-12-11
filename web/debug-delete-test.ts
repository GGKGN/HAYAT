
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDelete() {
    console.log("Starting delete test...");

    // 1. Create a dummy message
    console.log("Creating dummy message...");
    const msg = await prisma.contactMessage.create({
        data: {
            name: "Test Delete",
            email: "test@delete.com",
            message: "This is a test message to be deleted",
            subject: "Test Subject"
        }
    });
    console.log("Created message with ID:", msg.id);

    // 2. Try to delete it
    console.log("Attempting to delete message...");
    try {
        await prisma.contactMessage.delete({
            where: { id: msg.id }
        });
        console.log("SUCCESS: Message deleted.");
    } catch (e) {
        console.error("FAILURE: Could not delete message.", e);
    }

    // 3. Verify it's gone
    const check = await prisma.contactMessage.findUnique({
        where: { id: msg.id }
    });

    if (!check) {
        console.log("VERIFIED: Message is gone from DB.");
    } else {
        console.error("CRITICAL: Message still exists in DB!");
    }
}

testDelete()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
