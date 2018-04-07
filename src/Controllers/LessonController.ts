import { Request, Response } from 'express'
import { Lesson } from '../Models/Lesson'

export const ListLessons = (request: Request, response: Response) => {
	Lesson.find({}, (error, lesson) => {
		if (error) response.send(error)
		response.json(lesson)
	})
}

export const GetLessonByStudent = (request: Request, response: Response) => {
	Lesson.find(
		{ StudentIdentity: request.params.studentIdentity },
		(error, lesson) => {
			if (error) response.send(error)
			response.json(lesson)
		},
	)
}
