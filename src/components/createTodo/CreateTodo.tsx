import React, { Fragment } from 'react';
import { connect, DispatchProp } from 'react-redux';
import TodoFormStateHandler, {
    OnSubmitCallback,
} from './components/TodoFormStateHandler';
import { RootAction } from '../../storage/actions/rootAction';
import { createAddTodoAction } from '../../storage/actions/factory/todoActionFactories';
import { OnCancelCallback } from './components/TodoForm';
import { formatDate } from '../../utility/dateTImeHelper';
import {
    KeyboardShortcuts,
    bindKeyboardShortcut,
    unbindKeyboardShortcut,
} from '../../navigation/KeyboardShortcuts';

type Props = {
    date: Date;
};

type State = {
    showForm: boolean;
};

type CombinedProps = Props & DispatchProp<RootAction>;

class CreateTodo extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            showForm: false,
        };
    }

    public componentDidMount() {
        this.bindKeyboardShortcuts();
    }

    public componentWillUnmount() {
        this.unbindKeyboardShortcuts();
    }

    private bindKeyboardShortcuts() {
        bindKeyboardShortcut(
            KeyboardShortcuts.ADD_TODO_SHORTCUT,
            this.onAddKeyboardShortcutOccurred
        );
    }

    private onAddKeyboardShortcutOccurred = (event: Event) => {
        event.preventDefault();

        this.showForm();
    };

    private showForm() {
        this.setState(currentState => ({
            ...currentState,
            showForm: true,
        }));
    }

    private hideForm() {
        this.setState(currentState => ({
            ...currentState,
            showForm: false,
        }));
    }

    private unbindKeyboardShortcuts() {
        unbindKeyboardShortcut(KeyboardShortcuts.ADD_TODO_SHORTCUT);
    }

    private onFormSubmittedAndValid: OnSubmitCallback = values => {
        const deadline = values.deadline ? values.deadline.value : null;

        const action = createAddTodoAction(
            values.title,
            this.props.date,
            deadline ? formatDate(deadline) : null
        );

        this.props.dispatch(action);
        this.hideForm();
    };

    private onCancel: OnCancelCallback = () => {
        this.hideForm();
    };

    private renderFormIfRequired() {
        if (!this.state.showForm) {
            return null;
        }

        return (
            <TodoFormStateHandler
                onFormSubmittedAndValid={this.onFormSubmittedAndValid}
                onCancel={this.onCancel}
            />
        );
    }

    public render() {
        return <Fragment>{this.renderFormIfRequired()}</Fragment>;
    }
}

export default connect()(CreateTodo);
