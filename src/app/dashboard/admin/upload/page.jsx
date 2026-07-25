"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    UploadCloud,
    Image as ImageIcon,
    X,
    DollarSign,
    Tag,
    FileText,
    Sparkles,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { serverMutation } from "@/lib/core/server";

const CATEGORIES = [
    "Nature & Wildlife",
    "Architecture",
    "Portraits",
    "Technology",
    "Abstract & Art",
    "Travel & Events",
    "Minimalist",
    "Other",
];

export default function AdminUploadPage() {
    const router = useRouter();

    // Form States
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [accessType, setAccessType] = useState("free"); // 'free' | 'paid'
    const [price, setPrice] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle Image Drag/Drop/Select & Preview
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File size exceeds 10MB limit");
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    // Convert File to Base64 String for JSON request
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    // Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            toast.error("Please upload an image");
            return;
        }

        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        if (accessType === "paid" && (!price || parseFloat(price) <= 0)) {
            toast.error("Please enter a valid price in USD");
            return;
        }

        try {
            setIsSubmitting(true);

            // Convert image file to base64
            const base64Image = await convertBase64(imageFile);

            // Construct Payload
            const payload = {
                title: title.trim(),
                description: description.trim(),
                category,
                isPaid: accessType === "paid",
                price: accessType === "paid" ? parseFloat(price) : 0,
                imageUrl: base64Image,
            };

            // Call API using serverMutation
            const response = await serverMutation("/gallery", payload, "POST");

            toast.success("Photo uploaded successfully!");
            router.push("/dashboard/admin/gallery");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error?.message || "Failed to upload image. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <UploadCloud className="text-red-500" size={24} />
                    Upload New Photo
                </h2>
                <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                    Add high-resolution photos to your gallery and configure visibility & pricing.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Image Dropzone & Preview */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                        Photo File
                    </label>

                    {imagePreview ? (
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 group aspect-square flex items-center justify-center">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="p-3 bg-red-600/80 hover:bg-red-600 rounded-full text-white backdrop-blur-md transition-all shadow-lg"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label className="border-2 border-dashed border-neutral-700 hover:border-red-500/50 bg-neutral-950/50 hover:bg-neutral-950 rounded-2xl aspect-square flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all group">
                            <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-red-400 group-hover:scale-110 transition-all mb-3">
                                <ImageIcon size={24} />
                            </div>
                            <span className="text-sm font-semibold text-white">
                                Click to upload or drag & drop
                            </span>
                            <span className="text-xs text-neutral-500 mt-1">
                                PNG, JPG, WEBP or GIF (Max 10MB)
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                {/* Right Column - Form Meta Fields */}
                <div className="lg:col-span-7 space-y-5">
                    {/* Title Field */}
                    <div>
                        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                            Photo Title <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3.5 top-3.5 text-neutral-500" size={18} />
                            <input
                                type="text"
                                placeholder="e.g. Majestic Mountain Sunset"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-neutral-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Category Dropdown */}
                    <div>
                        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                            Category
                        </label>
                        <div className="relative">
                            <Tag className="absolute left-3.5 top-3.5 text-neutral-500" size={18} />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-neutral-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors appearance-none cursor-pointer"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat} className="bg-neutral-900 text-white">
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Pricing Access Type (Free / Paid) */}
                    <div>
                        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                            Access & Pricing
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setAccessType("free");
                                    setPrice("");
                                }}
                                className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${accessType === "free"
                                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10"
                                    : "bg-neutral-950 border-white/10 text-neutral-400 hover:text-white"
                                    }`}
                            >
                                <Sparkles size={16} />
                                Free
                            </button>

                            <button
                                type="button"
                                onClick={() => setAccessType("paid")}
                                className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${accessType === "paid"
                                    ? "bg-red-500/10 border-red-500/40 text-red-400 shadow-lg shadow-red-500/10"
                                    : "bg-neutral-950 border-white/10 text-neutral-400 hover:text-white"
                                    }`}
                            >
                                <DollarSign size={16} />
                                Paid
                            </button>
                        </div>
                    </div>

                    {/* Conditional USD Price Input */}
                    {accessType === "paid" && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                                Price (USD $) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-2.5 text-neutral-400 text-sm font-bold">
                                    $
                                </span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.99"
                                    placeholder="9.99"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full bg-neutral-950 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                                    required={accessType === "paid"}
                                />
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Provide context or details about the photo..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Uploading Image...</span>
                                </>
                            ) : (
                                <>
                                    <UploadCloud size={18} />
                                    <span>Publish Photo</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}