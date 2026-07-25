'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Trash2, Search, Filter, Users, Shield, UserX, AlertTriangle } from 'lucide-react';
import { deleteUserAccount, getAdminUsers, updateUserRole } from '@/lib/actions/admin';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    // Modal States
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch all users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersList = await getAdminUsers();
            setUsers(usersList);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert(error.message || 'Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;

        const loadUsers = async () => {
            setLoading(true);
            try {
                const usersList = await getAdminUsers();
                if (active) {
                    setUsers(usersList);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                if (active) {
                    alert(error.message || 'Failed to fetch users.');
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadUsers();

        return () => {
            active = false;
        };
    }, []);

    const filteredUsers = useMemo(() => {
        let result = users;

        if (searchQuery) {
            result = result.filter(
                (u) =>
                    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (roleFilter !== 'all') {
            result = result.filter((u) => u.role === roleFilter);
        }

        return result;
    }, [searchQuery, roleFilter, users]);

    // Open confirmation modals
    const handleOpenModal = (user, type) => {
        setSelectedUser(user);
        setModalType(type);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setModalType(null);
    };


    const handleRoleChange = async (newRole) => {
        if (!selectedUser?._id) return;

        setActionLoading(true);
        try {
            const data = await updateUserRole(selectedUser._id, newRole);

            if (data?.success) {
                closeModal();
                fetchUsers();
            } else {
                alert(data?.message || 'Failed to update user role.');
            }
        } catch (error) {
            console.error('Role update error:', error);
            alert(error.message || 'Failed to update user role.');
        } finally {
            setActionLoading(false);
        }
    };

    // Delete User (DELETE /users/:id)
    const handleDeleteConfirm = async () => {
        if (!selectedUser?._id) return;

        setActionLoading(true);
        try {
            const data = await deleteUserAccount(selectedUser._id);

            if (data?.success) {
                closeModal();
                fetchUsers();
            } else {
                alert(data?.message || 'Failed to delete user.');
            }
        } catch (error) {
            console.error('Delete user error:', error);
            alert(error.message || 'Failed to delete user.');
        } finally {
            setActionLoading(false);
        }
    };

    // Counters
    const totalUsers = users.length;
    const adminCount = users.filter((u) => u.role === 'admin').length;
    const regularUserCount = totalUsers - adminCount;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black p-6 sm:p-10 font-sans text-neutral-800 dark:text-neutral-100 transition-colors">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-black dark:text-white uppercase">
                            User Management
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                            Manage registered accounts, grant administrative permissions, or revoke user access.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center space-x-4">
                        <div className="p-3 bg-black text-white dark:bg-white dark:text-black rounded-lg">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase text-neutral-400 dark:text-neutral-500">Total Users</p>
                            <p className="text-2xl font-black text-black dark:text-white">{totalUsers}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center space-x-4">
                        <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white rounded-lg">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase text-neutral-400 dark:text-neutral-500">Administrators</p>
                            <p className="text-2xl font-black text-black dark:text-white">{adminCount}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center space-x-4">
                        <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white rounded-lg">
                            <UserX className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase text-neutral-400 dark:text-neutral-500">Standard Users</p>
                            <p className="text-2xl font-black text-black dark:text-white">{regularUserCount}</p>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <Filter className="w-4 h-4 text-neutral-400 dark:text-neutral-500 hidden sm:block" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full sm:w-auto bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 text-black dark:text-white text-sm rounded-lg p-2 focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admins Only</option>
                            <option value="user">Users Only</option>
                        </select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-neutral-500 dark:text-neutral-400">Loading user accounts...</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-12 text-center text-neutral-500 dark:text-neutral-400">No users found matching your criteria.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-bold uppercase tracking-wider">
                                        <th className="py-3.5 px-5">User</th>
                                        <th className="py-3.5 px-5">Email</th>
                                        <th className="py-3.5 px-5">Role</th>
                                        <th className="py-3.5 px-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-sm">
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition">
                                            <td className="py-3 px-5 font-semibold text-black dark:text-white flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white font-bold flex items-center justify-center border border-neutral-300 dark:border-neutral-700">
                                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <span>{user.name || 'Unnamed User'}</span>
                                            </td>
                                            <td className="py-3 px-5 text-neutral-500 dark:text-neutral-400">{user.email}</td>
                                            <td className="py-3 px-5">
                                                {user.role === 'admin' ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white">
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white border border-neutral-300 dark:border-neutral-700">
                                                        User
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-5 text-right space-x-2">
                                                {user.role === 'user' ? (
                                                    <button
                                                        onClick={() => handleOpenModal(user, 'promote')}
                                                        className="inline-flex items-center p-2 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-lg transition"
                                                        title="Promote to Admin"
                                                    >
                                                        <ShieldCheck className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleOpenModal(user, 'demote')}
                                                        className="inline-flex items-center p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition"
                                                        title="Demote to Regular User"
                                                    >
                                                        <ShieldAlert className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleOpenModal(user, 'delete')}
                                                    className="inline-flex items-center p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                                                    title="Delete Account"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>

            {/* PROMOTE MODAL */}
            {modalType === 'promote' && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center space-x-3 text-black dark:text-white mb-4">
                            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold">Promote User to Admin</h3>
                        </div>

                        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                            Are you sure you want to promote <strong className="text-black dark:text-white">{selectedUser?.name || selectedUser?.email}</strong> to an <strong className="text-black dark:text-white">Admin</strong>? They will gain administrative privileges over galleries and platform settings.
                        </p>

                        <div className="flex items-center justify-end space-x-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleRoleChange('admin')}
                                disabled={actionLoading}
                                className="px-4 py-2 text-sm font-bold bg-black text-white dark:bg-white dark:text-black rounded-lg disabled:opacity-50 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition shadow-sm"
                            >
                                {actionLoading ? 'Updating...' : 'Promote to Admin'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DEMOTE MODAL */}
            {modalType === 'demote' && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center space-x-3 text-amber-600 dark:text-amber-400 mb-4">
                            <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-full">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-black dark:text-white">Demote Admin to User</h3>
                        </div>

                        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                            Are you sure you want to revoke admin rights from <strong className="text-black dark:text-white">{selectedUser?.name || selectedUser?.email}</strong>? They will be demoted to a regular user.
                        </p>

                        <div className="flex items-center justify-end space-x-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleRoleChange('user')}
                                disabled={actionLoading}
                                className="px-4 py-2 text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:opacity-50 transition shadow-sm"
                            >
                                {actionLoading ? 'Updating...' : 'Demote to User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {modalType === 'delete' && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center space-x-3 text-rose-600 dark:text-rose-400 mb-4">
                            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 rounded-full">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-black dark:text-white">Delete User Account</h3>
                        </div>

                        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                            Are you sure you want to permanently delete <strong className="text-black dark:text-white">{selectedUser?.name || selectedUser?.email}</strong>? This action cannot be undone.
                        </p>

                        <div className="flex items-center justify-end space-x-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={actionLoading}
                                className="px-4 py-2 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg disabled:opacity-50 transition shadow-sm"
                            >
                                {actionLoading ? 'Deleting...' : 'Delete User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;