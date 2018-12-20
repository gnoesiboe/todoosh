import { TodoCollection, Todo } from './../../model/todo';
import { getDatabaseHandle } from './../indexedDB/databaseFactory';
import SimpleChangeObserver from './../../utility/simpleChangeObserver';

export const changeObserver = new SimpleChangeObserver();

export function fetchAll(): Promise<TodoCollection> {
    return getDatabaseHandle().todos.toArray();
}

export async function update(todo: Todo): Promise<number> {
    const key = await getDatabaseHandle().todos.put(todo);

    changeObserver.notifyChange();

    return key;
}
