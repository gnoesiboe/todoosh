export type Todo = {
    readonly id: string;
    readonly title: string;
    readonly isChecked: boolean;
    readonly date: string;
};

export type TodoCollection = Readonly<Todo[]>;
