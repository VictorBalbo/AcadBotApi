import { Request, Response } from 'express'
import { Student } from '../Models/Student'
import SigClient from '../Clients/SigClient'

export const ListStudents = async (request: Request, response: Response) => {
	try {
		const student = await Student.find()
		response.json(student)
	} catch (error) {
		response.send(error)
	}
}

export const CreateStudent = async (request: Request, response: Response) => {
	const student = new Student(request.body)
	student._id = student.AcadUser
	const AcadUser = student.AcadUser
	const AcadPassword = student.AcadPassword
	try {
		await student.save()
		response.json(student)
		await FetchStudent({
			BlipIdentity: student.BlipIdentity,
			AcadUser,
			AcadPassword,
		})
	} catch (error) {
		response.send(error)
	}
}

export const GetStudent = async (request: Request, response: Response) => {
	try {
		const student = await Student.findById(request.params.acadUser)
		response.json(student)
	} catch (error) {
		response.send(error)
	}
}

export const FetchStudent = async ({
	AcadUser,
	AcadPassword,
	BlipIdentity,
}) => {
	console.log(`Fetching for ${AcadUser}`)
	const client = new SigClient(AcadUser, AcadPassword, BlipIdentity)
	await client.FetchNotes()
}
