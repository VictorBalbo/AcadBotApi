import { Express } from 'express'
import {
	CreateStudent,
	GetStudent,
	ListStudents,
} from '../Controllers/StudentController'
import {
	GetLessonByStudent,
	GetParsedLessonByStudent,
	ListLessons,
} from '../Controllers/LessonController'

export const Route = (app: Express) => {
	app.route('/lessons').get(ListLessons)
	app.route('/lessons/:acadUser').get(GetLessonByStudent)
	app.route('/lessons/:acadUser/parsed').get(GetParsedLessonByStudent)

	app
		.route('/students')
		.get(ListStudents)
		.post(CreateStudent)
	app.route('/students/:acadUser').get(GetStudent)

	app.route('/').get((request, response) => {
		response.send('Hello world!')
	})

	app.use(function(req, res) {
		res.status(404).send({ url: req.originalUrl + ' not found' })
	})
}
