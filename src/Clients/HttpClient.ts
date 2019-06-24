import { CookieJar } from 'request'
import * as Request from 'request-promise-native'
import * as he from 'he' // Decode html

export class HttpClient {
	cookieJar: CookieJar

	constructor(cookieJar?: CookieJar) {
		this.cookieJar = cookieJar || Request.jar()
	}

	async SendRequest(uri: string, form?: Object) {
		const options = {
			method: 'POST',
			uri,
			form,
			followAllRedirects: true,
			headers: {
				'User-Agent': 
					// tslint:disable-next-line:max-line-length
					'SigBot (https://github.com/VictorBalbo/AcadBotApi)',
			},
			jar: this.cookieJar, // Use cookies
		}
		return Request(options)
	}

	async Post(uri: string, body: Object, headers: Object = {}) {
		const options = {
			method: 'POST',
			uri,
			body,
			json: true,
			headers,
		}
		return Request(options)
	}

	DecodeHtml(text: string) {
		return he.decode(text)
	}
}
