import { Bonus } from './bonus.enum';

export interface PlayerBonus {
  [Bonus.Estate]: boolean;
  [Bonus.Gold]: boolean;
  [Bonus.JailFree]: boolean;
}
