import { Todo } from './../todo';

export function modifyTodo<NF>(todo: Todo, field: string, newValue: NF): Todo {
    return {
        ...todo,
        [field]: newValue,
    };
}
