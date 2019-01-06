import React from 'react';
import { Formik, FormikProps, FormikActions } from 'formik';
import TodoForm, {
    OnCancelCallback,
    DeadlineSelectOptionType,
} from './TodoForm';
import { Todo } from '../../../model/todo';
import { parseDate } from '../../../utility/dateTImeHelper';

export type TodoFormValues = {
    title: string;
    deadline: DeadlineSelectOptionType | undefined;
};

export type OnSubmitCallback = (values: TodoFormValues) => void;

type Props = {
    todo?: Todo;
    onFormSubmittedAndValid: OnSubmitCallback;
    onCancel: OnCancelCallback;
};

function validateValues(values: TodoFormValues) {
    const errors: { [key: string]: string } = {};

    if (!values.title) {
        errors.title = 'Required';
    }

    return errors;
}

const TodoFormStateHandler: React.FunctionComponent<Props> = ({
    todo,
    onFormSubmittedAndValid,
    onCancel,
}: Props) => {
    const initialValues: TodoFormValues = {
        title: todo ? todo.title : '',
        deadline:
            todo && todo.deadline
                ? {
                      label: 'Current',
                      value: parseDate(todo.deadline),
                  }
                : undefined,
    };

    return (
        <Formik
            initialValues={initialValues}
            validate={validateValues}
            onSubmit={(values, actions: FormikActions<TodoFormValues>) => {
                actions.resetForm();

                onFormSubmittedAndValid(values);
            }}
        >
            {(childProps: FormikProps<TodoFormValues>) => (
                <TodoForm {...childProps} onCancel={onCancel} />
            )}
        </Formik>
    );
};

export default TodoFormStateHandler;
