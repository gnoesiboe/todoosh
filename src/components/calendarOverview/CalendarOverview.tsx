import React from 'react';
import { Row, Col } from 'reactstrap';
import DayOverview, {
    OnTodoCompletedChangeCallback,
} from './components/DayOverview';
import { OnClickCallback } from './components/TimeNavigationButton';
import {
    formatDate,
    parseDate,
    createDateRelativeToSupplied,
    checkIsSameDay,
    checkDateIsInThePast,
    checkIsValidDate,
} from '../../utility/dateTimeHelper';
import { connect, DispatchProp } from 'react-redux';
import { GlobalState } from '../../storage/reducers';
import { RouteComponentProps, withRouter, Redirect } from 'react-router';
import { RootAction } from './../../storage/actions/rootAction';
import CreateTodo from './../createTodo/CreateTodo';
import { createVisibleDateRangeFromRouterDate } from './utility/dateRangeHelper';
import {
    applyOnlyRelevantTodosSelector,
    TodosForCalendarOverviewType,
} from './utility/relevantTodosSelector';
import { createTodosPath, createHomePath } from '../../routing/urlGenerator';
import DayOverviewTitle from './components/DayOverviewTitle';
import TodoOverview from './components/TodoOverview';
import Todo from '../todo/Todo';
import { OnCancelCallback } from '../createTodo/components/TodoForm';
import { Todo as TodoModel } from './../../model/todo';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import './CalendarOverview.scss';
import DateNavigator from './components/DateNavigator';
import {
    KeyboardShortcuts,
    bindKeyboardShortcut,
    unbindKeyboardShortcut,
} from './../../navigation/KeyboardShortcuts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DEFAULT_STATE as DEFAULT_TODO_REDUCER_STATE } from '../../storage/reducers/todosReducer';
import { ProjectCollection } from '../../model/project';
import { createSetCurrentTodoAction } from '../../storage/actions/factory/currentTodoActionFactories';
import { TodoSection } from '../../model/TodoSection';
import {
    createRemoveTodoAction,
    createSelectPreviousDateTodoAction,
    createSelectNextDateTodoAction,
} from './../../storage/actions/factory/combinedActionsFactories';
import {
    createMoveTodosInThePastToTodayAction,
    createMoveTodoWithinDatesAction,
    createMoveTodoToNextSpotAction,
    createMoveTodoToPreviousSpotAction,
    createMoveTodoToNextDateAction,
    createMoveTodoToPreviousDateAction,
} from '../../storage/actions/factory/datesActionFactories';
import {
    createRemoveCompletedTodosAction,
    createToggleTodoCompletedAction,
} from '../../storage/actions/factory/todoActionFactories';
import { DatesReducerState } from '../../storage/reducers/datesReducer';
import {
    createDroppableIdForDate,
    parseDroppableId,
    TYPE_DATE as DROPPABLE_ID_TYPE_DATE,
} from './../../utility/dragAndDropHelpers';

type ReactRouterMatchParams = {
    startDate: string;
};

type OwnProps = {} & RouteComponentProps<ReactRouterMatchParams>;

type ReduxSuppliedProps = {
    todos: TodosForCalendarOverviewType;
    visibleDateRange: Date[];
    currentDate: Date;
    currentTodoId: string | null;
    projects: ProjectCollection;
    dates: DatesReducerState;
};

type CombinedProps = OwnProps &
    ReduxSuppliedProps &
    DispatchProp &
    RouteComponentProps<{}>;

type State = {
    isEditingTodo: boolean;
};

