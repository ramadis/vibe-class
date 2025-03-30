// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericClass<T> = new (...args: any[]) => T;
export type AnyFunction = (...args: unknown[]) => Promise<unknown>;
