export enum PlayerColor {
  Red = 'red',
  Blue = 'blue',
  Green = 'green',
  Yellow = 'yellow',
}

export function getPlayerColorByIndex(index: number): PlayerColor {
  switch (index) {
    case 0:
      return PlayerColor.Red;

    case 1:
      return PlayerColor.Blue;

    case 2:
      return PlayerColor.Green;

    default:
      return PlayerColor.Red;
  }
}
