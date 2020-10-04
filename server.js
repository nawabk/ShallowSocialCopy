const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const myEmitter = require('./utils/MyEmitter');

dotenv.config({ path: './config.env' });
const app = require('./app');

const server = http.createServer(app);
const io = socketIo(server);

const DB = process.env.url.replace('<password>', process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected To DB'));

const port = process.env.PORT || 3000;

const users = new Map();

io.on('connection', socket => {
  socket.on('newUserConnection', userId => {
    users.set(userId, socket);
  });
  socket.on('disconnect', () => {
    for (let [key, value] of users) {
      if (value === socket) users.delete(key);
    }
  });
});

myEmitter.on('notify', (userId, notification) => {
  if (users.has(userId)) {
    users.get(userId).emit('notification', notification);
  }
});

myEmitter.on('updateNotify', (userId, updatedNotification) => {
  if (users.has(userId)) {
    users.get(userId).emit('updateNotification', updatedNotification);
  }
});

myEmitter.on('deleteNotify', (userId, notificationId) => {
  if (users.has(userId)) {
    users.get(userId).emit('deleteNotification', notificationId);
  }
});

server.listen(port, () => {
  console.log(`App started at port ${port}`);
});

process.on('unhandledRejection', () => {
  console.log('something went wrong');
});
