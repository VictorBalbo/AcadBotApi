import { Server } from './server'
import { Student } from './Models/Student'
import { FetchStudent } from './Controllers/StudentController'

const server = new Server()
server.start()

setInterval(async () => {
	try {
		const students = await Student.find()
		students.forEach(async student => {
			await FetchStudent(student)
		})
	} catch (error) {
		console.log(error)
	}
},          1200000) // 20 mins
