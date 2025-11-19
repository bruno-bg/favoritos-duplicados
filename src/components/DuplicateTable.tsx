import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DuplicateGroup } from "@/lib/types";

interface DuplicateTableProps {
    duplicates: DuplicateGroup[];
    selectedIds: Set<string>;
    onToggleSelect: (id: string) => void;
    texts: {
        selected: string;
        title: string;
        folder: string;
        duplicateUrl: string;
    };
}

export const DuplicateTable: React.FC<DuplicateTableProps> = ({
    duplicates,
    selectedIds,
    onToggleSelect,
    texts,
}) => {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">{texts.selected}</TableHead>
                        <TableHead>{texts.title}</TableHead>
                        <TableHead>{texts.folder}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {duplicates.map((group) => (
                        <React.Fragment key={group.url}>
                            <TableRow className="bg-muted/50">
                                <TableCell colSpan={3} className="font-medium py-2">
                                    {texts.duplicateUrl} <span className="text-blue-600 break-all">{group.url}</span>
                                </TableCell>
                            </TableRow>
                            {group.favorites.map((fav) => (
                                <TableRow key={fav.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.has(fav.id)}
                                            onCheckedChange={() => onToggleSelect(fav.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{fav.title}</TableCell>
                                    <TableCell className="text-sm">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-xs text-gray-500">{fav.sourceFile}</span>
                                            <span className="text-muted-foreground">{fav.path}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
