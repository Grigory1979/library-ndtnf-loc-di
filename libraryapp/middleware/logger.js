import { appendFile } from 'fs';
import { EOL } from 'os';

export default (req, res, next) => {
	const now = Date.now();
	const {url, method} = req;

	const data = `${now} ${method} ${url}`

	appendFile('server.log', data + EOL, (err) =>{
		if(err) throw err
	})

	next()
}