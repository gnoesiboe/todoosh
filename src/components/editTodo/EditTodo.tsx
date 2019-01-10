import React from 'react';
import TodoFormStateHandler, {
    OnSubmitCallback,
} from './../createTodo/components/TodoFormStateHandler';
import { Todo } from '../../model/todo';
import { connect, DispatchProp } from 'react-redux';
import { RootAction } from '../../storage/actions/rootAction';
import { createUpdateTodoAction } from '../../storage/actions/factory/todoActionFactories';
import { formatDate } from '../../utility/dateTimeHelper';
import { OnCancelCallback } from '../createTodo/components/TodoForm';

type Props = {
    todo: Todo;
    date: Date;
    onCancel: OnCancelCallback;
};

type CombinedProps = Props & DispatchProp<RootAction>;

class EditTodo extends React.Component<CombinedProps> {
    private onFormSubmittedAndValid: OnSubmitCallback = values => {
        const { todo, dispatch, date, onCancel } = this.props;

        const deadline = values.deadline ? values.deadline.value : null;

        const action = createUpdateTodoAction(
            todo.id,
            formatDate(date),
            values.title,
            deadline ? formatDate(deadline) : null
        );

        dispatch(action);
        onCancel();
    };

    public render() {
        const { todo, onCancel } = this.props;

        return (
            <TodoFormStateHandler
                onFormSubmittedAndValid={this.onFormSubmittedAndValid}
                onCancel={onCancel}
                todo={todo}
            />
        );
    }
}

export default connect()(EditTodo);
