import { Express } from 'express'
import {
	ListLessons,
	GetLessonByStudent,
} from '../controllers/LessonController'
import {
	GetStudent,
	CreateStudent,
	ListStudents,
} from '../Controllers/StudentController'

export const Route = (app: Express) => {
	app.route('/lessons').get(ListLessons)
	app.route('/lessons/:studentIdentity').get(GetLessonByStudent)

	app
		.route('/students')
		.get(ListStudents)
		.post(CreateStudent)
	app.route('/students/:studentIdentity').get(GetStudent)
	
	app.use(function(req, res) {
		res.status(404).send({ url: req.originalUrl + ' not found' })
	})
}
