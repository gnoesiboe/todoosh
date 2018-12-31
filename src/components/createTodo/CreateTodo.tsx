import React, { Fragment } from 'react';
import { connect, DispatchProp } from 'react-redux';
import TodoFormStateHandler, {
    OnSubmitCallback,
} from './components/TodoFormStateHandler';
import mousetrap from 'mousetrap';
import { RootAction } from '../../storage/actions/rootAction';
import { createAddTodoAction } from '../../storage/actions/factory/todoActionFactories';

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
        mousetrap.bind('a', this.onAddKeyboardShortcutOccurred);
    }

    private onAddKeyboardShortcutOccurred = (event: Event) => {
        event.preventDefault();

        this.setState(currentState => ({
            ...currentState,
            showForm: true,
        }));
    };

    private unbindKeyboardShortcuts() {
        mousetrap.unbind('a');
    }

    private onFormSubmittedAndValid: OnSubmitCallback = values => {
        const action = createAddTodoAction(values.title, this.props.date);

        this.props.dispatch(action);
    };

    private renderFormIfRequired() {
        if (!this.state.showForm) {
            return null;
        }

        return (
            <TodoFormStateHandler
                onFormSubmittedAndValid={this.onFormSubmittedAndValid}
            />
        );
    }

    public render() {
        return <Fragment>{this.renderFormIfRequired()}</Fragment>;
    }
}

export default connect()(CreateTodo);
