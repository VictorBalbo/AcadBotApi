import { Server } from './server'
import SigClient from './Clients/SigClient'
import { Student } from './Models/Student'

const server = new Server()
server.start()

Student.find((err, students) => {
	if (!students) return
	students.forEach(async student => {
		const client = new SigClient(
			student.AcadUser,
			student.AcadPassword,
			student.BlipIdentity,
		)
		await client.FetchNotes()
	})
})
