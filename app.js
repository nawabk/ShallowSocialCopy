const express = require('express');
const cors = require('cors');
const path = require('path');

const userRouter = require('./routes/userRoutes');
const twittRouter = require('./routes/twittRoutes');
const globalErrorHandler = require('./controller/errorController');
const notificationRouter = require('./routes/notificationRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use('/api/v1/users', userRouter);
app.use('/api/v1/twitts', twittRouter);
app.use('/api/v1/notifications', notificationRouter);
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.use(globalErrorHandler);
module.exports = app;
