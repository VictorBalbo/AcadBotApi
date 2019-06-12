import { Document, Schema, model } from 'mongoose'
import { INote, NoteSchema } from './Note'

export interface ILesson extends Document {
	Name: String
	Notes: INote[]
	Faults: Number
	LastNews: String
	AcadUser: String
}

const LessonSchema = new Schema({
	Name: String,
	Notes: [NoteSchema],
	Faults: Number,
	LastNews: String,
	AcadUser: String,
})

LessonSchema.methods.toString = function(): string {
	let lessonString = `*${this.Name}* \n`
	if (this.Faults) lessonString += `${this.Faults} Faltas \n`
	if (this.Notes.length === 0) return lessonString + 'Sem notas\n'
	let sumValue = 0
	let sumMax = 0
	this.Notes.forEach((note: INote) => {
		lessonString += note.toString()
		sumValue += parseFloat(note.Value.replace(',', '.'))
		sumMax += parseFloat(note.Max ? note.Max.replace(',', '.') : '0.0') 
	})
	lessonString += `Total: ${sumValue.toFixed(2)}`
	if (sumMax > 0) lessonString += `/${sumMax.toFixed(2)}`
	return lessonString
}

export const Lesson = model<ILesson>('Lesson', LessonSchema)
