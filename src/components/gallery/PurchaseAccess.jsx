"use client";

import { useEffect, useMemo, useState } from "react";
import { DollarSign, Download, Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/lib/api/gallery";
import { getPurchasedPhotoIds } from "@/lib/gallery/purchase-state";

export default function PurchaseAccess({ photo, priceText }) {
    const [loading, setLoading] = useState(false);
    const photoId = String(photo?._id || photo?.id || "");
    const purchasedIds = useMemo(() => getPurchasedPhotoIds(), []);
    const isUnlocked = useMemo(() => purchasedIds.includes(photoId), [purchasedIds, photoId]);

    const handleCheckout = async () => {
        try {
            setLoading(true);
            const checkout = await createCheckoutSession(photo);

            if (checkout?.url) {
                window.location.assign(checkout.url);
                return;
            }

            throw new Error("No checkout URL returned from the server.");
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Unable to start checkout right now. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (isUnlocked) {
        const fileName = (photo?.title || "photo").replace(/[^a-z0-9._-]+/gi, "_").toLowerCase();

        return (
            <a
                href={photo.imageUrl}
                download={fileName}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
            >
                <Download size={16} />
                Download photo
            </a>
        );
    }

    return (
        <button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
            {loading ? (
                <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating checkout...
                </>
            ) : (
                <>
                    <DollarSign size={16} />
                    Pay ${priceText} to unlock
                </>
            )}
        </button>
    );
}
