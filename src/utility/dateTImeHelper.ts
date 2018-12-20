import {
    format,
    addDays,
    subDays,
    isTomorrow,
    isToday,
    isYesterday,
    parse,
    isSameDay,
    eachDay,
} from 'date-fns';

const DATE_FORMAT_SHORT = 'MMM, Mo';
const DATE_FORMAT = 'YYYY-MM-DD';

export function parseDate(value: string): Date {
    return parse(value);
}

export function formatDateShort(date: Date): string {
    return format(date, DATE_FORMAT_SHORT);
}

export function formatDate(date: Date): string {
    return format(date, DATE_FORMAT);
}

export function fomatDateToday(): string {
    return formatDate(new Date());
}

export function checkIsSameDay(first: Date, second: Date): boolean {
    return isSameDay(first, second);
}

export function checkDateIsToday(date: Date): boolean {
    const today = new Date();

    return isSameDay(date, today);
}

export function formatDistanceFromToday(date: Date): string {
    if (isToday(date)) {
        return 'today';
    }

    if (isTomorrow(date)) {
        return 'tomorrow';
    }

    if (isYesterday(date)) {
        return 'yesterday';
    }

    return formatDateShort(date);
}

export function createDateRelativeToSupplied(date: Date, amount: number): Date {
    if (amount === 0) {
        return date;
    }

    if (amount > 0) {
        return addDays(date, amount);
    }

    if (amount < 0) {
        return subDays(date, Math.abs(amount));
    }

    throw new Error('This point should never be reached');
}

export function createDateRelativeToToday(amount: number): Date {
    const today = new Date();

    return createDateRelativeToSupplied(today, amount);
}

export function createDateRange(start: Date, end: Date): Date[] {
    return eachDay(start, end);
}
