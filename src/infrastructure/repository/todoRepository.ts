import { TodoCollection, Todo } from './../../model/todo';
import { getDatabaseHandle } from './../indexedDB/databaseFactory';
import uuid from 'uuid/v4';

export type ListenerCallback = () => void;

const listeners: { [key: string]: ListenerCallback } = {};

export function addListener(callback: ListenerCallback): string {
    const key = uuid();

    listeners[key] = callback;

    return key;
}

export function removeListener(key: string): void {
    if (typeof listeners[key] !== 'undefined') {
        delete listeners[key];
    }
}

function _notifyChange() {
    Object.keys(listeners).map(key => listeners[key]());
}

export function fetchAll(): Promise<TodoCollection> {
    return getDatabaseHandle().todos.toArray();
}

export async function update(todo: Todo): Promise<number> {
    const key = await getDatabaseHandle().todos.put(todo);

    _notifyChange();

    return key;
}
