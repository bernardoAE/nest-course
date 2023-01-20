import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(@Inject('NOTE_REPOSITORY') private repo: Repository<Note>) {}

  create(createNoteDto: CreateNoteDto) {
    const note = this.repo.create(createNoteDto);
    const currentDate = new Date();
    const newNote = {
      ...note,
      createdAt: currentDate,
      updatedAt: currentDate,
    } as Note;

    return this.repo.save(newNote);
  }

  findAll(): Promise<Note[]> {
    return this.repo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
