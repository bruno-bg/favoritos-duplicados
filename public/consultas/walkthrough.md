# Walkthrough - Duplicate Bookmarks Merger & Cleaner

I have successfully updated the Duplicate Bookmarks Cleaner application to support merging two bookmark files, enhanced the comparison interface, and added **Internationalization (i18n)** support for English (US) and Portuguese (BR).

## Features Implemented

1.  **Internationalization (i18n)**:
    -   **Language Switcher**: Buttons with flags (🇺🇸 EN / 🇧🇷 PT) to toggle languages instantly.
    -   **Full Translation**: All interface text, including buttons, labels, instructions, and success messages, is fully translated.
2.  **Two-File Upload**: Users can now upload a "Base File" and an optional "Merge File".
3.  **Merging Logic**: The app merges the DOM tree of the second file into the first one, preserving all folders and links.
4.  **Parsing Logic**: The app parses the HTML, extracting folders, titles, and URLs, while maintaining the folder structure path.
5.  **Duplicate Detection**: It identifies URLs that appear more than once across the merged set.
6.  **Enhanced Review Interface**:
    -   **Selected**: Checkbox to mark for deletion.
    -   **Title**: The name of the bookmark.
    -   **Folder**: Shows both the **Source File** and the **Full Path** to help users decide which one to keep.
7.  **Selection & Deletion**: Users can select specific duplicates to remove.
8.  **Safe Deletion**: A confirmation modal prevents accidental deletions.
9.  **File Generation**: The app generates a single merged and cleaned HTML file.

## Technical Details

-   **Framework**: Next.js 14+ (App Router)
-   **Styling**: TailwindCSS
-   **UI Components**: shadcn/ui (Card, Button, Table, AlertDialog, Checkbox)
-   **Logic**:
    -   `dictionary.ts`: Contains the translation strings for 'en' and 'pt'.
    -   `LanguageSwitcher.tsx`: Component to toggle the language state.
    -   `parseBookmarks.ts`: Uses `DOMParser` to traverse the bookmark tree.
    -   `mergeUtils.ts`: Appends the content of the second file to the first.
    -   `findDuplicates.ts`: Maps URLs to find collisions.
    -   `generateFile.ts`: Reconstructs the valid Netscape Bookmark file format.

## Verification

-   Ran `npm run build` successfully.
-   Type checking passed.
-   Linting passed.
-   **Browser Import Verification**: Confirmed that the generated file is correctly imported by Chrome, Edge, and Firefox after fixing the Netscape format quirks (specifically ensuring `<DL><p>` structure).

## Critical Fixes

-   **Netscape Format Compliance**: The `generateFile.ts` logic was rewritten to manually build the HTML string instead of using `XMLSerializer`. This was necessary because browsers strictly require `<DL>` tags to be immediately followed by `<p>` tags (a quirk of the Netscape format), which standard DOM parsers often strip out. The new logic ensures this structure is preserved for successful import.

## How to Run

1.  `npm install` (already done)
2.  `npm run dev`
3.  Open `http://localhost:3000`
