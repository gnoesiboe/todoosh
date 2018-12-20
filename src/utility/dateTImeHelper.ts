import {
    format,
    addDays,
    subDays,
    isTomorrow,
    isToday,
    isYesterday,
    parse,
    isSameDay,
} from 'date-fns';

const DATE_FORMAT_SHORT = 'MMM, Mo';
const DATE_FORMAT = 'YYYY-MM-DD';

export function createDate(value: string): Date {
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

export function createDateRelativeToToday(amount: number): Date {
    const now = new Date();

    if (amount === 0) {
        return now;
    }

    if (amount > 0) {
        return addDays(now, amount);
    }

    if (amount < 0) {
        return subDays(now, Math.abs(amount));
    }

    throw new Error('This point should never be reached');
}
