import React from 'react';
import { Formik, FormikProps, FormikActions } from 'formik';
import TodoForm from './TodoForm';
import { Todo } from '../../../model/todo';

export type TodoFormValues = {
    title: string;
};

export type OnSubmitCallback = (values: TodoFormValues) => void;

type Props = {
    todo?: Todo;
    onFormSubmittedAndValid: OnSubmitCallback;
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
}: Props) => {
    const initialValues: TodoFormValues = {
        title: todo ? todo.title : '',
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
                <TodoForm {...childProps} />
            )}
        </Formik>
    );
};

export default TodoFormStateHandler;
