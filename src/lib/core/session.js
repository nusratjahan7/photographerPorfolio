"use server"
import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "../auth";
import { redirect } from "next/navigation";


const getCachedSession = cache(async () => {
    return auth.api.getSession({
        headers: await headers()
    });
});

export const getUserSession = async () => {
    const session = await getCachedSession();
    return session?.user || null;
};

export const getUserToken = async () => {
    const session = await getCachedSession();
    return session?.session?.token || null;
};

export const requireRole = async (role) => {
    const user = await getUserSession();
    if (!user) {
        redirect('/auth/login');
    }
    if (user.role !== role) {
        redirect('/unauthorized');
    }
    return user;
};