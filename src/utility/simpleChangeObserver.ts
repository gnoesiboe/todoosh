import uuid from 'uuid/v4';

export type ListenerCallback = () => void;

export default class SimpleChangeObserver {
    private listeners: { [key: string]: ListenerCallback };

    constructor() {
        this.listeners = {};
    }

    public addListener(callback: ListenerCallback): string {
        const key = uuid();

        this.listeners[key] = callback;

        return key;
    }

    public removeListener(key: string): void {
        if (typeof this.listeners[key] !== 'undefined') {
            delete this.listeners[key];
        }
    }

    public notifyChange() {
        Object.keys(this.listeners).map(key => {
            const callback = this.listeners[key];

            callback();
        });
    }
}
