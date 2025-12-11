# Prompt para Ferramenta Web de Favoritos Duplicados (Next.js + shadcn/ui)

## 🎯 Objetivo do Projeto
Construir uma aplicação web profissional em **Next.js (App Router)** utilizando **TypeScript**, **TailwindCSS** e **shadcn/ui** que:

1. Faça upload de um arquivo HTML de favoritos exportado pelo navegador.
2. Leia e extraia todos os links e caminhos completos.
3. Identifique favoritos duplicados.
4. Exiba apenas os duplicados com caminho completo.
5. Permita selecionar duplicados para exclusão.
6. Exija confirmação via modal antes de excluir.
7. Gere novo arquivo HTML limpo para importação.

---

## ⚙️ Requisitos Técnicos
- Next.js 14+ (App Router)
- React + TypeScript
- TailwindCSS
- shadcn/ui
- Parser HTML (DOMParser ou cheerio)
- Download de arquivo gerado

---

## 🧩 Fluxo Completo da Aplicação
1. **Upload do arquivo** via componente de upload.
2. **Parse do HTML** coletando:
   - título  
   - URL  
   - caminho completo  
3. **Detecção de duplicados** pela URL.
4. **Exibição dos duplicados** em tabela com shadcn/ui.
5. **Seleção para exclusão** com checkboxes.
6. **Confirmação antes de excluir** com `AlertDialog`.
7. **Geração do novo arquivo HTML** sem duplicados.
8. **Download automático** do arquivo final.

---

## 🗂️ Estrutura sugerida (App Router)
```
src/
  app/
    page.tsx
    upload/
    process/
    results/
  components/
    FileUploader.tsx
    DuplicateTable.tsx
    ConfirmDialog.tsx
  lib/
    parseBookmarks.ts
    findDuplicates.ts
    generateFile.ts
    types.ts
```

---

## 🧠 Lógica interna

### 1️⃣ parseBookmarks.ts
- Parsear `<DL><p>`
- Manter stack de pastas para calcular caminho
- Retornar lista tipada:
```ts
type Favorite = {
  id: string;
  title: string;
  url: string;
  path: string;
};
```

### 2️⃣ findDuplicates.ts
- Usar `Map<string, Favorite[]>`
- Retornar apenas URLs com mais de 1 favorito

### 3️⃣ generateFile.ts
- Recriar estrutura HTML
- Preservar pastas
- Gerar arquivo `bookmarks_cleaned.html`

---

## 🎨 Interface (shadcn/ui)
- `Button`
- `Card`
- `Table`
- `AlertDialog`
- `Checkbox`
- `Separator`
- `Tabs` (opcional)

Fluxo visual:
1. Upload  
2. Lista de duplicados  
3. Download do arquivo limpo

---

## 💬 Mensagens importantes
- Exibir caminho completo sempre.
- Exibir mensagem quando não houver duplicados.
- Confirmar antes de excluir.

Exemplo de caminho:
```
Pasta > Projetos > Desenvolvimento > Links úteis
```

---

## 🔐 Boas práticas
- Arquitetura limpa
- Código 100% tipado
- Componentes desacoplados
- Manipulação de erros robusta
- Responsividade mobile-first

---

## 🚀 Solicitação final para IA

“Com base em tudo acima, gere o código completo, estruturado e funcional em Next.js + TypeScript + shadcn/ui, criando componentes, páginas, lógica de parsing dos favoritos, detecção de duplicados, interface de seleção, modal de confirmação e geração do novo arquivo HTML conforme as especificações.”
