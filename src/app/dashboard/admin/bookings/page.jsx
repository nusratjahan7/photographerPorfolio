'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { CalendarDays, Mail, Phone, MapPin, Trash2, Search } from 'lucide-react';
import { getBookings, updateBookingStatus, deleteBooking } from '@/lib/actions/bookings';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];

const statusStyles = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900',
    Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900',
    Completed: 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
};

const BookingsDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [rowLoadingId, setRowLoadingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await getBookings();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            alert(error.message || 'Failed to fetch bookings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        (async () => {
            setLoading(true);
            try {
                const data = await getBookings();
                if (active) setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                if (active) alert(error.message || 'Failed to fetch bookings.');
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; };
    }, []);

    const filteredBookings = useMemo(() => {
        let result = bookings;

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (b) =>
                    b.fullName?.toLowerCase().includes(q) ||
                    b.email?.toLowerCase().includes(q) ||
                    b.phone?.toLowerCase().includes(q)
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter((b) => b.status === statusFilter);
        }

        return result;
    }, [bookings, searchQuery, statusFilter]);

    const handleStatusChange = async (bookingId, status) => {
        setRowLoadingId(bookingId);
        try {
            const data = await updateBookingStatus(bookingId, status);
            if (data?.success) {
                setBookings((prev) =>
                    prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
                );
            } else {
                alert(data?.message || 'Failed to update status.');
            }
        } catch (error) {
            console.error('Status update error:', error);
            alert(error.message || 'Failed to update status.');
        } finally {
            setRowLoadingId(null);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget?._id) return;
        setRowLoadingId(deleteTarget._id);
        try {
            const data = await deleteBooking(deleteTarget._id);
            if (data?.success) {
                setDeleteTarget(null);
                fetchBookings();
            } else {
                alert(data?.message || 'Failed to delete booking.');
            }
        } catch (error) {
            console.error('Delete booking error:', error);
            alert(error.message || 'Failed to delete booking.');
        } finally {
            setRowLoadingId(null);
        }
    };

    const pendingCount = bookings.filter((b) => b.status === 'Pending').length;

    return (
        <div className="min-h-screen bg-black rounded-2xl p-6 sm:p-10 font-sans text-neutral-800 dark:text-neutral-100 transition-colors">
            <div className="max-w-7xl mx-auto space-y-8">

                <div>
                    <h1 className="text-3xl font-black tracking-tight text-black dark:text-white uppercase">
                        Bookings
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                        {bookings.length} total request{bookings.length !== 1 ? 's' : ''}
                        {pendingCount > 0 && ` · ${pendingCount} pending`}
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-auto bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 text-black dark:text-white text-sm rounded-lg p-2 focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                    >
                        <option value="all">All Statuses</option>
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {/* List */}
                {loading ? (
                    <div className="p-12 text-center text-neutral-500 dark:text-neutral-400">Loading bookings...</div>
                ) : filteredBookings.length === 0 ? (
                    <div className="p-12 text-center text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                        No bookings found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between"
                            >
                                <div className="min-w-0 space-y-1.5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-bold text-black dark:text-white">{booking.fullName || 'Unnamed'}</p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusStyles[booking.status] || statusStyles.Pending}`}>
                                            {booking.status}
                                        </span>
                                        {booking.package && (
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                                                {booking.package}
                                            </span>
                                        )}
                                        {booking.eventType && (
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                                                {booking.eventType}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        {booking.email && (
                                            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{booking.email}</span>
                                        )}
                                        {booking.phone && (
                                            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{booking.phone}</span>
                                        )}
                                        {booking.eventDate && (
                                            <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{booking.eventDate}</span>
                                        )}
                                        {booking.location && (
                                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{booking.location}</span>
                                        )}
                                    </div>

                                    {booking.message && (
                                        <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1 line-clamp-2">
                                            {booking.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <select
                                        value={booking.status}
                                        disabled={rowLoadingId === booking._id}
                                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                                        className="bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 text-black dark:text-white text-sm rounded-lg p-2 focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none disabled:opacity-50"
                                    >
                                        {STATUS_OPTIONS.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={() => setDeleteTarget(booking)}
                                        className="inline-flex items-center p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                                        title="Delete booking"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* DELETE MODAL */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-black dark:text-white mb-3">Delete Booking</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                            Are you sure you want to permanently delete the booking from{' '}
                            <strong className="text-black dark:text-white">{deleteTarget.fullName || deleteTarget.email}</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="flex items-center justify-end space-x-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-4 py-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={rowLoadingId === deleteTarget._id}
                                className="px-4 py-2 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg disabled:opacity-50 transition"
                            >
                                {rowLoadingId === deleteTarget._id ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingsDashboard;