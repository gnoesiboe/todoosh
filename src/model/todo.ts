export type Todo = {
    readonly id: string;
    readonly title: string;
    readonly deadline: string | null;
    readonly isCompleted: boolean;
};

export type TodoCollection = Readonly<{
    [date: string]: Todo[];
}>;
