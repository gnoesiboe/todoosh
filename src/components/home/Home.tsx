import React from 'react';

import { Redirect } from 'react-router';
import { fomatDateToday } from '../../utility/dateTimeHelper';
import { createTodosPath } from '../../routing/urlGenerator';

export default () => {
    const todosOverviewPath = createTodosPath(fomatDateToday());

    return <Redirect to={todosOverviewPath} />;
};
