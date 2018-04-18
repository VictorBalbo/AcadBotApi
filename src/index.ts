import { FetchStudent } from './Controllers/StudentController'
import { Student } from './Models/Student'
import { Server } from './server'
import * as Request from 'request-promise-native'

const server = new Server()
const expressServer = server.start()

const address = `http://${expressServer.address().address}:${expressServer.address().port}`

async function updateNotes() {
	Request({uri: address})
	try {
		const students = await Student.find()
		students.forEach(async student => {
			await FetchStudent(student)
		})
	} catch (error) {
		console.log(error)
	}
}
setInterval(updateNotes, 1200000) // 20 Mins
updateNotes()
