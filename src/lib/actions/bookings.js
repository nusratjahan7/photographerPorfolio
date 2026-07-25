import { protectedFetch, serverMutation } from '@/lib/core/server';

// PUBLIC — used by the booking form on the site, no auth required
export const createBooking = async (formData) => {
    return serverMutation('/api/bookings', formData, 'POST');
};

// ADMIN — used by the dashboard
export const getBookings = async () => {
    const data = await protectedFetch('/api/bookings');
    return Array.isArray(data) ? data : data?.data || [];
};

export const updateBookingStatus = async (bookingId, status) => {
    return serverMutation(`/api/bookings/${bookingId}`, { status }, 'PATCH');
};

export const deleteBooking = async (bookingId) => {
    return serverMutation(`/api/bookings/${bookingId}`, {}, 'DELETE');
};