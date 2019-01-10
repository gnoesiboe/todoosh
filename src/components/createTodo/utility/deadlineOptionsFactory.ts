import { OptionsType } from 'react-select/lib/types';
import { DeadlineSelectOptionType } from '../components/TodoForm';
import {
    createDateRelativeToSupplied,
    formatDay,
} from '../../../utility/dateTimeHelper';

export function createDeadlineOptions(): OptionsType<DeadlineSelectOptionType> {
    const today = new Date();

    const relative = [
        {
            label: 'Today',
            value: today,
        },
        {
            label: 'Tomorrow',
            value: createDateRelativeToSupplied(today, 1),
        },
    ];

    const upcoming = [2, 3, 4, 5, 6].map(offsetToToday => {
        const date = createDateRelativeToSupplied(today, offsetToToday);

        return {
            label: formatDay(date),
            value: date,
        };
    });

    return [...relative, ...upcoming];
}
