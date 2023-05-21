import { ActionField } from './action';
import { Field } from './base';
import { FactoryField } from './factory';
import { FieldFamily } from './field.enum';
import { StationField } from './station';
import {
  STREET_BLUE,
  STREET_GREEN,
  STREET_GREY,
  STREET_ORANGE,
  STREET_PURPLE,
  STREET_RED,
  STREET_WHITE,
  STREET_YELLOW,
  StreetField,
} from './street';

export const ALL_FIELDS: Field[] = [
  new Field(0, 'Start', FieldFamily.Start),
  new StreetField(1, STREET_GREY, 0),
  new ActionField(2, 'Quest', FieldFamily.Action),
  new StreetField(3, STREET_GREY, 1),
  new ActionField(4, 'Tax', FieldFamily.Tax),
  new ActionField(5, 'Bonus', FieldFamily.Bonus),
  new StreetField(6, STREET_ORANGE, 0),
  new StationField(7, 'Station 1', FieldFamily.Station),
  new StreetField(8, STREET_ORANGE, 1),
  new StreetField(9, STREET_ORANGE, 2),
  new FactoryField(10, 'Factory 1', FieldFamily.Factory),
  new StreetField(11, STREET_YELLOW, 0),
  new ActionField(12, 'Graveyard', FieldFamily.Normal),
  new ActionField(13, 'Quest', FieldFamily.Action),
  new StreetField(14, STREET_YELLOW, 1),
  new StreetField(15, STREET_YELLOW, 2),
  new StationField(16, 'Station 2', FieldFamily.Station),
  new StreetField(17, STREET_GREEN, 0),
  new StreetField(18, STREET_GREEN, 1),
  new ActionField(19, 'Quest', FieldFamily.Bonus),
  new StreetField(20, STREET_GREEN, 2),
  new ActionField(21, 'Bank', FieldFamily.Bank),
  new ActionField(22, 'Estate', FieldFamily.Bonus),
  new StreetField(23, STREET_PURPLE, 0),
  new ActionField(24, 'Quest', FieldFamily.Action),
  new StreetField(25, STREET_PURPLE, 1),
  new StreetField(26, STREET_PURPLE, 2),
  new StationField(27, 'Station 3', FieldFamily.Station),
  new StreetField(28, STREET_WHITE, 0),
  new StreetField(29, STREET_WHITE, 1),
  new FactoryField(30, 'Factory 2', FieldFamily.Factory),
  new StreetField(31, STREET_WHITE, 2),
  new ActionField(32, 'Quest', FieldFamily.Action),
  new ActionField(33, 'Flasche voll Gift', FieldFamily.Jail),
  new StreetField(34, STREET_BLUE, 0),
  new StreetField(35, STREET_BLUE, 1),
  new ActionField(36, 'Quest', FieldFamily.Action),
  new StreetField(37, STREET_BLUE, 2),
  new StationField(38, 'Station 4', FieldFamily.Station),
  new StreetField(39, STREET_RED, 0),
  new ActionField(40, 'Bomb', FieldFamily.Tax),
  new StreetField(41, STREET_RED, 1),
];

export const STREET_IDS = getGenericFieldIds(StreetField);
export const STATION_IDS = getGenericFieldIds(StationField);
export const FACTORY_IDS = getGenericFieldIds(FactoryField);
export const ACTION_IDS = getGenericFieldIds(ActionField);

export const FAMILY_STREET_IDS: { [key: string]: number[] } = {
  [FieldFamily.StreetGrey]: getStreetIdsByFamily(FieldFamily.StreetGrey),
  [FieldFamily.StreetOrange]: getStreetIdsByFamily(FieldFamily.StreetOrange),
  [FieldFamily.StreetYellow]: getStreetIdsByFamily(FieldFamily.StreetYellow),
  [FieldFamily.StreetGreen]: getStreetIdsByFamily(FieldFamily.StreetGreen),
  [FieldFamily.StreetPurple]: getStreetIdsByFamily(FieldFamily.StreetPurple),
  [FieldFamily.StreetWhite]: getStreetIdsByFamily(FieldFamily.StreetWhite),
  [FieldFamily.StreetBlue]: getStreetIdsByFamily(FieldFamily.StreetBlue),
  [FieldFamily.StreetRed]: getStreetIdsByFamily(FieldFamily.StreetRed),
};

function getStreetIdsByFamily(family: FieldFamily): number[] {
  const ids: number[] = [];

  ALL_FIELDS.forEach((field, index) => {
    if (field.family === family) {
      ids.push(index);
    }
  });

  return ids;
}

function getGenericFieldIds(type: typeof StationField | typeof FactoryField | typeof StreetField | typeof ActionField): number[] {
  const ids: number[] = [];

  ALL_FIELDS.forEach((field, index) => {
    if (field instanceof type) {
      ids.push(index);
    }
  });

  return ids;
}
