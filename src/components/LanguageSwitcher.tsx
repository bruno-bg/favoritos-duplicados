import React from "react";
import { Button } from "@/components/ui/button";
import { Language } from "@/lib/dictionary";

interface LanguageSwitcherProps {
    currentLang: Language;
    onLanguageChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
    currentLang,
    onLanguageChange,
}) => {
    return (
        <div className="flex gap-2">
            <Button
                variant={currentLang === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => onLanguageChange("en")}
                className="flex items-center gap-2"
            >
                <img
                    src="https://flagcdn.com/w40/us.png"
                    srcSet="https://flagcdn.com/w80/us.png 2x"
                    width="24"
                    height="16"
                    alt="US Flag"
                    className="object-contain"
                />
                <span className="hidden sm:inline">English</span>
            </Button>
            <Button
                variant={currentLang === "pt" ? "default" : "outline"}
                size="sm"
                onClick={() => onLanguageChange("pt")}
                className="flex items-center gap-2"
            >
                <img
                    src="https://flagcdn.com/w40/br.png"
                    srcSet="https://flagcdn.com/w80/br.png 2x"
                    width="24"
                    height="16"
                    alt="Brazil Flag"
                    className="object-contain"
                />
                <span className="hidden sm:inline">Português</span>
            </Button>
        </div>
    );
};
