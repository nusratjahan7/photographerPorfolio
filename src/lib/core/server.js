import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const baseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

export const authHeader = async () => {
    const token = await getUserToken();
    const header = token ? {
        authorization: `Bearer ${token}`
    } : {};
    return header;
}

export const serverFetch = async (path) => {
    const res = await fetch(`${baseUrl}${path}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status} for ${path}: ${text.slice(0, 200)}`);
    }

    return handleStatus(res);
};

export const protectedFetch = async (path) => {
    const res = await fetch(`${baseUrl}${path}`, {
        headers: await authHeader()
    });

    return handleStatus(res);
}

export const serverMutation = async (path, data, method = 'POST') => {
    const res = await fetch(`${baseUrl}${path}`, {
        method: method,
        headers: {
            'content-type': 'application/json',
            ... await authHeader()
        },
        body: JSON.stringify(data),
    });


    return handleStatus(res);
};

const handleStatus = async (res) => {
    if (res.status === 401) {
        redirect('/unauthorized');
    } else if (res.status === 403) {
        redirect('/forbidden');
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        const payload = await res.json().catch(() => null);
        if (!res.ok) {
            throw new Error(payload?.message || `API error ${res.status}`);
        }
        return payload;
    }

    const text = await res.text().catch(() => '');
    if (!res.ok) {
        throw new Error(text || `API error ${res.status}`);
    }
    return text;
}