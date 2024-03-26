export interface IBall {
  position: { X: number; Y: number };
  mass: number;
  color: string;
  radius: number;
  velocity: IPosition;
  movable: boolean;
}
export interface IPosition {
  X: number;
  Y: number;
}
