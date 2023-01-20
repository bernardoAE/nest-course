import { IsString, IsBoolean } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsBoolean()
  isPublished: boolean;
}
