export interface ITab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export type ITabs = Record<string, ITab>;
