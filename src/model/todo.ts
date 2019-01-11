export type Todo = {
    readonly id: string;
    readonly projectId: string;
    readonly title: string;
    readonly deadline: string | null;
    readonly isCompleted: boolean;
};

export type TodoCollection = Readonly<{
    [dateOrProjectId: string]: Todo[];
}>;
