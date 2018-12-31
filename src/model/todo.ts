export type Todo = {
    readonly id: string;
    readonly title: string;
    readonly isChecked: boolean;
};

export type TodoCollection = Readonly<{
    [date: string]: Todo[];
}>;
