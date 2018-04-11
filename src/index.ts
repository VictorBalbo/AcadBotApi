import { FetchStudent } from './Controllers/StudentController'
import { Student } from './Models/Student'
import { Server } from './server'

const server = new Server()
server.start()

async function updateNotes() {
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
