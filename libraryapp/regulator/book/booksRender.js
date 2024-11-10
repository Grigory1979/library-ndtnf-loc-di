import { map } from '../../other/saveBooks';
import { find, create, findById, findByIdAndUpdate, findByIdAndDelete, findOne } from '../../models/book';
import { find as _find } from '../../models/message';
import { findOne as _findOne } from '../../models/user';

const PORT = process.env.CNT_PORT || 3000;
const BASE_URL = process.env.BASE_URL || "http://counter";

// Страница просмотр всех книг в библиотеке
export function renderLibrary(req, res) {
    find()
        .then((books) => res.status(200).render('books/index', {
            title: 'Библиотека',
            books,
        }))
        .catch((e) => {
            console.log(e);
        });
}

// Страница добавления книги
export function renderPageCreateBook(req, res) {
    res.render('books/create', {
        title: 'Добавление книги',
        book: {},
    });
}

// Создание книги
export function createPage(req, res) {
    const {
        title, description, authors, favorite,
        fileCover, fileName,
    } = req.body;
    const fileBook = req.file ? req.file.path : '';
    create({
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook,
    }).then(() => res.redirect('/books'))
        .catch((e) => {
            console.log(e);
        });
}

// Страница просмотра книги
export async function renderPageBook(req, res) {
    const { id } = req.params;
    try {
        const book = await findById(id).orFail();
        let cnt = 0;
        try {
            const response = await fetch(`${BASE_URL}:${PORT}/counter/${id}/incr`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            cnt = data.cnt;
        } catch (error) {
            console.log(error);
        }
        user = req.isAuthenticated() ? req.user : null;

        const messages = await _find( {bookid: id} ).sort({ createdAt: -1 })
        for (const message of messages) {
            const user = await _findOne({ username: message.username });
            if (user) {
                message.username = user.displayName;
            }
        }

        res.render('books/view', {
            title: `Книга | ${book.title}`,
            book,
            user,
            messages,
            count: cnt,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/404');
    }
}

//Редактирование книги
export function renderEdite(req, res) {
    const { id } = req.params;
    findById(id).orFail()
        .then((book) => res.render('books/update', {
            title: `Книга | ${book.title}`,
            book,
        }))
        .catch((e) => {
            console.log(e);
            res.redirect('/404');
        });
}

// Страница  редактирование книги
export function renderPageEditeBook(req, res) {
    const { id } = req.params;
    const {
        title, description, authors, favorite,
        fileCover, fileName,
    } = req.body;
    const isFavorite = favorite === 'on' || Boolean(favorite);
    const fileBook = req.file ? req.file.path : null;
    findByIdAndUpdate(id, {
        title,
        description,
        authors,
        favorite: isFavorite,
        fileCover,
        fileName,
        fileBook,
    }).orFail()
        .then(() => res.redirect(`/books/${id}`))
        .catch((e) => {
            console.log(e);
            res.redirect('/404');
        });
}

// Страница удаление книги
export async function deleteBook(req, res) {
    const { id } = req.params;
    try {
        await findByIdAndDelete(id).orFail();
        res.redirect('/books');
    } catch (error) {
        console.log(error);
        res.redirect('/404');
    }
}

// Добавление книг в локальное хранилище saveBooks
export async function addBooks() {
    try {
        const promises = map(async (book) => {
            const existingBook = await findOne({ title: book.title });
            if (!existingBook) {
                await create(book);
                console.log(`Книга "${book.title}" успешно добавлена в базу данных`);
            } else {
                console.log(`Книга "${book.title}" уже существует в базе данных`);
            }
        });

        await Promise.all(promises);
    } catch (error) {
        console.error('Ошибка при добавлении книг:', error);
    }
}