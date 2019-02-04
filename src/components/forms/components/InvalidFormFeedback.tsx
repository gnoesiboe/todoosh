import React from 'react';

type Props = {
    children: string | undefined;
};

const InvalidFormFeedback = ({ children }: Props) => (
    <div className="invalid-feedback" style={{ display: 'block' }}>
        {children}
    </div>
);

export default InvalidFormFeedback;
