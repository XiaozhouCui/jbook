export type CellTypes = 'cell' | 'text'
export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
}
