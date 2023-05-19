import { Trim } from 'class-sanitizer';
import { IsString, MaxLength } from 'class-validator';

export class ChatAddDto {
  @IsString()
  @MaxLength(250)
  @Trim()
  public readonly message: string;
}
