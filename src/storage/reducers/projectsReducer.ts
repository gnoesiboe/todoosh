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

        case getType(actionFactories.createMoveTodoToOtherProjectAction): {
            const { todoId, oldProjectId, newProjectId } = action.payload;

            return produce<ProjectCollection>(currentState, draft => {
                draft.forEach(project => {
                    if (project.id === oldProjectId) {
                        project.todos = project.todos.filter(
                            cursorTodoId => cursorTodoId !== todoId
                        );
                    }

                    if (project.id === newProjectId) {
                        project.todos.push(todoId);
                    }
                });
            });
        }

        case getType(actionFactories.createDeleteProjectAction): {
            const { id } = action.payload;

            return produce<ProjectCollection>(currentState, draft => {
                return draft.filter(cursorProject => {
                    return cursorProject.id !== id;
                });
            });
        }

        case getType(actionFactories.createUpdateProjectAction): {
            const { id, title, abbrevation } = action.payload;

            return produce<ProjectCollection>(currentState, draft => {
                const project = draft.find(
                    cursorProject => cursorProject.id === id
                );

                if (!project) {
                    return;
                }

                project.title = title;
                project.abbrevation = abbrevation;
            });
        }
    }

    return currentState;
};
