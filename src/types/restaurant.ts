export type TableStatus = "available" | "occupied" | "reserved";

export type TableShape = "rect" | "circle";

export interface RestaurantTable {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: TableShape;
  seats: number;
  rotation?: number;
}

export interface Occupancy {
  id: string;
  tableId: string;
  guestsCount: number;
  startedAt: Date;
  endedAt: Date | null;
  notes: string;
}

export interface TableState {
  table: RestaurantTable;
  status: TableStatus;
  currentOccupancy: Occupancy | null;
}

export interface FloorLayout {
  name: string;
  width: number;
  height: number;
  tables: RestaurantTable[];
  decorations: Decoration[];
}

export interface Decoration {
  id: string;
  type: "counter" | "wall" | "entrance" | "kitchen" | "bathroom" | "plant" | "churrasqueira";
  seats?: number;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}
