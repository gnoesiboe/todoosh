import {
    createDateRelativeToSupplied,
    createDateRange,
} from '../../../utility/dateTImeHelper';

export function createVisibleDateRangeFromRouterDate(
    currentDate: Date
): Date[] {
    const lastDay = createDateRelativeToSupplied(currentDate, 2);

    return createDateRange(currentDate, lastDay);
}
