export interface WorkerInterface {
    work(): Promise<any>;
}