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
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
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
