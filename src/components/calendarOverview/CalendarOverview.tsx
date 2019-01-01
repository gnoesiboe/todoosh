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
    formatDate,
    parseDate,
    createDateRelativeToSupplied,
    checkIsSameDay,
    fomatDateToday,
} from './../../utility/dateTImeHelper';
import { connect, DispatchProp } from 'react-redux';
import { GlobalState } from '../../storage/reducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { createSetCurrentDateAction } from '../../storage/actions/factory/currentDateActionFactories';
import { RootAction } from './../../storage/actions/rootAction';
import CreateTodo from './../createTodo/CreateTodo';
import { TodoCollection } from '../../model/todo';
import { createVisibleDateRangeFromRouterDate } from './utility/dateRangeHelper';
import { applyOnlyRelevantTodosSelector } from './utility/relevantTodosSelector';
import { createToggleTodoCompletedAction } from '../../storage/actions/factory/todoActionFactories';
import mousetrap from 'mousetrap';
import { createTodosPath } from '../../routing/urlGenerator';

type ReactRouterMatchParams = {
    startDate: string;
};

type OwnProps = {} & RouteComponentProps<ReactRouterMatchParams>;

type ReduxSuppliedProps = {
    todos: TodoCollection;
    visibleDateRange: Date[];
    currentDate: Date;
};

const FORWARDS_SHORCUT = ['right', 'j'];
const BACKWARDS_SHORTCUT = ['left', 'k'];
const TODAY_SHORTCUT = 't';

class CalendarOverview extends React.Component<
    OwnProps &
        ReduxSuppliedProps &
        DispatchProp<RootAction> &
        RouteComponentProps<{}>
> {
    public componentDidMount() {
        this.setCurrentDate(this.props.match.params.startDate);
        this.bindKeyboardShortcuts();
    }

    public componentWillUnmount() {
        this.unbindKeyboardShortcuts();
    }

    private bindKeyboardShortcuts() {
        mousetrap.bind(
            FORWARDS_SHORCUT,
            this.onMoveRightKeyboardShortcutPressed
        );
        mousetrap.bind(
            BACKWARDS_SHORTCUT,
            this.onMoveLightKeyboardShortcutPressed
        );
        mousetrap.bind(TODAY_SHORTCUT, this.onTodayKeyboardShortcutPressed);
    }

    private onMoveRightKeyboardShortcutPressed = () => {
        this.navigateToNextDate();
    };

    private navigateToNextDate() {
        const { currentDate, history } = this.props;

        const nextDate = createDateRelativeToSupplied(currentDate, 1);

        history.push(createTodosPath(formatDate(nextDate)));
    }

    private onMoveLightKeyboardShortcutPressed = () => {
        this.navigateToPreviousDate();
    };

    private onTodayKeyboardShortcutPressed = () => {
        const { history } = this.props;

        history.push(createTodosPath(fomatDateToday()));
    };

    private navigateToPreviousDate() {
        const { currentDate, history } = this.props;

        const nextDate = createDateRelativeToSupplied(currentDate, -1);

        history.push(createTodosPath(formatDate(nextDate)));
    }

    private unbindKeyboardShortcuts() {
        mousetrap.unbind(FORWARDS_SHORCUT);
        mousetrap.unbind(BACKWARDS_SHORTCUT);
    }

    private setCurrentDate(date: string) {
        const { dispatch } = this.props;

        dispatch(createSetCurrentDateAction(date));
    }

    private onBackClick: OnClickCallback = event => {
        event.preventDefault();

        this.navigateToPreviousDate();
    };

    private onForwardClick: OnClickCallback = event => {
        event.preventDefault();

        this.navigateToNextDate();
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
                        onClick={this.onBackClick}
                    />
                </Col>
                {Object.keys(todos).map(dateAsString => {
                    const date = parseDate(dateAsString);
                    const isCurrent = checkIsSameDay(date, currentDate);
                    const todosForDate = todos[dateAsString];

                    return (
                        <Col md={isCurrent ? 4 : 2} key={formatDate(date)}>
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
                        onClick={this.onForwardClick}
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
    withRouter<OwnProps & ReduxSuppliedProps & DispatchProp<RootAction>>(
        CalendarOverview
    )
);
