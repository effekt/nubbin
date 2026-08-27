/** One thing to do, optionally with the command that does it and the page that explains it. */
export type Step = {
  title: string;
  command?: string;
  docs?: string;
};
