import { TodoCollection } from './../model/todo';
import { getDatabaseHandle } from './../infrastructure/indexedDB/databaseFactory';

export async function fetchAll(): Promise<TodoCollection> {
    // @ts-ignore
    const todos = await getDatabaseHandle().todos.toArray();

    return todos;
}
