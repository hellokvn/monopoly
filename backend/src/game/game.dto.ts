import { IsMongoId } from 'class-validator';

export class JoinGameDto {
  @IsMongoId()
  public readonly gameId: string;
}
