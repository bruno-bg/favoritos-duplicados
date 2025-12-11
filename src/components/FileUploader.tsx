import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploaderProps {
    onFileSelect: (content: string, fileName: string) => void;
    label?: string;
    fileName?: string | null;
    texts: {
        select: string;
        change: string;
        instruction: string;
    };
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, label, fileName, texts }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            onFileSelect(content, file.name);
        };
        reader.readAsText(file);
    };

    return (
        <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{label}</h3>
            <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
                {fileName ? (
                    <span className="font-medium text-blue-600">{fileName}</span>
                ) : (
                    texts.instruction
                )}
            </p>
            <input
                type="file"
                accept=".html"
                className="hidden"
                ref={inputRef}
                onChange={handleChange}
            />
            <Button onClick={() => inputRef.current?.click()}>
                {fileName ? texts.change : texts.select}
            </Button>
        </div>
    );
};
