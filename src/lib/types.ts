export type Favorite = {
    id: string;
    title: string;
    url: string;
    path: string;
    addDate?: string;
    icon?: string;
    // We keep a reference to the DOM element to easily remove it later
    element?: Element;
    sourceFile?: string;
};

export type DuplicateGroup = {
    url: string;
    favorites: Favorite[];
};
