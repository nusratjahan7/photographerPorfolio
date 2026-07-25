import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';
import { auth, getAuthDb } from '@/lib/auth';

const getSessionUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session?.user || null;
};

export async function GET() {
    try {
        const user = await getSessionUser();

        if (!user) {
            return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        if (user.role !== 'admin') {
            return Response.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }

        const db = await getAuthDb();
        const users = await db.collection('user').find({}, {
            projection: { password: 0 },
        }).toArray();

        return Response.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        return Response.json({ success: false, message: 'Failed to fetch users' }, { status: 500 });
    }
}
