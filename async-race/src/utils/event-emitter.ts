type Handler = (data: unknown) => void;

export default class EventEmitter {
  private events: { [eventName: string]: Handler[] };

  public constructor() {
    this.events = {};
  }

  public emit(eventName: string, data: unknown): void {
    const handlers = this.events[eventName];
    if (handlers) handlers.forEach((handler) => handler.call(null, data));
  }

  public subscribe(eventName: string, handler: Handler): void {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(handler);
  }

  public unsubscribe(eventName: string, handler: Handler): void {
    const handlers = this.events[eventName];
    const handlerIndex = handlers.indexOf(handler);
    if (handlerIndex >= 0) handlers.splice(handlerIndex, 1);
  }
}
