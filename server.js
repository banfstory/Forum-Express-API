require("dotenv").config()
const express = require("express");
const app = express();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB);
const bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use('/assets', express.static('assets'));

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const forumsRouter = require('./routes/forums');
app.use('/forums', forumsRouter);

const postsRouter = require('./routes/posts');
app.use('/posts', postsRouter);

const commentsRouter = require('./routes/comments');
app.use('/comments', commentsRouter);

const replysRouter = require('./routes/replys');
app.use('/replys', replysRouter);

const followersRouter = require('./routes/followers');
app.use('/followers', followersRouter);

const authenticate = require('./routes/login');
app.use('/authenticate', authenticate);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));