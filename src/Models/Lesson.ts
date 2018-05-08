import { Document, Schema, model } from 'mongoose'
import { INote, NoteSchema } from './Note'

export interface ILesson extends Document {
	Name: String
	Notes: INote[]
	Faults: Number
	AcadUser: String
}

const LessonSchema = new Schema({
	Name: String,
	Notes: [NoteSchema],
	Faults: Number,
	AcadUser: String,
})

LessonSchema.methods.toString = function(): string {
	let lessonString = `*${this.Name}* \n`
	if (this.Faults) lessonString += `${this.Faults} Faltas \n`
	if (this.Notes.length === 0) return lessonString + 'Sem notas\n'
	this.Notes.forEach((note: String) => {
		lessonString += note.toString()
	})
	return lessonString
}

export const Lesson = model<ILesson>('Lesson', LessonSchema)
