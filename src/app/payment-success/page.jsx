"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

const STORAGE_KEY = "purchasedPhotos";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const photoId = searchParams.get("photoId") || searchParams.get("eventId");

        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            const purchased = saved ? JSON.parse(saved) : [];

            if (!purchased.includes(photoId)) {
                purchased.push(photoId);
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(purchased));
            }
        } catch (error) {
            console.error("Failed to save purchase state:", error);
        }

        if (photoId) {
            router.replace(`/gallery/${photoId}`);
        } else {
            router.replace("/gallery");
        }
    }, [router, searchParams]);

    return (
        <main className="min-h-screen bg-neutral-950 px-6 py-24 text-white">
            <div className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-white/10 bg-neutral-900/70 p-10 text-center shadow-2xl shadow-black/50">
                <CheckCircle2 className="mb-4 h-16 w-16 text-emerald-400" />
                <h1 className="text-3xl font-bold">Payment successful</h1>
                <p className="mt-3 text-sm leading-7 text-neutral-400">
                    Your purchase is complete. You can now download this photo anytime from the gallery page.
                </p>

                <Link
                    href="/gallery"
                    className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                    Go to gallery
                    <ArrowRight size={16} />
                </Link>
            </div>
        </main>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<main className="min-h-screen bg-neutral-950 px-6 py-24 text-white" />}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
