import { Request, Response } from 'express'
import { Lesson } from '../Models/Lesson'

export const ListLessons = async (request: Request, response: Response) => {
	try {
		const lessons = await Lesson.find()
		response.json(lessons)
	} catch (error) {
		response.send(error)
	}
}

export const GetLessonByStudent = async (
	request: Request,
	response: Response,
) => {
	try {
		const lessons = await Lesson.find({ AcadUser: request.params.acadUser })
		response.json(lessons)
	} catch (error) {
		response.send(error)
	}
}

export const GetParsedLessonByStudent = async (
	request: Request,
	response: Response,
) => {
	try {
		const lessons = await Lesson.find({ AcadUser: request.params.acadUser })
		const lessonString = lessons.map(lesson => lesson.toString())
		response.json(lessonString)
	} catch (error) {
		response.send(error)
	}
}
