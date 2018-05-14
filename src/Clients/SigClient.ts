import { load } from 'cheerio'
import { CONSTANTS } from '../Constants'
import { ILesson, Lesson } from '../Models/Lesson'
import { INote, Note } from '../Models/Note'
import { HttpClient } from './HttpClient'

const DISCENTE_URL =
	'https://sig.cefetmg.br/sigaa/portais/discente/discente.jsf'
const INDEX_URL = 'https://sig.cefetmg.br/sigaa/ava/index.jsf'
const LOGIN_URL = 'https://sig.cefetmg.br/sigaa/logar.do?dispatch=logOn'
const LOGOUT_URL = 'https://sig.cefetmg.br/sigaa/logar.do?dispatch=logOff'

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
		await this.httpClient.SendRequest(LOGOUT_URL)					
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
			console.log('Epa, não tem materia nenhuma D:')
			return
		}

		for (let i = 0; i < lessonsRequests.length; i++) {
			const lessonPage = await this.httpClient.SendRequest(
				DISCENTE_URL,
				lessonsRequests[i],
			)

			// Get lesson
			const lessonName = this.GetLessonName(lessonPage)
			if (!lessonName) {
				return
			}
			let lesson = await Lesson.findOne({
				Name: lessonName,
				AcadUser: this.AcadUser,
			})
			if (!lesson) {
				lesson = new Lesson({
					Name: lessonName,
					AcadUser: this.AcadUser,
				})
			}

			// Get lesson notes
			const notesRequest = this.MountNotesRequest(lessonPage)
			const notesPage = await this.httpClient.SendRequest(
				INDEX_URL,
				notesRequest,
			)
			const notes = await this.ParseNotes(notesPage)
			if (lesson.Notes.length !== notes.length) lesson.Notes = notes

			// Get lesson presence
			const presenceRequest = this.MountPresenceRequest(lessonPage)
			const presencePage = await this.httpClient.SendRequest(
				INDEX_URL,
				presenceRequest,
			)
			const faults = this.ParsePresence(presencePage)
			if (lesson.Faults !== faults) lesson.Faults = faults		
			

			if (lesson.isModified()) {
				await this.notifyUser(lesson)
				await lesson.save()
			}
		}
	}

	private MountLessonsRequests(homePage: string): Object[] {
		const $ = load(homePage)
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
		const $ = load(lessonPage)
		return {
			formMenu: 'formMenu',
			'formMenu:j_id_jsp_311393315_46': 'formMenu:j_id_jsp_311393315_67',
			'formMenu:j_id_jsp_311393315_72': 'formMenu:j_id_jsp_311393315_72',
			'javax.faces.ViewState': $('#javax\\.faces\\.ViewState').attr('value'),
		}
	}

	private MountPresenceRequest(lessonPage: string): Object {
		const $ = load(lessonPage)
		return {
			formMenu: 'formMenu',
			'formMenu:j_id_jsp_311393315_46': 'formMenu:j_id_jsp_311393315_67',
			'formMenu:j_id_jsp_311393315_70': 'formMenu:j_id_jsp_311393315_70',
			'javax.faces.ViewState': $('#javax\\.faces\\.ViewState').attr('value'),
		}
	}

	private GetLessonName(lessonPage: string): string {
		const $ = load(lessonPage)
		return $('#linkNomeTurma').text()
	}

	private async ParseNotes(notesPage: string) {
		const $ = load(notesPage)
		// Get header row with test data
		const headers = $('tr#trAval *').toArray()
		if (!headers) {
			return
		}
		// Get line with notes
		const cell = $('tbody tr td').toArray()
		let i = 0
		let note: INote
		const notes: INote[] = []
		headers.map(header => {
			if (header.tagName === 'th') {
				i++
				if (note && note.Value) {
					notes.push(note)
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
		return notes
	}

	private ParsePresence(presencePage: string) {
		const $ = load(presencePage)
		const divElement = $('fieldset div.botoes-show').first()
		const frequencyData = divElement
			.clone() // clone the element
			.children() // select all the children
			.remove() // remove all the children
			.end() // again go back to selected element
			.text() // get the text of element
			.trim() // trim left and right
			.replace(/ +(?= )/g, '') // remove multiple white spaces
			.split(' ') // Split data

		return Number(frequencyData[1]) - Number(frequencyData[0])
	}

	async notifyUser(lesson: ILesson): Promise<any> {
		await this.httpClient.Post(
			'https://msging.net/messages',
			{
				to: this.BlipIdentity,
				type: 'text/plain',
				content: lesson.toString(),
			},
			{
				authorization: CONSTANTS.AUTHORIZATION_HEADER,
			},
		)
	}
}
