import { Schema, model, Document } from 'mongoose'

export interface INote extends Document {
	Name: string
	Value: string
	Max: string
}

export const NoteSchema = new Schema({
	Name: String,
	Value: String,
	Max: String,
})

NoteSchema.methods.toString = function(): String {
	if (!this.Value) return ''

	if (!this.Max) return `${this.Name}: ${this.Value} \n`
	else return `${this.Name}: ${this.Value}/${this.Max} \n`
}

export const Note = model<INote>('Note', NoteSchema)
