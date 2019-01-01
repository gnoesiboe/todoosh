export function determineNextIndex(
    currentIndex: number,
    arrayLength: number
): number {
    const possibleNextIndex = currentIndex + 1;
    const lastIndex = arrayLength - 1;

    return possibleNextIndex > lastIndex ? 0 : possibleNextIndex;
}

export function determinePrevousIndex(
    currentIndex: number,
    arrayLength: number
): number {
    const possibleNextIndex = currentIndex - 1;
    const lastIndex = arrayLength - 1;

    return possibleNextIndex < 0 ? lastIndex : possibleNextIndex;
}
