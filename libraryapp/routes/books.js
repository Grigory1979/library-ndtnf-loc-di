import { Router } from 'express';
const router = Router();
import { single } from '../middleware/file';

import { renderLibrary, renderPageCreateBook, createPage, renderPageBook, renderEdite, renderPageEditeBook, deleteBook } from '../regulator/book/booksRender';


router.get('/', renderLibrary);
router.get('/create', renderPageCreateBook);
router.post('/create', single('fileBook'), createPage);

router.get('/:id', renderPageBook );
router.get('/update/:id', renderEdite);
router.post('/update/:id', single('fileBook'), renderPageEditeBook);
router.post('/delete/:id', deleteBook);

export default router