/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'socket.io' {
  export class Server {
    constructor(...args: any[]);
    on(event: string, callback: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): boolean;
    to(room: string): {
      emit(event: string, ...args: any[]): boolean;
    };
  }
}
