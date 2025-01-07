interface Storage<T> {
    [index: number]: T;
};

export default class Queue<T> {

    private storage: Storage<T>;
    private front: number;
    private rear: number;

    constructor () {
        this.storage = {};
        this.front = 0;
        this.rear = 0;
    }

    public size (): number {
        if (this.storage[this.rear] === undefined) {
            return 0;
        } else {
            return this.rear - this.front + 1;
        }
    }

    public enqueue (value: T): void {
        if (this.size() !== 0) {
            this.rear++;
        } else {
            this.front = 0;
            this.rear = 0;
        }

        this.storage[this.rear] = value;
    }

    public dequeue (): T {
        const result: T = this.storage[this.front];

        delete this.storage[this.front];

        this.front++;

        return result;
    }

};