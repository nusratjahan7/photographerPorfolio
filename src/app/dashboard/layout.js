import AdminDashboardLayout from "@/components/dashboard/AdminDashboardLayout";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";

export default async function MainDashboardLayout({ children }) {

    const user = await getUserSession();

    if (!user) {
        redirect('/auth/signin');
    }

    return (
        <div className="pt-15">
            <AdminDashboardLayout userRole={user?.role}>
                {children}
            </AdminDashboardLayout>
        </div>
    );
}