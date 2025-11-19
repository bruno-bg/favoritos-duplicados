"use client";

import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { DuplicateTable } from "@/components/DuplicateTable";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseBookmarks } from "@/lib/parseBookmarks";
import { findDuplicates } from "@/lib/findDuplicates";
import { generateFile } from "@/lib/generateFile";
import { mergeDocs } from "@/lib/mergeUtils";
import { dictionary, Language } from "@/lib/dictionary";
import { DuplicateGroup, Favorite } from "@/lib/types";
import { Download, Trash2, RefreshCw, ArrowRight } from "lucide-react";

export default function Home() {
  const [lang, setLang] = useState<Language>("en");
  const t = dictionary[lang];

  const [step, setStep] = useState<"upload" | "review" | "download">("upload");

  // File 1 State
  const [file1Content, setFile1Content] = useState<string | null>(null);
  const [file1Name, setFile1Name] = useState<string | null>(null);

  // File 2 State
  const [file2Content, setFile2Content] = useState<string | null>(null);
  const [file2Name, setFile2Name] = useState<string | null>(null);

  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [doc, setDoc] = useState<Document | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [allFavorites, setAllFavorites] = useState<Favorite[]>([]);

  const handleFile1Select = (content: string, name: string) => {
    setFile1Content(content);
    setFile1Name(name);
  };

  const handleFile2Select = (content: string, name: string) => {
    setFile2Content(content);
    setFile2Name(name);
  };

  const handleProcess = () => {
    if (!file1Content) return;

    let finalDoc: Document;
    let finalFavorites: Favorite[];

    const { favorites: favs1, doc: doc1 } = parseBookmarks(file1Content);
    // Tag favorites with source file
    favs1.forEach(f => f.sourceFile = file1Name || "File 1");

    if (file2Content) {
      const { favorites: favs2, doc: doc2 } = parseBookmarks(file2Content);
      // Tag favorites with source file
      favs2.forEach(f => f.sourceFile = file2Name || "File 2");

      // Merge doc2 into doc1
      finalDoc = mergeDocs(doc1, doc2);
      // Combine favorites
      finalFavorites = [...favs1, ...favs2];
    } else {
      finalDoc = doc1;
      finalFavorites = favs1;
    }

    const dups = findDuplicates(finalFavorites);

    setAllFavorites(finalFavorites);
    setDoc(finalDoc);
    setDuplicates(dups);
    setStep("review");
  };

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDelete = () => {
    if (!doc) return;

    // Remove selected elements from the DOM
    selectedIds.forEach((id) => {
      const fav = allFavorites.find((f) => f.id === id);
      if (fav && fav.element) {
        fav.element.remove();
      }
    });

    // Generate new file
    const newContent = generateFile(doc);

    // Trigger download
    const blob = new Blob([newContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookmarks_merged_cleaned.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStep("download");
  };

  const handleReset = () => {
    setStep("upload");
    setDuplicates([]);
    setDoc(null);
    setSelectedIds(new Set());
    setAllFavorites([]);
    setFile1Content(null);
    setFile1Name(null);
    setFile2Content(null);
    setFile2Name(null);
  };

  return (
    <main className="container mx-auto py-10 px-4 min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-end">
          <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground">
            {t.description}
          </p>
        </div>

        {step === "upload" && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.upload.baseTitle}</CardTitle>
                  <CardDescription>
                    {t.upload.baseDesc}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploader
                    onFileSelect={handleFile1Select}
                    label={t.upload.labelBase}
                    fileName={file1Name}
                    texts={t.upload}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.upload.mergeTitle}</CardTitle>
                  <CardDescription>
                    {t.upload.mergeDesc}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploader
                    onFileSelect={handleFile2Select}
                    label={t.upload.labelMerge}
                    fileName={file2Name}
                    texts={t.upload}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleProcess}
                disabled={!file1Content}
                className="w-full md:w-auto min-w-[200px]"
              >
                {file2Content ? t.upload.buttonMerge : t.upload.buttonProcess}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-xl font-semibold">
                {t.review.found} {duplicates.length} {t.review.groups}
                {file2Content && <span className="text-sm font-normal text-muted-foreground ml-2">{t.review.fromMerged}</span>}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t.review.startOver}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={selectedIds.size === 0}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t.review.removeSelected} ({selectedIds.size})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.review.modal.title}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.review.modal.desc.replace("{count}", selectedIds.size.toString())}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t.review.modal.cancel}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        {t.review.modal.confirm}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {duplicates.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  {t.review.noDuplicates}
                </CardContent>
              </Card>
            ) : (
              <DuplicateTable
                duplicates={duplicates}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                texts={t.review.table}
              />
            )}
          </div>
        )}

        {step === "download" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">{t.success.title}</CardTitle>
              <CardDescription>
                {t.success.desc}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="p-4 bg-green-100 rounded-full">
                <Download className="w-8 h-8 text-green-600" />
              </div>
              <p>{t.success.message}</p>
              <Button onClick={handleReset}>{t.success.processAnother}</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
