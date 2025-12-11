import { Favorite } from "./types";

export const generateFile = (doc: Document): string => {
    // Helper function to escape special characters in HTML
    const escapeHtml = (unsafe: string): string => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // Recursive function to traverse DOM and build HTML string manually
    const traverse = (node: Element, indentLevel: number): string => {
        let html = "";
        const indent = "    ".repeat(indentLevel);

        const children = Array.from(node.children);

        for (const child of children) {
            const tagName = child.tagName.toUpperCase();

            if (tagName === "DT") {
                // DT can contain H3 (Folder) or A (Bookmark)
                const h3 = child.querySelector("h3");
                const a = child.querySelector("a");
                const dl = child.querySelector("dl");

                if (h3) {
                    // It's a folder
                    const addDate = h3.getAttribute("add_date") || h3.getAttribute("ADD_DATE") || "";
                    const lastModified = h3.getAttribute("last_modified") || h3.getAttribute("LAST_MODIFIED") || "";
                    const personalToolbar = h3.getAttribute("personal_toolbar_folder") || h3.getAttribute("PERSONAL_TOOLBAR_FOLDER");

                    let attrs = `ADD_DATE="${addDate}" LAST_MODIFIED="${lastModified}"`;
                    if (personalToolbar) {
                        attrs += ` PERSONAL_TOOLBAR_FOLDER="${personalToolbar}"`;
                    }

                    html += `${indent}<DT><H3 ${attrs}>${escapeHtml(h3.textContent || "")}</H3>\n`;

                    if (dl) {
                        html += `${indent}<DL><p>\n`;
                        html += traverse(dl, indentLevel + 1);
                        html += `${indent}</DL><p>\n`;
                    }
                } else if (a) {
                    // It's a bookmark
                    const href = a.getAttribute("href") || a.getAttribute("HREF") || "";
                    const addDate = a.getAttribute("add_date") || a.getAttribute("ADD_DATE") || "";
                    const icon = a.getAttribute("icon") || a.getAttribute("ICON");

                    let attrs = `HREF="${href}" ADD_DATE="${addDate}"`;
                    if (icon) {
                        attrs += ` ICON="${icon}"`;
                    }

                    html += `${indent}<DT><A ${attrs}>${escapeHtml(a.textContent || "")}</A>\n`;
                }
            }
        }
        return html;
    };

    // Standard Header
    const header = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
`;

    // Find the root DL in the document
    const rootDl = doc.querySelector("dl");
    let bodyContent = "";

    if (rootDl) {
        bodyContent = traverse(rootDl, 1);
    } else {
        console.warn("No root DL found in document.");
    }

    return `${header}
<DL><p>
${bodyContent}
</DL><p>`;
};
