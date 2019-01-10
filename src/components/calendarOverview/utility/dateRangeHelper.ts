import {
    createDateRelativeToSupplied,
    createDateRange,
} from '../../../utility/dateTimeHelper';

export function createVisibleDateRangeFromRouterDate(
    currentDate: Date
): Date[] {
    const lastDay = createDateRelativeToSupplied(currentDate, 2);

    return createDateRange(currentDate, lastDay);
}
