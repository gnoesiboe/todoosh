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

            return produce<ProjectsReducerState>(currentState, draft => {
                draft.push(newProject);
            });
        }

        case getType(actionFactories.createAddTodoToProjectAction): {
            const { id, todoId } = action.payload;

            return produce<ProjectsReducerState>(currentState, draft => {
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

            return produce<ProjectsReducerState>(currentState, draft => {
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

            return produce<ProjectsReducerState>(currentState, draft => {
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

            return produce<ProjectsReducerState>(currentState, draft => {
                return draft.filter(cursorProject => {
                    return cursorProject.id !== id;
                });
            });
        }

        case getType(actionFactories.createUpdateProjectAction): {
            const { id, title, abbrevation } = action.payload;

            return produce<ProjectsReducerState>(currentState, draft => {
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

        case getType(actionFactories.createMoveTodoWithinProjectsAction): {
            const { from, to } = action.payload;

            return produce<ProjectsReducerState>(currentState, draft => {
                const fromProject = draft.find(
                    cursorProject => cursorProject.id === from.projectId
                );

                if (!fromProject) {
                    throw new Error(
                        'Cannot find project to move todo away from'
                    );
                }

                const toProject = draft.find(
                    cursorProject => cursorProject.id === to.projectId
                );

                if (!toProject) {
                    throw new Error('Cannot find project to move todo to');
                }

                // extract todo from old location
                const [todoId] = fromProject.todos.splice(from.index, 1);

                // move todo to new location
                toProject.todos.splice(to.index, 0, todoId);
            });
        }
    }

    return currentState;
};
