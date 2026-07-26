const STORAGE_KEY = "purchasedPhotos";

export function getPurchasedPhotoIds() {
    if (typeof window === "undefined") return [];

    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        const purchased = saved ? JSON.parse(saved) : [];
        return Array.isArray(purchased) ? purchased : [];
    } catch (error) {
        console.error("Failed to read purchase state:", error);
        return [];
    }
}

export function isPhotoPurchased(photoId) {
    if (!photoId) return false;
    return getPurchasedPhotoIds().includes(String(photoId));
}

export function savePurchasedPhotoId(photoId) {
    if (!photoId || typeof window === "undefined") return false;

    try {
        const purchased = getPurchasedPhotoIds();
        const normalizedId = String(photoId);

        if (!purchased.includes(normalizedId)) {
            purchased.push(normalizedId);
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(purchased));
        }

        return true;
    } catch (error) {
        console.error("Failed to save purchase state:", error);
        return false;
    }
}