class CalendarOverview extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            isEditingTodo: false,
        };
    }
    public componentDidMount() {
        this.redirectToTodayIfCurrentDateIsInThePast();
        this.ensureAllCompletedTodosInThePastAreEitherMovedOrRemoved();
        this.bindKeyboardShortcuts();
    }

    public componentWillUnmount() {
        this.unbindKeyboardShortcuts();
    }

    private redirectToTodayIfCurrentDateIsInThePast() {
        const currentDate = this.props.currentDate;

        if (checkDateIsInThePast(currentDate)) {
            this.navigateToToday();
        }
    }

    private navigateToDate(nextDate: Date) {
        const { history } = this.props;
        const dateAsString = formatDate(nextDate);

        history.push(createTodosPath(dateAsString));
    }

    private navigateToToday() {
        const today = new Date();

        this.navigateToDate(today);
    }

    private ensureAllCompletedTodosInThePastAreEitherMovedOrRemoved() {
        const { dispatch } = this.props;

        dispatch(createRemoveCompletedTodosAction());
        dispatch(createMoveTodosInThePastToTodayAction());
    }

    private bindKeyboardShortcuts() {
        bindKeyboardShortcut(
            KeyboardShortcuts.NEXT_DATE_SHORCUT,
            this.onMoveToNextDateKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.PREVIOUS_DATE_SHORTCUT,
            this.onMoveToPreviousDateKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.TODAY_SHORTCUT,
            this.onTodayKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.NEXT_TODO_SHORTCUT,
            this.onMoveToNextTodoKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.PREVIOUS_TODO_SHORTCUT,
            this.onMoveToPreviousTodoKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.TOGGLE_COMPLETED_SHORTCUT,
            this.onToggleCompletedKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.TODO_EDIT_SHORTCUT,
            this.onEditKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.TODO_DELETE_SHORTCUT,
            this.onTodoDeleteKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.MOVE_TODO_DOWN,
            this.onMoveTodoDownKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.MOVE_TODO_UP,
            this.onMoveTodoUpKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.MOVE_TODO_TO_NEXT_DATE,
            this.onMoveTodoToNextDateKeyboardShortcutPressed
        );
        bindKeyboardShortcut(
            KeyboardShortcuts.MOVE_TODO_TO_PREVIOUS_DATE,
            this.onMoveTodoToPreviousDateKeyboardShortcutPressed
        );
    }

    private unbindKeyboardShortcuts() {
        unbindKeyboardShortcut(KeyboardShortcuts.NEXT_DATE_SHORCUT);
        unbindKeyboardShortcut(KeyboardShortcuts.PREVIOUS_DATE_SHORTCUT);
        unbindKeyboardShortcut(KeyboardShortcuts.TODAY_SHORTCUT);
        unbindKeyboardShortcut(KeyboardShortcuts.NEXT_TODO_SHORTCUT);
        unbindKeyboardShortcut(KeyboardShortcuts.PREVIOUS_TODO_SHORTCUT);
        unbindKeyboardShortcut(KeyboardShortcuts.TOGGLE_COMPLETED_SHORTCUT);
        unbindKeyboardShortcut(KeyboardShortcuts.TODO_EDIT_SHORTCUT);
        unbindKeyboardShortcut(KeyboardShortcuts.TODO_DELETE_SHORTCUT);
        unbindKeyboardShortcut(KeyboardShortcuts.MOVE_TODO_DOWN);
        unbindKeyboardShortcut(KeyboardShortcuts.MOVE_TODO_UP);
        unbindKeyboardShortcut(KeyboardShortcuts.MOVE_TODO_TO_NEXT_DATE);
    }

    private onTodoDeleteKeyboardShortcutPressed = () => {
        const { currentTodoId, dispatch } = this.props;

        if (!currentTodoId) {
            toast.error('No current todo selected to delete');

            return;
        }

        if (confirm('Are you sure?')) {
            // @ts-ignore @todo fix problem where thunks are not allowed to be dispatched
            dispatch(createRemoveTodoAction(currentTodoId));
        }
    };

    private onEditKeyboardShortcutPressed = (event: ExtendedKeyboardEvent) => {
        // prevent typing the letter 'e' in input
        event.preventDefault();

        this.startEditingTodo();
    };

    private startEditingTodo() {
        this.setState(currentState => ({
            ...currentState,
            isEditingTodo: true,
        }));
    }

    private stopEditingTodo() {
        this.setState(currentState => ({
            ...currentState,
            isEditingTodo: false,
        }));
    }

    private onEditTodoCancel: OnCancelCallback = () => {
        this.stopEditingTodo();
    };

    private onToggleCompletedKeyboardShortcutPressed = (event: Event) => {
        // prevent scrolling down the page
        event.preventDefault();

        if (this.state.isEditingTodo) {
            // when editing and using space to submit form, we don't want to complete the todo

            return;
        }

        const { currentTodoId } = this.props;

        if (!currentTodoId) {
            return;
        }

        this.toggleTodoCompletedStatus(currentTodoId);
    };

    private onMoveToNextDateKeyboardShortcutPressed = () => {
        this.navigateToNextDate();
    };

    private onMoveToPreviousTodoKeyboardShortcutPressed = (event: Event) => {
        // prevent page scrolling up
        event.preventDefault();

        // @ts-ignore @todo fix problem where thunks are not allowed to be dispatched
        this.props.dispatch(createSelectPreviousDateTodoAction());
    };

    private onMoveToNextTodoKeyboardShortcutPressed = (event: Event) => {
        // prevent page scrolling down
        event.preventDefault();

        // @ts-ignore @todo fix problem where thunks are not allowed to be dispatched
        this.props.dispatch(createSelectNextDateTodoAction());
    };

    private navigateToNextDate() {
        const { currentDate } = this.props;

        const nextDate = createDateRelativeToSupplied(currentDate, 1);

        this.navigateToDate(nextDate);
    }

    private onMoveToPreviousDateKeyboardShortcutPressed = () => {
        if (!this.checkPreviousDateIsAccessible()) {
            toast.error('Cannot move before today');

            return;
        }

        this.navigateToPreviousDate();
    };

    private onTodayKeyboardShortcutPressed = () => {
        this.navigateToToday();
    };

    private onTodayClick = () => {
        this.navigateToToday();
    };

    private navigateToPreviousDate() {
        const { currentDate } = this.props;

        const nextDate = createDateRelativeToSupplied(currentDate, -1);

        this.navigateToDate(nextDate);
    }

    private onBackClick: OnClickCallback = event => {
        event.preventDefault();

        this.navigateToPreviousDate();
    };

    private onForwardClick: OnClickCallback = event => {
        event.preventDefault();

        this.navigateToNextDate();
    };

    private onTodoCompletedChange: OnTodoCompletedChangeCallback = todo => {
        this.toggleTodoCompletedStatus(todo.id);
    };

    private toggleTodoCompletedStatus(todoId: string) {
        const action = createToggleTodoCompletedAction(todoId);

        this.props.dispatch(action);
    }

    private onTodoDragEnd = (result: DropResult) => {
        const { dispatch } = this.props;

        const destination = result.destination;

        if (!destination) {
            return;
        }

        const oldDroppableIdData = parseDroppableId(result.source.droppableId);
        const newDroppableIdData = parseDroppableId(destination.droppableId);

        if (
            oldDroppableIdData.type !== DROPPABLE_ID_TYPE_DATE ||
            newDroppableIdData.type !== DROPPABLE_ID_TYPE_DATE
        ) {
            toast.error(
                'Drag and drop between projects and dates is not supported at this point'
            );
        }

        const oldDate = oldDroppableIdData.identifier;
        const newDate = newDroppableIdData.identifier;

        const oldIndex = result.source.index;
        const newIndex = destination.index;

        dispatch(
            createMoveTodoWithinDatesAction(
                oldDate,
                newDate,
                oldIndex,
                newIndex
            )
        );
    };

    private onMoveTodoDownKeyboardShortcutPressed = (
        event: ExtendedKeyboardEvent
    ) => {
        // as cmd + down is also used for moving down the page in Google Chrome, prevent default behaviour
        event.preventDefault();

        const { currentTodoId, dispatch } = this.props;

        if (!currentTodoId) {
            return;
        }

        dispatch(createMoveTodoToNextSpotAction(currentTodoId));
    };

    private onMoveTodoUpKeyboardShortcutPressed = (
        event: ExtendedKeyboardEvent
    ) => {
        // as cmd + up is also used for moving up the page in Google Chrome, prevent default behaviour
        event.preventDefault();

        const { currentTodoId, dispatch } = this.props;

        if (!currentTodoId) {
            return;
        }

        dispatch(createMoveTodoToPreviousSpotAction(currentTodoId));
    };

    private onMoveTodoToNextDateKeyboardShortcutPressed = (
        event: ExtendedKeyboardEvent
    ) => {
        // as cmd + right is also used for navigation in history, in Google Chrome, prevent default behaviour
        event.preventDefault();

        const { dispatch, currentTodoId } = this.props;

        if (!currentTodoId) {
            return;
        }

        dispatch(createMoveTodoToNextDateAction(currentTodoId));

        this.navigateToNextDate();
    };

    private onMoveTodoToPreviousDateKeyboardShortcutPressed = (
        event: ExtendedKeyboardEvent
    ) => {
        // as cmd + left is also used for navigation in history, in Google Chrome, prevent default behaviour
        event.preventDefault();

        const { dispatch, currentTodoId } = this.props;

        if (!currentTodoId) {
            return;
        }

        dispatch(createMoveTodoToPreviousDateAction(currentTodoId));

        this.navigateToPreviousDate();
    };

    private onDayOverviewTitleClick(dateAsString: string) {
        this.navigateToDate(parseDate(dateAsString));
    }

    private onEditTodoClick = (id: string) => {
        const { dispatch } = this.props;

        dispatch(createSetCurrentTodoAction(id, TodoSection.date));

        this.startEditingTodo();
    };

    private renderTodo(todo: TodoModel, isCurrent: boolean, date: Date) {
        const isEditMode = isCurrent && this.state.isEditingTodo;
        const project = this.props.projects.find(cursorProject =>
            cursorProject.todos.includes(todo.id)
        );

        if (!project) {
            throw new Error('Expecting project to be available at this point');
        }

        return (
            <Todo
                onEditClick={() => this.onEditTodoClick(todo.id)}
                showProject={true}
                key={todo.id}
                isEditMode={isEditMode}
                onEditCancel={this.onEditTodoCancel}
                todo={todo}
                project={project}
                date={date}
                isCurrent={isCurrent}
                onCompletedChange={complete =>
                    this.onTodoCompletedChange(todo, date, complete)
                }
            />
        );
    }

    private renderDayOverview(date: Date, isCurrentDate: boolean) {
        const { todos, currentDate, currentTodoId } = this.props;

        const dateAsString = formatDate(date);
        const todosForDate = todos[dateAsString] || [];

        const droppableId = createDroppableIdForDate(formatDate(date));

        return (
            <DayOverview isCurrent={isCurrentDate}>
                <DayOverviewTitle
                    date={date}
                    onClick={() => this.onDayOverviewTitleClick(dateAsString)}
                />
                {isCurrentDate ? <CreateTodo date={currentDate} /> : undefined}
                <TodoOverview droppableId={droppableId}>
                    {todosForDate.map(todo => {
                        const isCurrent = todo.id === currentTodoId;

                        return this.renderTodo(todo, isCurrent, date);
                    })}
                </TodoOverview>
            </DayOverview>
        );
    }

    private checkPreviousDateIsAccessible(): boolean {
        const startDate = this.props.currentDate;
        const nextDate = createDateRelativeToSupplied(startDate, -1);

        return !checkDateIsInThePast(nextDate);
    }

    public render() {
        const { currentDate, todos } = this.props;

        if (!(currentDate instanceof Date) || !checkIsValidDate(currentDate)) {
            return <Redirect to={createHomePath()} />;
        }

        return (
            <div className="calendar-overview">
                <div className="calendar-overview--navigation">
                    <Row>
                        <DateNavigator
                            currentDate={currentDate}
                            onBackClick={this.onBackClick}
                            onForwardClick={this.onForwardClick}
                            onTodayClick={this.onTodayClick}
                        />
                    </Row>
                </div>
                <Row>
                    <DragDropContext onDragEnd={this.onTodoDragEnd}>
                        {Object.keys(todos).map(dateAsString => {
                            const date = parseDate(dateAsString);
                            const isCurrentDate = checkIsSameDay(
                                date,
                                currentDate
                            );

                            return (
                                <Col md={4} key={dateAsString}>
                                    {this.renderDayOverview(
                                        date,
                                        isCurrentDate
                                    )}
                                </Col>
                            );
                        })}
                    </DragDropContext>
                </Row>
                <ToastContainer />
            </div>
        );
    }
}

function mapGlobalStateToProps(
    globalState: GlobalState,
    props: OwnProps
): ReduxSuppliedProps {
    // @todo use selectors to prepare the data for display in this component to make it
    // less comlex to resolve dates and projects and stuff

    const currentDate = parseDate(props.match.params.startDate);
    const visibleDateRange = createVisibleDateRangeFromRouterDate(currentDate);
    const dates = globalState.dates || {};
    const todos = applyOnlyRelevantTodosSelector(
        dates,
        globalState.todos || DEFAULT_TODO_REDUCER_STATE,
        visibleDateRange
    );
    const currentTodoId = globalState.currentTodo
        ? globalState.currentTodo[TodoSection.date]
        : null;
    const projects = globalState.projects || [];

    return {
        todos,
        visibleDateRange,
        currentDate,
        currentTodoId,
        projects,
        dates,
    };
}

export default connect<ReduxSuppliedProps, {}, OwnProps>(mapGlobalStateToProps)(
    withRouter<OwnProps & ReduxSuppliedProps & DispatchProp<RootAction>>(
        CalendarOverview
    )
);
