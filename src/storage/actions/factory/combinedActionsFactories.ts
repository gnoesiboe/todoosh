import { ThunkResult } from './../thunkAction';
import uuid from 'uuid/v4';
import {
    createAddTodoAction,
    createDeleteTodoAction,
} from './todoActionFactories';
import { formatDate } from '../../../utility/dateTimeHelper';
import {
    createAddTodoToDateAction,
    createRemoveTodoFromDatesAction,
} from './datesActionFactories';
import {
    createAddTodoToProjectAction,
    createRemoveTodoFromProjectsAction,
    createMoveTodoToOtherProjectAction,
    createDeleteProjectAction,
} from './projectActionFactories';
import { TodoSection } from '../../../model/TodoSection';
import { DEFAULT_STATE as DEFAULT_DATES_REDUCER_STATE } from '../../reducers/datesReducer';
import { createSetCurrentTodoAction } from './currentTodoActionFactories';
import {
    determinePrevousIndex,
    determineNextIndex,
} from '../../../utility/arrayIndexNavigationHelper';
import { createUpdateTodoAction as createUpdateOnlyTodoAction } from './todoActionFactories';
import { Todo } from '../../../model/todo';
import { DEFAULT_STATE as DEFAULT_PROJECTS_REDUCER_STATE } from '../../reducers/projectsReducer';
import { toast } from 'react-toastify';

export function createAddNewTodoAction(
    title: string,
    deadline: Date | null,
    projectId: string,
    date: Date | null
): ThunkResult<void> {
    return dispatch => {
        const id = uuid();

        const todo = {
            id,
            title,
            deadline: deadline ? formatDate(deadline) : null,
            completedAt: null,
        };

        // first create todo
        dispatch(createAddTodoAction(todo));
        dispatch(createAddTodoToProjectAction(projectId, id));

        if (date) {
            dispatch(createAddTodoToDateAction(date, id));
        }
    };
}

export function createUpdateTodoAction(
    id: string,
    newProjectId: string,
    newDate: Date | null,
    title: string,
    deadline: Date | null,
    completedAt: Date | null
): ThunkResult<void> {
    return (dispatch, getState) => {
        const globalState = getState();

        const allProjects =
            globalState.projects || DEFAULT_PROJECTS_REDUCER_STATE;
        const currentProject = allProjects.find(cursorProject =>
            cursorProject.todos.includes(id)
        );

        if (!currentProject) {
            throw new Error('Could not find the current project for todo');
        }

        const allDates = globalState.dates || DEFAULT_DATES_REDUCER_STATE;
        const currentDateAsString = Object.keys(allDates).find(dateAsString =>
            allDates[dateAsString].includes(id)
        );

        if (!currentDateAsString) {
            throw new Error('Could not find the current date for todo');
        }

        const updatedTodo: Todo = {
            id,
            title,
            deadline: deadline ? formatDate(deadline) : null,
            completedAt: completedAt ? formatDate(completedAt) : null,
        };

        dispatch(createUpdateOnlyTodoAction(updatedTodo));

        if (currentProject.id !== newProjectId) {
            dispatch(
                createMoveTodoToOtherProjectAction(
                    id,
                    currentProject.id,
                    newProjectId
                )
            );
        }

        const newDateAsString = newDate ? formatDate(newDate) : null;

        if (currentDateAsString !== newDateAsString) {
            if (currentDateAsString) {
                // Remove todo from old date
                dispatch(createRemoveTodoFromDatesAction(id));
            }

            if (newDate) {
                // Add todo to new date
                dispatch(createAddTodoToDateAction(newDate, id));
            }
        }
    };
}

export function createRemoveTodoAction(id: string): ThunkResult<void> {
    return dispatch => {
        dispatch(createDeleteTodoAction(id));
        dispatch(createRemoveTodoFromProjectsAction(id));
        dispatch(createRemoveTodoFromDatesAction(id));
    };
}

export function createSelectNextDateTodoAction(): ThunkResult<void> {
    return (dispatch, getState) => {
        const globalState = getState();
        const dates = globalState.dates || DEFAULT_DATES_REDUCER_STATE;
        const dateKeys = Object.keys(dates);

        if (dateKeys.length === 0) {
            return;
        }

        const currentTodoId = globalState.currentTodo
            ? globalState.currentTodo[TodoSection.date]
            : null;

        if (currentTodoId) {
            for (const dateAsString in dates) {
                if (!dates.hasOwnProperty(dateAsString)) {
                    continue;
                }

                const todoIdsForDate = dates[dateAsString];
                const currentTodoIndex = todoIdsForDate.findIndex(
                    cursorTodoId => cursorTodoId === currentTodoId
                );
                const nextTodoIndex = determineNextIndex(
                    currentTodoIndex,
                    todoIdsForDate.length
                );
                const nextTodoId = todoIdsForDate[nextTodoIndex];

                if (currentTodoIndex !== -1) {
                    dispatch(
                        createSetCurrentTodoAction(nextTodoId, TodoSection.date)
                    );

                    break;
                }
            }
        } else {
            for (const dateAsString in dates) {
                if (!dates.hasOwnProperty(dateAsString)) {
                    continue;
                }

                const todoIdsForDate = dates[dateAsString];

                if (todoIdsForDate.length > 0) {
                    dispatch(
                        createSetCurrentTodoAction(
                            todoIdsForDate[0],
                            TodoSection.date
                        )
                    );

                    break;
                }
            }
        }
    };
}

export function createSelectPreviousDateTodoAction(): ThunkResult<void> {
    return (dispatch, getState) => {
        const globalState = getState();
        const dates = globalState.dates || DEFAULT_DATES_REDUCER_STATE;
        const dateKeys = Object.keys(dates);

        if (dateKeys.length === 0) {
            return;
        }

        const currentTodoId = globalState.currentTodo
            ? globalState.currentTodo[TodoSection.date]
            : null;

        if (currentTodoId) {
            for (const dateAsString in dates) {
                if (!dates.hasOwnProperty(dateAsString)) {
                    continue;
                }

                const todoIdsForDate = dates[dateAsString];
                const currentTodoIndex = todoIdsForDate.findIndex(
                    cursorTodoId => cursorTodoId === currentTodoId
                );
                const nextTodoIndex = determinePrevousIndex(
                    currentTodoIndex,
                    todoIdsForDate.length
                );
                const nextTodoId = todoIdsForDate[nextTodoIndex];

                if (currentTodoIndex !== -1) {
                    dispatch(
                        createSetCurrentTodoAction(nextTodoId, TodoSection.date)
                    );

                    break;
                }
            }
        } else {
            for (const dateAsString in dates) {
                if (!dates.hasOwnProperty(dateAsString)) {
                    continue;
                }

                const todoIdsForDate = dates[dateAsString];

                if (todoIdsForDate.length > 0) {
                    dispatch(
                        createSetCurrentTodoAction(
                            todoIdsForDate[0],
                            TodoSection.date
                        )
                    );

                    break;
                }
            }
        }
    };
}

export function createRemoveProjectAction(
    projectId: string
): ThunkResult<void> {
    return (dispatch, getState) => {
        const globalState = getState();

        const projects = globalState.projects || [];
        const project = projects.find(
            cursorProject => cursorProject.id === projectId
        );

        if (!project) {
            throw new Error('Could not find project to be deleted');
        }

        if (project.todos.length > 0) {
            toast.error(
                'You have to first remove all todos in this project before you are allowed to delete it'
            );

            return;
        }

        dispatch(createDeleteProjectAction(projectId));
    };
}
