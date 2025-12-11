import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getReports, getTags } from "@/actions/reports"
import ReportsView from "@/components/ReportsView"

export default async function ReportsPage() {
    const session = await auth()

    // Check if user is logged in
    if (!session?.user) {
        redirect("/api/auth/signin")
    }

    // Check if user is a team member
    // Note: session.user.isTeamMember might not be strictly typed yet if types weren't updated
    // but the runtime value should be there.
    if (!(session.user as any).isTeamMember) {
        // Redirect non-team members to home or show error
        redirect("/")
    }

    const tags = await getTags()
    const reports = await getReports()

    return (
        <div className="min-h-screen bg-gray-50 pt-36 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Raporlar</h1>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-3xl">
                        Takım içi bilgi paylaşımı ve raporlama merkezi.
                    </p>
                </div>

                <ReportsView tags={tags} reports={reports} user={session.user} />
            </div>
        </div>
    )
}
