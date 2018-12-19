import Dexie from 'dexie';

let databaseHandle: Dexie | null = null;

const DATABASE_NAME = 'todoosh';

export function getDatabaseHandle(): Dexie {
    if (databaseHandle) {
        return databaseHandle;
    }

    databaseHandle = new Dexie(DATABASE_NAME);

    databaseHandle.version(1).stores({
        todos: '++id, title, isChecked',
    });

    databaseHandle.version(2).stores({
        todos: '++id, title, isChecked, date',
    });

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
