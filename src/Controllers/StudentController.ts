import { Request, Response } from 'express'
import SigClient from '../Clients/SigClient'
import { IStudent, Student, getAcadData } from '../Models/Student'

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
	try {
		await student.save()
		await FetchStudent(student)
		response.json(student)
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

export const FetchStudent = async (student: IStudent) => {
	const { AcadUser, AcadPassword } = await getAcadData(
		student.AcadUser,
		student.AcadPassword,
	)
	console.log(`Fetching for ${AcadUser}`)
	const client = new SigClient(AcadUser, AcadPassword, student.BlipIdentity)
	await client.FetchNotes()
}
