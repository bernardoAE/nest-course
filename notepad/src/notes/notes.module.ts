import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { DatabaseModule } from 'src/database.module';
import { noteProviders } from './note.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [NotesController],
  providers: [...noteProviders, NotesService],
})
export class NotesModule {}
