import { find, create } from '../../models/message';

// Получение сообщение
export function getMessage(req, res) {
    const { id } = req.params;
    find( {bookid: id} )
        .then((messages) => res.status(200).json(messages))
        .catch((e) => {
            console.log(e);
        });
}

// Отправка сообщений
export function sendMessage(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(403).json('Нет доступа');
    }
    const {
        bookid, username, message
    } = req.body;
    create({
        bookid, username, message
    }).then((newMessage) => res.status(201).json(newMessage))
        .catch((e) => {
            console.log(e);
        });
}