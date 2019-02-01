import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { DispatchProp, connect } from 'react-redux';
import { createMoveTodoAction } from '../../storage/actions/factory/combinedActionsFactories';

type OwnProps = {
    children: JSX.Element[];
};

type ReduxSuppliedProps = {};

type CombinedProps = OwnProps & ReduxSuppliedProps & DispatchProp;

class TodoDragAndDropContext extends React.Component<CombinedProps> {
    private onDragEnd = (result: DropResult) => {
        this.props.dispatch(
            // @ts-ignore @todo fix problem where thunks are not allowed to be dispatched
            createMoveTodoAction(result)
        );
    };

    public render() {
        const { children } = this.props;

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                {children}
            </DragDropContext>
        );
    }
}

const withGlobalState = connect<ReduxSuppliedProps, {}, OwnProps>(
    (): ReduxSuppliedProps => {
        return {};
    }
);

export default withGlobalState(TodoDragAndDropContext);
