import React from 'react';
import { Form, FormGroup, FormFeedback, Input } from 'reactstrap';
import { Formik, FormikProps, FormikActions } from 'formik';

export type OnFormSubmittedAndValidCallback = (
    values: QuickTodoFormValues
) => void;

type Props = {
    onFormSubmittedAndValid: OnFormSubmittedAndValidCallback;
};

type QuickTodoFormValues = {
    title: string;
};

const QuickTodoForm: React.FunctionComponent<Props> = ({
    onFormSubmittedAndValid,
}) => {
    const initialValues: QuickTodoFormValues = { title: '' };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values, actions: FormikActions<QuickTodoFormValues>) => {
                actions.resetForm();

                onFormSubmittedAndValid(values);
            }}
        >
            {({
                handleChange,
                handleBlur,
                errors,
                values,
                touched,
                handleSubmit,
            }: FormikProps<QuickTodoFormValues>) => (
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Title"
                            onChange={handleChange}
                            autoComplete="off"
                            onBlur={handleBlur}
                            value={values.title}
                            invalid={!!errors.title && touched.title}
                            valid={!errors.title && touched.title}
                        />
                        {errors.title && touched.title && (
                            <FormFeedback tooltip>{errors.title}</FormFeedback>
                        )}
                    </FormGroup>
                </Form>
            )}
        </Formik>
    );
};

export default QuickTodoForm;
