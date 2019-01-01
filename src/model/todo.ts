export type Todo = {
    readonly id: string;
    readonly title: string;
    readonly isCompleted: boolean;
};

export type TodoCollection = Readonly<{
    [date: string]: Todo[];
}>;
