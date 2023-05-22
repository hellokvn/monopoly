import { v1 } from 'uuid';
import { ALL_FIELDS, FAMILY_STREET_IDS, FieldFamily } from '../../../fields';
import { Auction } from '../auction/auction.entity';
import { GameField } from '../field/field.entity';
import { Player } from '../player/player.entity';
import { Trade } from '../trade';
import { GameStatus } from './game.enum';

function getFields(): GameField[] {
  const fields: GameField[] = [];

  ALL_FIELDS.forEach((field, index) => fields.push(new GameField(index)));

  return fields;
}

export class Game {
  public id: string;
  public creatorClientId: string;
  public status: GameStatus;
  public players: Player[];
  public rounds: number;
  public bankAmount: number;
  public currentPlayerIndex: number;
  public currentFieldIndex: number;
  public order: number[];
  public fields: GameField[];
  public auction: Auction | null;
  public auctionWaitlist: Auction[];
  public trades: Trade[];
  public logs: string[];
  public createdAt: Date;
  public startedAt: Date | null;

  constructor(creatorClientId: string) {
    this.id = `GAME-${v1()}`;
    this.creatorClientId = creatorClientId;
    this.status = GameStatus.Waiting;
    this.fields = getFields();
    this.currentFieldIndex = 0;
    this.currentPlayerIndex = 0;
    this.bankAmount = 0;
    this.rounds = 0;
    this.players = [];
    this.auctionWaitlist = [];
    this.order = [];
    this.logs = [];
    this.trades = [];
    this.createdAt = new Date();
  }

  public hasFullStreet(player: Player, family: FieldFamily): boolean {
    const familyFields: number[] = FAMILY_STREET_IDS[family];
    let hasFullStreet: boolean = true;

    familyFields.forEach((index) => {
      const { ownedByPlayerIndex } = this.fields[index];

      if (ownedByPlayerIndex === player.index) {
        hasFullStreet = false;
      }
    });

    return hasFullStreet;
  }

  public increaseBankAmount(value: number): void {
    this.bankAmount = this.bankAmount + value;
  }

  public setBankAmount(value: number): void {
    this.bankAmount = value;
  }

  public getFieldsByPlayer(playerIndex: number): GameField[] {
    return this.fields.filter(({ ownedByPlayerIndex }) => ownedByPlayerIndex === playerIndex);
  }

  public getBuiltFieldsByPlayer(playerIndex: number): GameField[] {
    return this.fields.filter(({ ownedByPlayerIndex, houses }) => ownedByPlayerIndex === playerIndex && houses > 0);
  }

  public getPledgeableFieldsByPlayer(playerIndex: number): GameField[] {
    const fields = this.fields.filter(({ ownedByPlayerIndex, houses }) => ownedByPlayerIndex === playerIndex && houses === 0);
    const results: GameField[] = [];

    fields.forEach((data) => {
      const field = ALL_FIELDS[data.index];
      const familyStreets = FAMILY_STREET_IDS[field.family];
      let canPledge = true;

      familyStreets.forEach((familyFieldIndex) => {
        if (this.fields[familyFieldIndex].houses === 0) {
          canPledge = false;
        }
      });

      if (canPledge) {
        results.push(data);
      }
    });

    return fields;
  }
}
