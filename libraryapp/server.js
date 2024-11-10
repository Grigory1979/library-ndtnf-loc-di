import express, { urlencoded, json, static } from 'express';
import { connect } from 'mongoose';
import { Server } from 'http';
import socketIo from 'socket.io';

import session from 'express-session';
import { use, serializeUser, deserializeUser, initialize, session as _session } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import indexRouter from './routes/index';
import bookRouter from './routes/books';
import userRouter from './routes/user';

import books from './routes/api/books';
import user from './routes/api/user';
import error from './middleware/error';
import message from './routes/api/message';
import logger from './middleware/logger';

import { addBooks } from './regulator/book/booksRender';
import { verifyUser, serializeUser as _serializeUser } from './regulator/user/userRender';

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_URL || 'mongodb://root:example@mongo:27017';

const options = {
  usernameField: "username",
  passwordField: "password"
}

use('local', new LocalStrategy(options, verifyUser));

serializeUser(_serializeUser);
deserializeUser(_serializeUser)


const app = express();
const server = Server(app);
const io = socketIo(server);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(urlencoded({ extended: true }));
app.use(json());

app.use(session({
  secret: 'SECRET',
  resave: false,
  saveUninitialized: false,
}));

app.use(initialize());
app.use(_session());

app.use(logger);
app.use('/', indexRouter);
app.use('/books', bookRouter);
app.use('/user', userRouter);
app.use('/public', static(`${__dirname}/public`));
app.use('/api/books', books);
app.use('/api/user', user);
app.use('/api/message', message);
app.use(error);

async function start() {
  try {
    console.log(DB_URL);
    await connect(DB_URL);
    addBooks();

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

  } catch (error) {
    console.log(error);
  }
}

start();

io.on('connection', (socket) => {
  const { id } = socket;
  console.log(`Socket connected: ${id}`);

  const { bookId } = socket.handshake.query;
  console.log(`Socket roomName: ${bookId}`);
  socket.join(bookId);
  socket.on('message-to-book', (msg) => {
    socket.to(bookId).emit('message-to-book', msg);
    socket.emit('message-to-book', msg);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${id}`);
  });
});