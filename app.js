const express = require('express');
const cors = require('cors');
const morgan = require('morgan')

const {NotFoundError} = require('./expressError');

const {authJWT} = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const charRoutes = require('./routes/characters');
const traitRoutes = require('./routes/traits');
const featRoutes = require('./routes/features');
const atkRoutes = require('./routes/attacks');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJWT);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/characters', charRoutes);
app.use('/traits', traitRoutes);
app.use('/features', featRoutes);
app.use('/attacks', atkRoutes);

app.use((req,res,next)=>{
    return next(new NotFoundError());
});

app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
    return res.status(status).json({
      error: { message, status },
    });
  });
  
  module.exports = app;