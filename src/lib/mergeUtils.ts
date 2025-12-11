export const mergeDocs = (doc1: Document, doc2: Document): Document => {
    // We want to append the content of doc2's main DL to doc1's main DL.

    const rootDl1 = doc1.querySelector("dl");
    const rootDl2 = doc2.querySelector("dl");

    if (!rootDl1 || !rootDl2) {
        // If structure is invalid, just return doc1 (or maybe throw error?)
        // For robustness, we'll just return doc1.
        console.warn("Could not find root DL in one of the documents");
        return doc1;
    }

    // We need to import nodes from doc2 to doc1 to avoid errors
    const children2 = Array.from(rootDl2.childNodes);

    // Create a separator or folder for the second file?
    // The user request implies merging. Simply appending is the most neutral strategy.
    // We might want to add a comment or a separator?
    // Let's just append for now.

    children2.forEach((child) => {
        const importedNode = doc1.importNode(child, true);
        rootDl1.appendChild(importedNode);
    });

    return doc1;
};
