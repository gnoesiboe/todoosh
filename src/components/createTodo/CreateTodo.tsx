import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import TodoFormStateHandler, {
    OnSubmitCallback,
} from './components/TodoFormStateHandler';
import { RootAction } from '../../storage/actions/rootAction';
import { OnCancelCallback } from './components/TodoForm';
import {
    KeyboardShortcuts,
    bindKeyboardShortcut,
    unbindKeyboardShortcut,
} from '../../navigation/KeyboardShortcuts';
import { GlobalState } from '../../storage/reducers';
import { ProjectCollection } from '../../model/project';
import { createAddNewTodoAction } from '../../storage/actions/factory/combinedActionsFactories';
import { toast } from 'react-toastify';

type Props = {
    date: Date;
};

type State = {
    showForm: boolean;
};

type ReduxSuppliedProps = {
    projects: ProjectCollection;
};

type CombinedProps = Props & DispatchProp<RootAction> & ReduxSuppliedProps;

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
        if (this.props.projects.length === 0) {
            toast.error(
                'Adding todos is not possible if you have no project configured yet'
            );

            return;
        }

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
        const projectId = values.projectId ? values.projectId.value : null;

        if (!projectId) {
            throw new Error(
                'Expecting projectId to be available at this point'
            );
        }

        const { dispatch, date } = this.props;

        dispatch(
            // @ts-ignore @todo fix problem where thunks are not allowed to be dispatched
            createAddNewTodoAction(values.title, deadline, projectId, date)
        );

        this.hideForm();
    };

    private onCancel: OnCancelCallback = () => {
        this.hideForm();
    };

    public render() {
        if (!this.state.showForm) {
            return null;
        }

        return (
            <TodoFormStateHandler
                projects={this.props.projects}
                onFormSubmittedAndValid={this.onFormSubmittedAndValid}
                onCancel={this.onCancel}
            />
        );
    }
}

function mapGlobalStateToProps(globalState: GlobalState): ReduxSuppliedProps {
    return {
        projects: globalState.projects || [],
    };
}

export default connect(mapGlobalStateToProps)(CreateTodo);
