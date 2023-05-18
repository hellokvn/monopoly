import { BankAction } from './bank.action';
import { Action } from './base.action';
import { BonusAction } from './bonus.action';
import { MoveToAction } from './move-to.action';
import { MoveAction } from './move.action';
import { TaxAction } from './tax.action';

export const ACTIONS: Action[] = [
  new MoveAction('Go 5 Felder nach vorne.', 5, true),
  new MoveAction('Go 5 Felder zurück.', 5, false),
  new MoveAction('Go 3 Felder nach vorne.', 3, true),
  new MoveAction('Go 3 Felder zurück.', 3, false),
  new MoveToAction('Gehe direkt zur Bank.', 21),
  new MoveToAction('Go to bext Station.', 5),
  new MoveToAction('Go to Station 1', 7),
  new MoveToAction('Go to Station 2', 16),
  new MoveToAction('Go to Station 3', 27),
  new MoveToAction('Go to Station 4', 38),
  new MoveToAction('Go to Street 26.', 26),
  new MoveToAction('Go to Street 41.', 41),
  new MoveToAction('Go to Start.', 0),
  new MoveToAction('You die.', 12, false),
  new BankAction('Get 250 Gold von der Bank.', 250, true),
  new BankAction('Get 500 Gold von der Bank.', 500, true),
  new BankAction('Get 1.000 Gold von der Bank.', 1000, true),
  new BankAction('Get 1.500 Gold von der Bank.', 1500, true),
  new BankAction('Pay 250 Gold an die Bank.', 250, false),
  new BankAction('Pay 500 Gold an die Bank.', 500, false),
  new BankAction('Pay 1.000 Gold an die Bank.', 1000, false),
  new BankAction('Pay 1.500 Gold an die Bank.', 1500, false),
  new BankAction('Pay 250 Gold für jedes Grundstück, das du besitzt, an die Bank.', 250, false, true),
  new TaxAction('Pay taxes! 250 Gold pro Haus und 1.000 Gold pro Hotel.', [250, 1000]),
  new TaxAction('Pay taxes! 350 Gold pro Haus und 1.200 Gold pro Hotel.', [350, 1200]),
  new BonusAction('You get anti poison.', 0),
];
