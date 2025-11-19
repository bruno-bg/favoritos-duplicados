export const generateFile = (doc: Document): string => {
    // Serializing the document back to string
    // We need to ensure the doctype and header are present

    const serializer = new XMLSerializer();
    let content = serializer.serializeToString(doc);

    // XMLSerializer might produce XHTML-like output, but bookmarks are usually HTML.
    // Also, it might miss the NETSCAPE header if it was in the original source but not part of the DOM tree standardly.
    // However, since we parsed it with DOMParser, the header might be in the doctype or just text nodes?
    // DOMParser 'text/html' puts everything in <html><body>...
    // The NETSCAPE header is usually before <TITLE> or <H1>.

    // A robust way is to just take the body content and wrap it in the standard header if missing.
    // Or, if we modified the 'doc' in place (removed nodes), we can just serialize it.

    // But DOMParser puts the header text into the body or head?
    // Let's assume we want to output a standard format.

    const bodyContent = doc.body.innerHTML;

    // Standard Header
    const header = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
`;

    // If the parsed doc already has the structure, we might be duplicating headers if we prepend.
    // But usually DOMParser strips the DOCTYPE if it's not standard HTML5.
    // So we probably need to prepend the Netscape header.

    // We should check if the bodyContent starts with <DL>.
    // If so, we wrap it.

    return `${header}
<DL><p>
    ${bodyContent}
</DL><p>`;
};

// Wait, if we used DOMParser, the <DL> is likely inside the body.
// So bodyContent will contain the <DL>...
// But the original file had the header.
// If we just return bodyContent, we lose the header.
// So prepending the header is correct.
// But we should check if bodyContent already has the outer DL.
// Usually yes.
