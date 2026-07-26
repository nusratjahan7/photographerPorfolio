import { getUserSession } from '@/lib/core/session';
import { getGalleryPhoto } from '@/lib/api/gallery';
import { redirect } from 'next/navigation';
import PhotoDetailsContent from '@/components/gallery/PhotoDetailsContent';

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
        <PhotoDetailsContent
            photo={photo}
            photoId={photoId}
            isFree={isFree}
            priceText={priceText}
        />
    );
};

export default PhotoDetails;