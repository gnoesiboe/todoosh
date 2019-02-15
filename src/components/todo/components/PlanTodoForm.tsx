import React from 'react';
import { Form, FormGroup, Label } from 'reactstrap';
import { Formik, FormikProps, FormikActions } from 'formik';
import { createDateSelectOptions } from '../../createTodo/utility/deadlineOptionsFactory';
import Select from 'react-select';
import InvalidFormFeedback from '../../forms/components/InvalidFormFeedback';
import createClassName from 'classnames';
import './PlanTodoForm.scss';

export type OnFormSubmittedAndValidCallback = (
    values: PlanTodoFormValues
) => void;

type Props = {
    onFormSubmittedAndValid: OnFormSubmittedAndValidCallback;
    onCancel: () => void;
};

export type PlanTodoFormValues = {
    date: DateSelectOptionType;
};

type DateSelectOptionType = {
    label: string;
    value: Date;
} | null;

const deadlineOptions = createDateSelectOptions();

const PlanTodoForm: React.FunctionComponent<Props> = ({
    onFormSubmittedAndValid,
    onCancel,
}) => {
    const initialValues: PlanTodoFormValues = {
        date: null,
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values, actions: FormikActions<PlanTodoFormValues>) => {
                actions.resetForm();

                onFormSubmittedAndValid(values);
            }}
        >
            {({
                handleSubmit,
                values,
                setFieldValue,
                handleChange,
                handleBlur,
                touched,
                errors,
                submitForm,
                isValid: formIsValid,
            }: FormikProps<PlanTodoFormValues>) => {
                const hasErrors = {
                    date: touched.date && !!errors.date,
                };

                const isValid = {
                    date: touched.date && !errors.date,
                };

                const classNames = {
                    date: createClassName(
                        'form-control',
                        'form-control__alternative-padding',
                        {
                            'is-valid': isValid.date,
                            'is-invalid': hasErrors.date,
                        }
                    ),
                };

                const onKeyDown = (event: React.KeyboardEvent) => {
                    if (
                        event.key === 'Enter' &&
                        (event.ctrlKey || event.metaKey)
                    ) {
                        submitForm();
                    }

                    if (event.key === 'Escape') {
                        onCancel();
                    }
                };

                return (
                    <Form onSubmit={handleSubmit} className="plan-todo-form">
                        <FormGroup>
                            <Label for="date">Date</Label>
                            <Select<DateSelectOptionType>
                                options={deadlineOptions}
                                value={values.date}
                                onChange={newValue => {
                                    setFieldValue('date', newValue);
                                    handleChange('date');
                                }}
                                inputId="date"
                                onBlur={handleBlur}
                                onKeyDown={onKeyDown}
                                placeholder="Date"
                                name="date"
                                autoFocus
                                className={classNames.date}
                            />
                            {hasErrors.date && (
                                <InvalidFormFeedback>
                                    {errors.date}
                                </InvalidFormFeedback>
                            )}
                        </FormGroup>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!formIsValid}
                        >
                            Save
                        </button>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default PlanTodoForm;
