import Dexie from 'dexie';
import { Todo } from '../../model/todo';

let databaseHandle: ApplicationDatabase | null = null;

const DATABASE_NAME = 'todoosh';

class ApplicationDatabase extends Dexie {
    // @ts-ignore -> Typescript does not seem to know that this is initialized
    public todos: Dexie.Table<Todo, number>;

    constructor() {
        super(DATABASE_NAME);

        this.version(1).stores({
            todos: '++id, title, isChecked',
        });

        this.version(2).stores({
            todos: '++id, title, isChecked, date',
        });
    }
}

export function getDatabaseHandle(): ApplicationDatabase {
    if (databaseHandle) {
        return databaseHandle;
    }

    databaseHandle = new ApplicationDatabase();

    // // @ts-ignore
    // databaseHandle.todos.put({
    //     title: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit',
    //     isChecked: false,
    //     date: '2018-12-19',
    // });

    // // @ts-ignore
    // databaseHandle.todos.put({
    //     title: 'Sollicitudin Parturient Magna Vestibulum',
    //     isChecked: true,
    //     date: '2018-12-20',
    // });

    return databaseHandle;
}
