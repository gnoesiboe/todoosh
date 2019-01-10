import { ProjectCollection } from '../../model/project';
import { ActionType, getType } from 'typesafe-actions';
import * as actionFactories from './../actions/factory/projectActionFactories';
import produce from 'immer';

export type ProjectAction = ActionType<typeof actionFactories>;

export type ProjectsReducerState = ProjectCollection;

const DEFAULT_STATE: ProjectsReducerState = [];

export default (
    currentState: ProjectsReducerState = DEFAULT_STATE,
    action: ProjectAction
) => {
    switch (action.type) {
        case getType(actionFactories.createProjectAction): {
            const newProject = action.payload.project;

            return produce<ProjectCollection>(currentState, draft => {
                draft.push(newProject);
            });
        }
    }

    return currentState;
};
