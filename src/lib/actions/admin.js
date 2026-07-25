import { protectedFetch, serverFetch, serverMutation } from '@/lib/core/server';

export const getAdminUsers = async () => {
    const data = await protectedFetch('/users');
    return Array.isArray(data) ? data : data?.data || [];
};

export const updateUserRole = async (userId, role) => {
    return serverMutation(`/users/${userId}/role`, { role }, 'PATCH');
};

export const deleteUserAccount = async (userId) => {
    return serverMutation(`/users/${userId}`, {}, 'DELETE');
};

export const getAdminGalleryPhotos = async () => {
    const data = await serverFetch('/gallery');
    return Array.isArray(data) ? data : data?.data || [];
};

export const updateGalleryPhoto = async (photoId, payload) => {
    return serverMutation(`/gallery/${photoId}`, payload, 'PUT');
};

export const deleteGalleryPhoto = async (photoId) => {
    return serverMutation(`/gallery/${photoId}`, {}, 'DELETE');
};
