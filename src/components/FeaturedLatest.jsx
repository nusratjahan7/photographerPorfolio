
import { getFeaturedGallery } from "@/lib/api/gallery";
import FeaturedLatestClient from "./FeaturedLatestClient";


const FeaturedLatest = async () => {
    let latest = [];

    try {
        const gallery = await getFeaturedGallery();
        latest = Array.isArray(gallery) ? gallery : [];
    } catch (error) {
        console.error("Failed to load featured gallery:", error);
    }

    return <FeaturedLatestClient latest={latest} />;
};

export default FeaturedLatest;