import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { DispatchProp, connect } from 'react-redux';
import { createMoveTodoWithinDatesAction } from '../../storage/actions/factory/datesActionFactories';
import {
    parseDroppableId,
    TYPE_DATE as DROPPABLE_ID_TYPE_DATE,
} from './../../utility/dragAndDropHelpers';

type OwnProps = {
    children: JSX.Element[];
};

type ReduxSuppliedProps = {};

type CombinedProps = OwnProps & ReduxSuppliedProps & DispatchProp;

class TodoDragAndDropContext extends React.Component<CombinedProps> {
    private onDragEnd = (result: DropResult) => {
        const { dispatch } = this.props;

        const destination = result.destination;

        if (!destination) {
            return;
        }

        const oldDroppableIdData = parseDroppableId(result.source.droppableId);
        const newDroppableIdData = parseDroppableId(destination.droppableId);

        const oldIndex = result.source.index;
        const newIndex = destination.index;

        if (
            oldDroppableIdData.type === DROPPABLE_ID_TYPE_DATE &&
            newDroppableIdData.type === DROPPABLE_ID_TYPE_DATE
        ) {
            // drop todos between dates

            dispatch(
                createMoveTodoWithinDatesAction(
                    oldDroppableIdData.identifier,
                    newDroppableIdData.identifier,
                    oldIndex,
                    newIndex
                )
            );

            return;
        }
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
