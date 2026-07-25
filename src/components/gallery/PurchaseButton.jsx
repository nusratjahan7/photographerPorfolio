"use client";

import { useState } from "react";
import { DollarSign, Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/lib/api/gallery";

export default function PurchaseButton({ photo, priceText }) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
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

    return (
        <button
            type="button"
            onClick={handleClick}
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
