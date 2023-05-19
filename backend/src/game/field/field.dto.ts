import { ALL_FIELDS } from '@monopoly/sdk';
import { Trim } from 'class-sanitizer';
import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

export class FieldDto {
  @IsNumber()
  @Min(0)
  @Max(ALL_FIELDS.length)
  public readonly fieldIndex: number;
}
