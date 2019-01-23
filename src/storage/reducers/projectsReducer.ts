import { ProjectCollection } from '../../model/project';
import { ActionType, getType } from 'typesafe-actions';
import * as actionFactories from './../actions/factory/projectActionFactories';
import produce from 'immer';

export type ProjectAction = ActionType<typeof actionFactories>;

export type ProjectsReducerState = ProjectCollection;

export const DEFAULT_STATE: ProjectsReducerState = [];

export default (
    currentState: ProjectsReducerState = DEFAULT_STATE,
    action: ProjectAction
) => {
    switch (action.type) {
        case getType(actionFactories.createAddProjectAction): {
            const newProject = action.payload.project;

            return produce<ProjectCollection>(currentState, draft => {
                draft.push(newProject);
            });
        }

        case getType(actionFactories.createAddTodoToProjectAction): {
            const { id, todoId } = action.payload;

            return produce<ProjectCollection>(currentState, draft => {
                const project = draft.find(
                    cursorProject => cursorProject.id === id
                );

                if (!project) {
                    throw new Error(
                        'Expecting project to be available at this point'
                    );
                }

                if (!project.todos.includes(todoId)) {
                    project.todos.push(todoId);
                }
            });
        }

        case getType(actionFactories.createRemoveTodoFromProjectsAction): {
            const { todoId } = action.payload;

            return produce<ProjectCollection>(currentState, draft => {
                draft.forEach(project => {
                    if (project.todos.includes(todoId)) {
                        project.todos = project.todos.filter(
                            cursorTodoId => cursorTodoId !== todoId
                        );
                    }
                });
            });
        }
    }

    return currentState;
};
