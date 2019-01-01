import React from 'react';
import { Row, Col } from 'reactstrap';
import DayOverview, {
    OnTodoCompletedChangeCallback,
} from './../dayOverview/DayOverview';
import TimeNavigationButton, {
    Direction,
    OnClickCallback,
} from './components/TimeNavigationButton';
import {
    checkDateIsToday,
    formatDate,
    parseDate,
    checkIsSameDay,
} from './../../utility/dateTImeHelper';
import { connect, DispatchProp } from 'react-redux';
import { GlobalState } from '../../storage/reducers';
import { RouteComponentProps } from 'react-router';
import { createSetCurrentDateAction } from '../../storage/actions/factory/currentDateActionFactories';
import { RootAction } from './../../storage/actions/rootAction';
import CreateTodo from './../createTodo/CreateTodo';
import { TodoCollection } from '../../model/todo';
import { createVisibleDateRangeFromRouterDate } from './utility/dateRangeHelper';
import { applyOnlyRelevantTodosSelector } from './utility/relevantTodosSelector';
import { createToggleTodoCompletedAction } from '../../storage/actions/factory/todoActionFactories';

type ReactRouterMatchParams = {
    startDate: string;
};

type OwnProps = {} & RouteComponentProps<ReactRouterMatchParams>;

type ReduxSuppliedProps = {
    todos: TodoCollection;
    visibleDateRange: Date[];
    currentDate: Date;
};

class CalendarOverview extends React.Component<
    OwnProps & ReduxSuppliedProps & DispatchProp<RootAction>
> {
    public componentDidMount() {
        this.setCurrentDate();
    }

    private setCurrentDate() {
        const { dispatch, match } = this.props;

        dispatch(createSetCurrentDateAction(match.params.startDate));
    }

    private onPageBackClick: OnClickCallback = event => {
        event.preventDefault();

        // console.log('navigate back');
    };

    private onPageForwardClick: OnClickCallback = event => {
        event.preventDefault();

        // console.log('navigate forward');
    };

    private onTodoCompletedChange: OnTodoCompletedChangeCallback = (
        todo,
        date,
        completed
    ) => {
        const action = createToggleTodoCompletedAction(
            todo.id,
            formatDate(date),
            completed
        );

        this.props.dispatch(action);
    };

    public render() {
        const { currentDate, todos } = this.props;

        return (
            <Row>
                <Col md={1}>
                    <TimeNavigationButton
                        direction={Direction.Back}
                        onClick={this.onPageBackClick}
                    />
                </Col>
                {Object.keys(todos).map(dateAsString => {
                    const date = parseDate(dateAsString);
                    const isCurrent = checkIsSameDay(date, currentDate);
                    const todosForDate = todos[dateAsString];

                    return (
                        <Col
                            md={checkDateIsToday(date) ? 4 : 2}
                            key={formatDate(date)}
                        >
                            <DayOverview
                                onTodoCompletedChange={
                                    this.onTodoCompletedChange
                                }
                                date={date}
                                isCurrent={isCurrent}
                                todos={todosForDate}
                            >
                                {isCurrent ? (
                                    <CreateTodo date={this.props.currentDate} />
                                ) : (
                                    undefined
                                )}
                            </DayOverview>
                        </Col>
                    );
                })}
                <Col md={1}>
                    <TimeNavigationButton
                        direction={Direction.Forward}
                        onClick={this.onPageForwardClick}
                    />
                </Col>
            </Row>
        );
    }
}

function mapGlobalStateToProps(
    globalState: GlobalState,
    props: OwnProps
): ReduxSuppliedProps {
    const currentDate = parseDate(props.match.params.startDate);
    const visibleDateRange = createVisibleDateRangeFromRouterDate(currentDate);
    const todos: TodoCollection = applyOnlyRelevantTodosSelector(
        globalState.todos || null,
        visibleDateRange
    );

    return {
        todos,
        visibleDateRange,
        currentDate,
    };
}

export default connect<ReduxSuppliedProps, {}, OwnProps>(mapGlobalStateToProps)(
    CalendarOverview
);
