import { TodoIdCollection } from './todo';

export type Project = {
    readonly id: string;
    readonly title: string;
    readonly abbrevation: string;
    readonly todos: TodoIdCollection;
};

export type ProjectCollection = Readonly<Project[]>;
