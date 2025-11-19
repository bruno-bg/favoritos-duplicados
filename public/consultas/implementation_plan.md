# Implementation Plan - Internationalization (i18n)

## Goal
Add support for **English (en-US)** and **Portuguese (pt-BR)** languages, allowing the user to switch between them via the UI.

## Proposed Changes

### Logic Layer
#### [NEW] [dictionary.ts](file:///d:/Projetos/favoritos-duplicados/src/lib/dictionary.ts)
-   Define a dictionary object containing all user-facing strings for both languages.
-   Export a type for the dictionary to ensure type safety.

### UI Layer
#### [NEW] [LanguageSwitcher.tsx](file:///d:/Projetos/favoritos-duplicados/src/components/LanguageSwitcher.tsx)
-   A component to toggle between "🇺🇸 EN" and "🇧🇷 PT".

#### [MODIFY] [page.tsx](file:///d:/Projetos/favoritos-duplicados/src/app/page.tsx)
-   Add state `lang` ('en' | 'pt').
-   Import the dictionary.
-   Replace hardcoded strings with `dict[lang].key`.
-   Pass translated strings to child components (`FileUploader`, `DuplicateTable`).

#### [MODIFY] [FileUploader.tsx](file:///d:/Projetos/favoritos-duplicados/src/components/FileUploader.tsx)
-   Accept `texts` prop containing the specific strings for this component.

#### [MODIFY] [DuplicateTable.tsx](file:///d:/Projetos/favoritos-duplicados/src/components/DuplicateTable.tsx)
-   Accept `texts` prop containing column headers and labels.

## Verification Plan
### Manual Verification
1.  Open the app.
2.  Verify the default language (e.g., PT or EN).
3.  Click the language switcher.
4.  Verify that all text (titles, buttons, descriptions, table headers) updates instantly.
5.  Perform a workflow (upload -> review) to ensure dynamic messages are also translated.
