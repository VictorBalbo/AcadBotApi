import { Schema, model, Document } from 'mongoose'

export interface IStudent extends Document {
	Name: string
	BlipIdentity: string
	AcadUser: string
	AcadPassword: string
}

const StudentSchema = new Schema({
	_id: String,
	Name: String,
	BlipIdentity: String,
	AcadUser: String,
	AcadPassword: String,
})

StudentSchema.pre('save', function(this: any, next) {
	this.AcadUser = Buffer.from(this.AcadUser).toString('base64')
	this.AcadPassword = Buffer.from(this.AcadPassword).toString('base64')
	next()
})

StudentSchema.post('find', function(this: any) {
	this.AcadUser = Buffer.from(this.AcadUser, 'base64').toString()
	this.AcadPassword = Buffer.from(this.AcadPassword, 'base64').toString()
})

export const Student = model<IStudent>('Student', StudentSchema)
