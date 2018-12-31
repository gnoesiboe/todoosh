import React from 'react';
import { FormikProps } from 'formik';
import { TodoFormValues } from './TodoFormStateHandler';
import { Form, Input } from 'reactstrap';

export type OnCancelCallback = () => void;

type Props = {
    onCancel: OnCancelCallback;
};

const TodoForm: React.FunctionComponent<
    Props & FormikProps<TodoFormValues>
> = ({
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    onCancel,
}) => {
    return (
        <Form onSubmit={handleSubmit}>
            <Input
                type="text"
                name="title"
                placeholder="Title"
                onChange={handleChange}
                onKeyDown={(event: React.KeyboardEvent) => {
                    if (event.key === 'Escape') {
                        onCancel();
                    }
                }}
                onBlur={handleBlur}
                value={values.title}
                autoFocus
            />
            {errors.title && touched.title && errors.title}
        </Form>
    );
};

export default TodoForm;
