import { Schema, model, Document } from 'mongoose'
import { NoteSchema, INote } from './Note'

export interface ILesson extends Document {
	Name: String
	Notes: [INote]
	StudentIdentity: String
}

const LessonSchema = new Schema({
	Name: String,
	Notes: [NoteSchema],
	StudentIdentity: String,
})

LessonSchema.methods.toString = function(): string {
	let lessonString = `${this.Name} \n`
	if (this.Notes.length === 0) return lessonString + 'Sem notas'
	this.Notes.forEach((note: String) => {
		lessonString += note.toString()
	})
	return lessonString
}

export const Lesson = model<ILesson>('Lesson', LessonSchema)
