import AdminTabs from "@/components/admin/AdminTabs"
import { getWishes } from "@/actions/wishes"
import { getEvents } from "@/actions/events"
import { getProjects } from "@/actions/projects"
import { getReportMetadata } from "@/actions/reports"
import { getAllUsers } from "@/actions/user"
import { getContactMessages, getContactInfo } from "@/actions/contact"
import { getTeamsData } from "@/actions/teams"
import { getSupportPackages } from "@/actions/support" // Added
import { getNavSettings } from "@/actions/settings"
import { getFeedbacks } from "@/actions/feedback"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getMyPermissions } from "@/actions/permissions"

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MEMBER")) {
        redirect("/")
    }

    const wishes = await getWishes()
    const events = await getEvents()
    const projects = await getProjects()
    const reports = await getReportMetadata()
    const users = await getAllUsers()
    const messages = await getContactMessages()
    const contactInfo = await getContactInfo()
    const teamsData = await getTeamsData()
    const navSettings = await getNavSettings()
    const supportPackages = await getSupportPackages() // Added
    const feedbacks = await getFeedbacks()
    const permissions = await getMyPermissions()

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminTabs
                wishes={wishes}
                events={events}
                projects={projects}
                reports={reports}
                users={users}
                messages={messages}
                contactInfo={contactInfo}
                teamsData={teamsData}
                navSettings={navSettings}
                supportPackages={supportPackages} // Added
                feedbacks={feedbacks}
                permissions={permissions}
            />
        </div>
    )
}
