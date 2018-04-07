import { Request, Response } from 'express'
import { Student } from '../Models/Student'

export const ListStudents = (request: Request, response: Response) => {
	Student.find({}, (error, student) => {
		if (error) response.send(error)
		response.json(student)
	})
}

export const CreateStudent = (request: Request, response: Response) => {
	const new_student = new Student(request.body)
	new_student.save(function(error, student) {
		if (student) response.send(error)
		response.json(student)
	})
}

export const GetStudent = (request: Request, response: Response) => {
	Student.find(
		{ BlipIdentity: request.params.studentIdentity },
		(error, student) => {
			if (error) response.send(error)
			response.json(student)
		},
	)
}
