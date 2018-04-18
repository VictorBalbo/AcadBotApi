import { FetchStudent } from './Controllers/StudentController'
import { Student } from './Models/Student'
import { Server } from './server'
import * as Request from 'request-promise-native'
import { CONSTANTS } from './Constants'

const server = new Server()
server.start()

async function updateNotes() {
	Request({uri: CONSTANTS.ADDRESS})
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
