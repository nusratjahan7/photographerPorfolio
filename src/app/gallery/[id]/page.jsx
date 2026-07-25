import { getUserSession } from '@/lib/core/session';
import { getGalleryPhoto } from '@/lib/api/gallery';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import PurchaseAccess from '@/components/gallery/PurchaseAccess';

const PhotoDetails = async ({ params }) => {
    const { id } = await params;

    const session = await getUserSession();
    if (!session) {
        redirect(`/auth/login?callbackUrl=/gallery/${id}`);
    }

    const photo = await getGalleryPhoto(id);

    if (!photo) {
        redirect('/gallery');
    }

    const photoId = photo._id || photo.id;
    const isFree = !photo.isPaid;
    const priceText = Number(photo.price || 0).toFixed(2);

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 pt-24 sm:px-6 lg:px-8">
                <Link
                    href="/gallery"
                    className="flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Back to gallery
                </Link>

                <div className="grid gap-8 rounded-3xl border border-white/10 bg-neutral-900/60 p-6 shadow-2xl shadow-black/30 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
                        <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                                    {photo.category || 'Gallery'}
                                </span>
                                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${isFree ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/30 bg-amber-500/10 text-amber-400'}`}>
                                    {isFree ? 'Free access' : 'Premium'}
                                </span>
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-white">{photo.title}</h1>
                                <p className="mt-3 text-sm leading-7 text-neutral-400">
                                    {photo.description || 'A carefully curated photography piece from the gallery collection.'}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <div className="flex items-center justify-between text-sm text-neutral-400">
                                    <span>Price</span>
                                    <span className="font-semibold text-white">
                                        {isFree ? '$0.00' : `$${priceText}`}
                                    </span>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-sm text-neutral-400">
                                    <ShieldCheck size={16} className="text-red-400" />
                                    Secure checkout and instant access after purchase.
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {isFree ? (
                                <a
                                    href={photo.imageUrl}
                                    download={(photo.title || 'photo').replace(/[^a-z0-9._-]+/gi, '_').toLowerCase()}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                                >
                                    Download photo
                                </a>
                            ) : (
                                <PurchaseAccess photo={photo} priceText={priceText} />
                            )}

                            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-400">
                                <Sparkles size={16} className="text-red-400" />
                                {isFree ? 'This photo is free to download.' : 'This photo requires a one-time purchase.'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoDetails;