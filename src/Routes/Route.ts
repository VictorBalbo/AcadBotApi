import { Express } from 'express'
import {
	ListLessons,
	GetLessonByStudent,
	GetParsedLessonByStudent,
} from '../controllers/LessonController'
import {
	GetStudent,
	CreateStudent,
	ListStudents,
} from '../Controllers/StudentController'

export const Route = (app: Express) => {
	app.route('/lessons').get(ListLessons)
	app.route('/lessons/:acadUser').get(GetLessonByStudent)
	app.route('/lessons/:acadUser/parsed').get(GetParsedLessonByStudent)

	app
		.route('/students')
		.get(ListStudents)
		.post(CreateStudent)
	app.route('/students/:acadUser').get(GetStudent)

	app.use(function(req, res) {
		res.status(404).send({ url: req.originalUrl + ' not found' })
	})
}
