import express, { json, urlencoded } from 'express';
import createError from 'http-errors';
import cors from 'cors';
import logger from 'morgan';
import { configDotenv } from 'dotenv';
import { AuthMiddleware } from './middleware'
import { userRouter, roleRouter, accountRouter } from './routers'

configDotenv();
const app = express();
app.use(cors());
// app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(AuthMiddleware);

const PORT = process.env.PORT || 4000;

app.get('/', async (req, res) => {
    res.json({ status: true, message: "All is worked!", env: process.env })
});

app.use('/v1/account', accountRouter);
app.use('/v1/user', userRouter);
app.use('/role', roleRouter);

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//     next(createError(500));
// });

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log('App error handler', err)
    // render the error page
    res.status(err.status || 500).json(err);
});

app.listen(PORT, () => console.log(`App listening at port ${PORT}`));