import { Favorite } from "./types";

export const parseBookmarks = (htmlContent: string): { favorites: Favorite[]; doc: Document } => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const favorites: Favorite[] = [];

    const traverse = (element: Element, path: string[]) => {
        const children = Array.from(element.children);

        for (const child of children) {
            if (child.tagName === "DT") {
                const a = child.querySelector("a");
                const h3 = child.querySelector("h3");
                const dl = child.querySelector("dl");

                if (a) {
                    // It's a bookmark
                    favorites.push({
                        id: Math.random().toString(36).substr(2, 9),
                        title: a.textContent || "",
                        url: a.getAttribute("href") || "",
                        path: path.join(" > "),
                        addDate: a.getAttribute("add_date") || undefined,
                        icon: a.getAttribute("icon") || undefined,
                        element: child, // Store the DT element to remove it later (contains the A)
                    });
                } else if (h3) {
                    // It's a folder
                    const folderName = h3.textContent || "";
                    // The DL containing the items usually follows the H3 or is inside the DT?
                    // In Netscape format: <DT><H3>Folder</H3><DL>...</DL>
                    // But sometimes the DL is a sibling of DT?
                    // Standard is: DT contains H3, and immediately followed by DL (which is inside the DT? No, usually DL is sibling of H3 inside DT, or DL is sibling of DT?)
                    // Actually, in many exports:
                    // <DT><H3>Folder</H3>
                    // <DL><p>
                    //   ... items ...
                    // </DL><p>
                    // So the DL is a *sibling* of the H3, but often nested in the DT?
                    // Let's check the structure.
                    // Chrome export:
                    // <DT><H3 ...>Folder</H3>
                    // <DL><p> ... </DL><p>
                    // The DL is a sibling of H3, but both are children of the parent DL?
                    // Wait, no.
                    // <DL>
                    //   <DT><H3>Folder</H3>
                    //   <DL> ... </DL>
                    // </DL>
                    // So the inner DL is a sibling of the DT? Or inside the DT?
                    // In Chrome: The inner DL is a SIBLING of the DT that contains the H3?
                    // Actually, let's look for the DL that follows the H3.

                    // If the structure is <DT><H3>...</H3><DL>...</DL>, then DL is inside DT.
                    // If the structure is <DT><H3>...</H3></DT><DL>...</DL>, then DL is sibling.

                    // To be safe, we can look for the DL.
                    // If child (DT) has a DL child, traverse it.
                    let nextDl = child.querySelector("dl");
                    if (!nextDl) {
                        // Sometimes it's the next sibling element?
                        if (child.nextElementSibling && child.nextElementSibling.tagName === "DL") {
                            nextDl = child.nextElementSibling as HTMLDListElement;
                        }
                    }

                    if (nextDl) {
                        traverse(nextDl, [...path, folderName]);
                    }
                }
            } else if (child.tagName === "DL") {
                // Sometimes DL is direct child of another DL (rare but possible)
                traverse(child, path);
            }
        }
    };

    // Start traversing from the body or the first DL
    const rootDl = doc.querySelector("dl");
    if (rootDl) {
        traverse(rootDl, []);
    } else {
        // Fallback: try body
        traverse(doc.body, []);
    }

    return { favorites, doc };
};
