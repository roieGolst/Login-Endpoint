export interface IUseCase<T> {
    perform(): T;
};