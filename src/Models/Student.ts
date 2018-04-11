import { Document, Schema, model } from 'mongoose'
import { CONSTANTS } from '../Constants'

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
	this.AcadUser = Buffer.from(this.AcadUser).toString(CONSTANTS.ENCODING)
	this.AcadPassword = Buffer.from(this.AcadPassword).toString(
		CONSTANTS.ENCODING,
	)
	next()
})

export const getAcadData = (AcadUser: string, AcadPassword: string) => {
	return {
		AcadUser: Buffer.from(AcadUser, CONSTANTS.ENCODING).toString(),
		AcadPassword: Buffer.from(AcadPassword, CONSTANTS.ENCODING).toString(),
	}
}

export const Student = model<IStudent>('Student', StudentSchema)
