import {
    createDateRelativeToSupplied,
    createDateRange,
} from '../../../utility/dateTImeHelper';

export function createVisibleDateRangeFromRouterDate(
    currentDate: Date
): Date[] {
    const oneDayBefore = createDateRelativeToSupplied(currentDate, -1);
    const lastDay = createDateRelativeToSupplied(currentDate, 2);

    return createDateRange(oneDayBefore, lastDay);
}
