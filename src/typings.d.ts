
// This file can be used to declare types for modules that don't have them.
// For example:
// declare module 'some-library';

declare module 'wav' {
    export class Writer {
        constructor(options: {
            channels: number;
            sampleRate: number;
            bitDepth: number;
        });
        on(event: 'error', cb: (err: Error) => void): this;
        on(event: 'data', cb: (chunk: Buffer) => void): this;
        on(event: 'end', cb: () => void): this;
        write(chunk: Buffer): boolean;
        end(): void;
    }
}
