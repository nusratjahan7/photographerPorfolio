import { requireRole } from '@/lib/core/session';

export default async function AdminLayout({ children }) {
    await requireRole('admin');

    return <>{children}</>;
}