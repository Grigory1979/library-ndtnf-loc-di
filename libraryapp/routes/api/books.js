import { Router } from 'express';
const router = Router();

import { single } from '../../middleware/file';

import { getBooks, getBook, editeBook, createBook, deleteBook } from '../../regulator/book/apiBooks';

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/',single('fileBook') ,createBook);
router.put('/:id',single('fileBook') ,editeBook);
router.delete('/:id', deleteBook);

export default router;