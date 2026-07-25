'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Eye, Trash2, Search, Filter, Image as ImageIcon, DollarSign, Tag, X, Upload, AlertTriangle } from 'lucide-react';
import { deleteGalleryPhoto, getAdminGalleryPhotos, updateGalleryPhoto } from '@/lib/actions/admin';

export default function GalleryManagement() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Modal States
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        isPaid: false,
        price: 0,
        imageUrl: '',
    });

    // Fetch photos from backend
    const fetchPhotos = async () => {
        setLoading(true);
        try {
            const photosList = await getAdminGalleryPhotos();
            setPhotos(photosList);
        } catch (error) {
            console.error('Error fetching gallery:', error);
            alert(error.message || 'Failed to fetch photos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    // Filter and Search logic
    const filteredPhotos = useMemo(() => {
        let result = photos;

        if (searchQuery) {
            result = result.filter(
                (p) =>
                    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterType === 'free') {
            result = result.filter((p) => !p.isPaid);
        } else if (filterType === 'paid') {
            result = result.filter((p) => p.isPaid);
        }

        return result;
    }, [searchQuery, filterType, photos]);

    // Open Edit Modal
    const handleOpenEdit = (photo) => {
        setSelectedPhoto(photo);
        setFormData({
            title: photo.title || '',
            description: photo.description || '',
            category: photo.category || 'Other',
            isPaid: Boolean(photo.isPaid),
            price: photo.price || 0,
            imageUrl: photo.imageUrl || '',
        });
        setIsEditModalOpen(true);
    };

    // Handle Local File Upload (Convert Image File to Base64 String)
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('File size exceeds 10MB limit.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Open Delete Modal
    const handleOpenDelete = (photo) => {
        setSelectedPhoto(photo);
        setIsDeleteModalOpen(true);
    };

    // Submit Update (PUT /gallery/:id)
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPhoto?._id) return;

        setActionLoading(true);
        try {
            const data = await updateGalleryPhoto(selectedPhoto._id, formData);
            if (data?.success) {
                setIsEditModalOpen(false);
                fetchPhotos();
            } else {
                alert(data?.message || 'Failed to update photo.');
            }
        } catch (error) {
            if (isRedirectError(error)) throw error;
            console.error('Update Error:', error);
            alert(error.message || 'Failed to update photo.');
        } finally {
            setActionLoading(false);
        }
    };

    // Submit Delete (DELETE /gallery/:id)
    const handleDeleteConfirm = async () => {
        if (!selectedPhoto?._id) return;

        setActionLoading(true);
        try {
            const data = await deleteGalleryPhoto(selectedPhoto._id);

            if (data?.success) {
                setIsDeleteModalOpen(false);
                fetchPhotos();
            } else {
                alert(data?.message || 'Failed to delete photo.');
            }
        } catch (error) {
            console.error('Delete Error:', error);
            alert(error.message || 'Failed to delete photo.');
        } finally {
            setActionLoading(false);
        }
    };

    // Stats Counters
    const totalPhotos = photos.length;
    const paidPhotos = photos.filter((p) => p.isPaid).length;
    const freePhotos = totalPhotos - paidPhotos;

    return (
        <div className="min-h-screen  p-6 sm:p-10 font-sans text-neutral-800 dark:text-neutral-100 transition-colors">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Title */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-black dark:text-white uppercase">
                            Gallery Management
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                            Manage, upload, and update your gallery items and pricing details.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className=" bg-neutral-900 p-5 rounded-xl border border-neutral-800 shadow-sm flex items-center space-x-4">
                        <div className="p-3 bg-neutral-800  text-white rounded-lg">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase text-neutral-400 dark:text-neutral-500">Total Items</p>
                            <p className="text-2xl font-black text-black dark:text-white">{totalPhotos}</p>
                        </div>
                    </div>

                    <div className=" bg-neutral-900 p-5 rounded-xl border border-neutral-800 shadow-sm flex items-center space-x-4">
                        <div className="p-3 bg-neutral-800  text-white rounded-lg">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase text-neutral-500">Premium Items</p>
                            <p className="text-2xl font-black text-black dark:text-white">{paidPhotos}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center space-x-4">
                        <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white rounded-lg">
                            <Tag className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase text-neutral-400 dark:text-neutral-500">Free Items</p>
                            <p className="text-2xl font-black text-black dark:text-white">{freePhotos}</p>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search title or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <Filter className="w-4 h-4 text-neutral-400 dark:text-neutral-500 hidden sm:block" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full sm:w-auto bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 text-black dark:text-white text-sm rounded-lg p-2 focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                        >
                            <option value="all">All Access Types</option>
                            <option value="free">Free Only</option>
                            <option value="paid">Premium Only</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-neutral-500 dark:text-neutral-400">Loading items...</div>
                    ) : filteredPhotos.length === 0 ? (
                        <div className="p-12 text-center text-neutral-500 dark:text-neutral-400">No photos match your filter criteria.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-bold uppercase tracking-wider">
                                        <th className="py-3.5 px-5">Preview</th>
                                        <th className="py-3.5 px-5">Title</th>
                                        <th className="py-3.5 px-5">Category</th>
                                        <th className="py-3.5 px-5">Access</th>
                                        <th className="py-3.5 px-5">Price</th>
                                        <th className="py-3.5 px-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-sm">
                                    {filteredPhotos.map((photo) => (
                                        <tr key={photo._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition">
                                            <td className="py-3 px-5">
                                                <img
                                                    src={photo.imageUrl}
                                                    alt={photo.title}
                                                    className="w-12 h-12 rounded-lg object-cover border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-black"
                                                />
                                            </td>
                                            <td className="py-3 px-5 font-semibold text-black dark:text-white">{photo.title}</td>
                                            <td className="py-3 px-5 text-neutral-500 dark:text-neutral-400">{photo.category || 'Other'}</td>
                                            <td className="py-3 px-5">
                                                {photo.isPaid ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white">
                                                        Premium
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white border border-neutral-300 dark:border-neutral-700">
                                                        Free
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-5 font-bold text-black dark:text-white">
                                                {photo.isPaid ? `$${photo.price}` : 'Free'}
                                            </td>
                                            <td className="py-3 px-5 text-right space-x-2">
                                                <button
                                                    onClick={() => handleOpenEdit(photo)}
                                                    className="inline-flex items-center p-2 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-lg transition"
                                                    title="View / Edit Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDelete(photo)}
                                                    className="inline-flex items-center p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                                                    title="Delete"
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

            {/* EDIT / UPDATE MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-black dark:text-white">Edit Photo Details</h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-neutral-400 hover:text-black dark:hover:text-white p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">

                            {/* Image Preview Box & File Input */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                                    Photo Preview & Source
                                </label>
                                {formData.imageUrl && (
                                    <div className="mb-3 relative group w-full h-40 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-black">
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Direct File Selector */}
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl cursor-pointer bg-neutral-50 dark:bg-black hover:bg-neutral-100 dark:hover:bg-neutral-950 transition">
                                        <div className="flex flex-col items-center justify-center pt-2 pb-2">
                                            <Upload className="w-6 h-6 text-black dark:text-white mb-1" />
                                            <p className="text-xs text-neutral-700 dark:text-neutral-300 font-bold">
                                                Click to upload new photo from device
                                            </p>
                                            <p className="text-[10px] text-neutral-400">PNG, JPG, or WEBP (Max 10MB)</p>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            {/* Direct Image URL Option */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                                    Or Direct Image URL
                                </label>
                                <input
                                    type="text"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="https://example.com/photo.jpg"
                                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">Category</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">Access Type</label>
                                    <select
                                        value={formData.isPaid ? 'true' : 'false'}
                                        onChange={(e) => setFormData({ ...formData, isPaid: e.target.value === 'true' })}
                                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 text-black dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                                    >
                                        <option value="false">Free</option>
                                        <option value="true">Premium (Paid)</option>
                                    </select>
                                </div>
                            </div>

                            {formData.isPaid && (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">Price ($ USD)</label>
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                                        required
                                    />
                                </div>
                            )}

                            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-4 py-2 text-sm font-bold bg-black text-white dark:bg-white dark:text-black rounded-lg disabled:opacity-50 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition shadow-sm"
                                >
                                    {actionLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center space-x-3  text-red-400 mb-4">
                            <div className="p-3  bg-red-950/50 rounded-full">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-black dark:text-white">Confirm Deletion</h3>
                        </div>

                        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                            Are you sure you want to delete <strong className="text-black dark:text-white">{selectedPhoto?.title}</strong>? This will permanently remove the record from your database.
                        </p>

                        <div className="flex items-center justify-end space-x-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={actionLoading}
                                className="px-4 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 transition shadow-sm"
                            >
                                {actionLoading ? 'Deleting...' : 'Delete Permanently'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}