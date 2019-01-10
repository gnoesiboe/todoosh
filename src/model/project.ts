export type Project = {
    readonly id: string;
    readonly title: string;
    readonly abbrevation: string;
};

export type ProjectCollection = Readonly<Project[]>;
