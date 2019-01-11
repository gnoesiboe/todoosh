import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RootAction } from '../../storage/actions/rootAction';
import QuickTodoForm, {
    OnFormSubmittedAndValidCallback,
} from './components/QuickTodoForm';
import { createAddTodoAction } from '../../storage/actions/factory/todoActionFactories';
import { Project } from '../../model/project';

type Props = {
    project: Project;
};

type CombinedProps = Props & DispatchProp<RootAction>;

class QuickCreateTodo extends React.Component<CombinedProps> {
    private onFormSubmittedAndValid: OnFormSubmittedAndValidCallback = values => {
        const { dispatch, project } = this.props;

        dispatch(createAddTodoAction(values.title, project.id));
    };

    public render() {
        return (
            <QuickTodoForm
                onFormSubmittedAndValid={this.onFormSubmittedAndValid}
            />
        );
    }
}

export default connect()(QuickCreateTodo);
