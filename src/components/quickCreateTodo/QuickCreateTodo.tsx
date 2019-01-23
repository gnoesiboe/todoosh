import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RootAction } from '../../storage/actions/rootAction';
import QuickTodoForm, {
    OnFormSubmittedAndValidCallback,
} from './components/QuickTodoForm';
import { Project } from '../../model/project';
import { createAddNewTodoAction } from '../../storage/actions/factory/combinedActionsFactories';

type Props = {
    project: Project;
};

type CombinedProps = Props & DispatchProp<RootAction>;

class QuickCreateTodo extends React.Component<CombinedProps> {
    private onFormSubmittedAndValid: OnFormSubmittedAndValidCallback = values => {
        const { dispatch, project } = this.props;

        // @ts-ignore @todo fix problem where thunks are not allowed to be dispatched
        dispatch(createAddNewTodoAction(values.title, null, project.id, null));
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
