export const TYPE_PROJECT: string = 'project';
export const TYPE_DATE: string = 'date';

const SEPERATOR = '__';

function createDroppableId(type: string, identifier: string): string {
    return [type, SEPERATOR, identifier].join('');
}

export function createDroppableIdForDate(date: string): string {
    return createDroppableId(TYPE_DATE, date);
}

export function createDroppableIdForProject(projectId: string): string {
    return createDroppableId(TYPE_PROJECT, projectId);
}

export function parseDroppableId(
    droppableId: string
): { type: string; identifier: string } {
    const parts = droppableId.split(SEPERATOR);

    if (parts.length !== 2) {
        throw new Error('Invalid droppableId provided');
    }

    const [type, identifier] = parts;

    return { type, identifier };
}
