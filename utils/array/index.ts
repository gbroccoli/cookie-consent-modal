
export function isEmpty<T>(arr: T[] | null | undefined): boolean {
    return !arr || arr.length === 0
}