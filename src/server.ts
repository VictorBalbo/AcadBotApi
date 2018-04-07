import * as express from 'express'
import * as bodyParser from 'body-parser'
import { Route } from './Routes/Route'

const app = express()
const mongoose = require('mongoose')

const port = process.env.PORT || 3000

export class Server {
	constructor() {
		mongoose.Promise = global.Promise
		mongoose.connect('mongodb://localhost/Acadbot')

		app.use(bodyParser.urlencoded({ extended: true }))
		app.use(bodyParser.json())
	}

	start() {
		Route(app)
	
		app.listen(port, () => {
			console.log('API server started on: ' + port)
		})
	}
}
