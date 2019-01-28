import { GlobalState } from '../../../storage/reducers';
import { Project } from '../../../model/project';
import { TodoSection } from '../../../model/TodoSection';

export function resolveProjectTodos(
    globalState: GlobalState,
    project: Project
) {
    const allTodos = globalState.todos || [];

    return project.todos.map(todoId => {
        const todo = allTodos.find(cursorTodo => cursorTodo.id === todoId);

        if (!todo) {
            throw new Error(
                `Could not find referenced todo with id: ${todoId}`
            );
        }

        return todo;
    });
}

export function resoleCurrentTodoId(globalState: GlobalState): string | null {
    return globalState.currentTodo
        ? globalState.currentTodo[TodoSection.project]
        : null;
}
