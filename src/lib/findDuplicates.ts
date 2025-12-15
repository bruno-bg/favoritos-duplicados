import { Favorite, DuplicateGroup } from "./types";

export const findDuplicates = (favorites: Favorite[]): DuplicateGroup[] => {
    const urlMap = new Map<string, Favorite[]>();

    favorites.forEach((fav) => {
        // Normalize URL (optional: remove trailing slash, etc. but strict is safer for now)
        const url = fav.url;
        if (!urlMap.has(url)) {
            urlMap.set(url, []);
        }
        urlMap.get(url)?.push(fav);
    });

    const duplicates: DuplicateGroup[] = [];

    urlMap.forEach((favs, url) => {
        if (favs.length > 1) {
            duplicates.push({
                url,
                favorites: favs,
            });
        }
    });

    return duplicates;
};
