
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyAllDeletions() {
    console.log("Starting comprehensive delete verification...");

    // --- TEST 1: Contact Message ---
    console.log("\n--- TEST 1: Contact Message ---");
    const msg = await prisma.contactMessage.create({
        data: {
            name: "Auto Test",
            email: "autotest@example.com",
            message: "This message is created by the verification script.",
            subject: "Verification Subject"
        }
    });
    console.log(`[Created] Message ID: ${msg.id}`);

    try {
        await prisma.contactMessage.delete({ where: { id: msg.id } });
        console.log("[Status] Delete command executed.");
    } catch (e) {
        console.error("[Error] Failed to delete message:", e);
    }

    const checkMsg = await prisma.contactMessage.findUnique({ where: { id: msg.id } });
    if (!checkMsg) console.log("✅ SUCCESS: Message was deleted from DB.");
    else console.error("❌ FAILURE: Message still exists in DB.");


    // --- TEST 2: Feedback ---
    console.log("\n--- TEST 2: Feedback ---");
    const fb = await prisma.feedback.create({
        data: {
            content: "This feedback is created by the verification script."
        }
    });
    console.log(`[Created] Feedback ID: ${fb.id}`);

    try {
        await prisma.feedback.delete({ where: { id: fb.id } });
        console.log("[Status] Delete command executed.");
    } catch (e) {
        console.error("[Error] Failed to delete feedback:", e);
    }

    const checkFb = await prisma.feedback.findUnique({ where: { id: fb.id } });
    if (!checkFb) console.log("✅ SUCCESS: Feedback was deleted from DB.");
    else console.error("❌ FAILURE: Feedback still exists in DB.");
}

verifyAllDeletions()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
