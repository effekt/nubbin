/** One time, two times. A count read aloud in a live strip is the one place the reader notices. */
const ONE = 1;

export const plural = (count: number, noun: string): string => (count === ONE ? noun : `${noun}s`);
