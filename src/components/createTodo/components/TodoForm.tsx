import React from 'react';
import { FormikProps } from 'formik';
import { TodoFormValues } from './TodoFormStateHandler';
import { Form, Input } from 'reactstrap';

type Props = FormikProps<TodoFormValues>;

const TodoForm: React.FunctionComponent<Props> = ({
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
}) => {
    return (
        <Form onSubmit={handleSubmit}>
            <Input
                type="text"
                name="title"
                placeholder="Title"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
                autoFocus
            />
            {errors.title && touched.title && errors.title}
        </Form>
    );
};

export default TodoForm;
