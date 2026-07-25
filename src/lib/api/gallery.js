import { serverFetch, serverMutation } from "../core/server";

export const getGallery = async () => {
    return serverFetch('/gallery');
};
export const getFeaturedGallery = async () => {
    return serverFetch('/gallery/features');
};

export const getGalleryPhoto = async (id) => {
    if (!id) return null;

    const gallery = await serverFetch('/gallery');
    const items = Array.isArray(gallery) ? gallery : gallery?.data || [];

    return items.find((photo) => String(photo._id || photo.id) === String(id)) || null;
};

export const createCheckoutSession = async (photo) => {
    if (!photo) throw new Error('No photo data provided.');

    return serverMutation('/create-checkout-session', {
        _id: photo._id || photo.id,
        title: photo.title,
        price: photo.price,
        imageUrl: photo.imageUrl,
    }, 'POST');
};