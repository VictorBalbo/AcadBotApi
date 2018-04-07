import { load as Load } from 'cheerio'
import { HttpClient } from './httpClient'
import { Note, INote } from '../Models/Note'
import { Lesson, ILesson } from '../Models/Lesson'

const DISCENTE_URL =
	'https://sig.cefetmg.br/sigaa/portais/discente/discente.jsf'
const INDEX_URL = 'https://sig.cefetmg.br/sigaa/ava/index.jsf'
const LOGIN_URL = 'https://sig.cefetmg.br/sigaa/logar.do?dispatch=logOn'

export default class AcadClient {
	httpClient: HttpClient
	AcadUser: string
	AcadPassword: string
	BlipIdentity: string

	/**
	 * Creates an instance of AcadClient.
	 * @param {string} acadUser User login in Acad system
	 * @param {string} acadPassword User password in Acad system
	 * @param {string} blipIdentity User identity on blip
	 * @memberof AcadClient
	 */
	constructor(acadUser: string, acadPassword: string, blipIdentity: string) {
		this.httpClient = new HttpClient()
		this.AcadUser = acadUser
		this.AcadPassword = acadPassword
		this.BlipIdentity = blipIdentity
	}

	/**
	 * Fetch for notes on Acad using the credentials passed
	 * @memberof SigClient
	 */
	async FetchNotes(): Promise<any> {
		await this.Login(this.AcadUser, this.AcadPassword)
		const homePage = await this.DismissNotification()
		await this.OpenLessons(homePage)
	}

	private async Login(user: string, password: string) {
		const formData: Object = {
			'user.login': user,
			'user.senha': password,
			width: '1536',
			height: '864',
			urlRedirect: '',
			subsistemaRedirect: '',
			acao: '',
			acessibilidade: '',
		}
		return this.httpClient.SendRequest(LOGIN_URL, formData)
	}

	private async DismissNotification() {
		return this.httpClient.SendRequest(DISCENTE_URL)
	}

	private async OpenLessons(homePage: string) {
		const lessonsRequests = this.MountLessonsRequests(homePage)
		if (lessonsRequests.length === 0) {
			throw Error('Epa, não tem materia nenhuma D:')
		}
		console.log(`Tem ${lessonsRequests.length} materias`)

		for (let i = 0; i < lessonsRequests.length; i++) {
			const lessonPage = await this.httpClient.SendRequest(
				DISCENTE_URL,
				lessonsRequests[i],
			)
			const notesRequest = this.MountNotesRequest(lessonPage)
			const notesPage = await this.httpClient.SendRequest(
				INDEX_URL,
				notesRequest,
			)
			this.ParseNotes(notesPage, this.GetLessonName(lessonPage))
		}
	}

	private MountLessonsRequests(homePage: string): Object[] {
		const $ = Load(homePage)
		const formList = $('form[id^=form_acessarTurmaVirtual]').toArray()
		const formData: Object[] = []
		formList.map(element => {
			const lesson: any = {}
			element.children.map(child => {
				if (child.tagName === 'input') {
					lesson[child.attribs.name] = child.attribs.value
				} else if (child.tagName === 'a') {
					lesson[child.attribs.id] = child.attribs.id
				}
			})
			formData.push(lesson)
		})
		return formData
	}

	private MountNotesRequest(lessonPage: string): Object {
		const $ = Load(lessonPage)
		return {
			formMenu: 'formMenu',
			'formMenu:j_id_jsp_311393315_46': 'formMenu:j_id_jsp_311393315_67',
			'formMenu:j_id_jsp_311393315_72': 'formMenu:j_id_jsp_311393315_72',
			'javax.faces.ViewState': $('#javax\\.faces\\.ViewState').attr('value'),
		}
	}

	private GetLessonName(lessonPage: string): string {
		const $ = Load(lessonPage)
		return $('#linkNomeTurma').text()
	}

	private async ParseNotes(notesPage: string, lessonName: string) {
		console.log(`Parsing ${lessonName}`)

		let lesson = await Lesson.findOne({ Name: lessonName, StudentIdentity: this.BlipIdentity }).exec()
		if (!lesson) lesson = new Lesson({ Name: lessonName, StudentIdentity: this.BlipIdentity })

		const $ = Load(notesPage)
		// Get header row with test data
		const headers = $('tr#trAval *').toArray()
		if (!headers) {
			console.log(lesson)
			return
		}
		// Get line with notes
		const cell = $('tr.linhaPar td').toArray()
		let i = 0
		let note: INote | undefined
		headers.map((header) => {
			if (header.tagName === 'th') {
				i++
				if (note) {
					lesson!.Notes.push(note)
				}
				if (header.attribs.id) {
					// Note
					note = new Note({
						Value: cell[i - 1].children[0].data!.replace(/\t|\n/g, ''),
					})
					note.Name = header.children[0].data || ''
					return
				} else {
					note = undefined
				}
			} else if (header.attribs.id.startsWith('den')) {
				// Input with test name
				note!.Name = this.httpClient.DecodeHtml(header.attribs.value)
			} else if (header.attribs.id.startsWith('nota')) {
				// Input with test value
				note!.Max = header.attribs.value
			}
		})
		if (lesson.isModified()) {
			this.notifyUser(lesson)
			lesson.save()
		}
	}

	async notifyUser(lesson: ILesson): Promise<any> {
		await this.httpClient.Post('https://msging.net/messages', {
			to: lesson.StudentIdentity,
			type: 'text/plain',
			content: lesson.toString(),
		})
	}
}
