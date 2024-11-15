import multer, { diskStorage } from 'multer';

const storage = diskStorage({
	destination(req, file, cb) {
		cb(null, 'public/books')
	},
	filename(req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`)
	}
})
export default multer({storage});