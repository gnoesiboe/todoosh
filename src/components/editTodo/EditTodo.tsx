import React from 'react';
import TodoFormStateHandler, {
    OnSubmitCallback,
} from './../createTodo/components/TodoFormStateHandler';
import { Todo } from '../../model/todo';
import { connect, DispatchProp } from 'react-redux';
import { RootAction } from '../../storage/actions/rootAction';
import { OnCancelCallback } from '../createTodo/components/TodoForm';
import { ProjectCollection } from '../../model/project';
import { GlobalState } from '../../storage/reducers';
import { createUpdateTodoAction } from '../../storage/actions/factory/combinedActionsFactories';
import { parseDate } from '../../utility/dateTimeHelper';

type Props = {
    todo: Todo;
    date?: Date;
    onCancel: OnCancelCallback;
};

type ReduxSuppliedProps = {
    projects: ProjectCollection;
};

type CombinedProps = Props & DispatchProp<RootAction> & ReduxSuppliedProps;

class EditTodo extends React.Component<CombinedProps> {
    private onFormSubmittedAndValid: OnSubmitCallback = values => {
        const { todo, dispatch, date, onCancel } = this.props;

        const deadline = values.deadline ? values.deadline.value : null;
        const projectId = values.projectId ? values.projectId.value : null;

        if (!projectId) {
            throw new Error(
                'Expecting projectId to be available at this point'
            );
        }

        dispatch(
            // @ts-ignore @todo fix problem where thunks are not allowed to be dispatched
            createUpdateTodoAction(
                todo.id,
                projectId,
                date || null,
                values.title,
                deadline || null,
                todo.completedAt ? parseDate(todo.completedAt) : null
            )
        );
        onCancel();
    };

    public render() {
        const { todo, onCancel, projects } = this.props;

        return (
            <TodoFormStateHandler
                projects={projects}
                onFormSubmittedAndValid={this.onFormSubmittedAndValid}
                onCancel={onCancel}
                todo={todo}
            />
        );
    }
}

function mapGlobalStateToProps(globalState: GlobalState): ReduxSuppliedProps {
    return {
        projects: globalState.projects || [],
    };
}

export default connect<ReduxSuppliedProps, {}, Props>(mapGlobalStateToProps)(
    EditTodo
);
