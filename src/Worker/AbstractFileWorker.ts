export abstract class AbstractFileWorker {
    protected file: string;
    public setFile(file: string) {
        this.file = file;
    }
}