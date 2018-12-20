export function createHomePath(): string {
    return '/';
}

export function createTodosPath(startDate: string = ':startDate'): string {
    return `/todos/${startDate}`;
}
