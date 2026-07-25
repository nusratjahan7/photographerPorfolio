
import { getGallery } from "@/lib/api/gallery";
import FeaturedLatestClient from "./FeaturedLatestClient";


const FeaturedLatest = async () => {
    let latest = [];

    try {
        const gallery = await getGallery();

        latest = Array.isArray(gallery)
            ? gallery.slice(0, 4)
            : [];

    } catch (error) {
        console.error("Failed to load featured gallery:", error);
    }

    return <FeaturedLatestClient latest={latest} />;
};

export default FeaturedLatest;