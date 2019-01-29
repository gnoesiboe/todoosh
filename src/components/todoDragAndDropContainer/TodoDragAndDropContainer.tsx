import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { DispatchProp, connect } from 'react-redux';
import { createMoveTodoWithinDatesAction } from '../../storage/actions/factory/datesActionFactories';
import {
    parseDroppableId,
    TYPE_DATE as DROPPABLE_ID_TYPE_DATE,
    TYPE_PROJECT as DROPPABLE_ID_TYPE_PROJECT,
} from './../../utility/dragAndDropHelpers';
import { createMoveTodoWithinProjectsAction } from '../../storage/actions/factory/projectActionFactories';
import { toast } from 'react-toastify';

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

        const fromDate = oldDroppableIdData.type === DROPPABLE_ID_TYPE_DATE;
        const fromProject =
            oldDroppableIdData.type === DROPPABLE_ID_TYPE_PROJECT;

        const toDate = newDroppableIdData.type === DROPPABLE_ID_TYPE_DATE;
        const toProject = newDroppableIdData.type === DROPPABLE_ID_TYPE_PROJECT;

        if (fromDate && toDate) {
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

        if (fromProject && toProject) {
            // drop todos between projects

            dispatch(
                createMoveTodoWithinProjectsAction(
                    oldDroppableIdData.identifier,
                    newDroppableIdData.identifier,
                    oldIndex,
                    newIndex
                )
            );

            return;
        }

        toast.error('Moving between dates and projects is not yet supported');
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
