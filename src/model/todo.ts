export type Todo = {
    readonly id: string;
    readonly title: string;
    readonly deadline: string | null;
    readonly completedAt: string | null;
};

export type TodoCollection = Todo[];

export type TodoIdCollection = Readonly<string[]>;
