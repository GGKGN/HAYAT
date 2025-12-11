
import { getWishes } from "@/actions/wishes"
import WishBoard from "@/components/WishBoard"
import CreateWishModal from "@/components/CreateWishModal"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Force dynamic because we want real-time updates and it depends on session/db
export const dynamic = 'force-dynamic'

export default async function WishesPage() {
    const wishes = await getWishes()
    const session = await getServerSession(authOptions)

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Dilekler</h1>
                    {session ? (
                        <CreateWishModal userId={session.user.id} />
                    ) : (
                        <p className="text-sm text-gray-500">Dilek tutmak için giriş yapmalısınız.</p>
                    )}
                </div>
            </div>
            <main>
                <WishBoard initialWishes={wishes} />
            </main>
        </div>
    )
}
