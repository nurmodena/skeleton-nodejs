import express, { response } from 'express';
import identityClient from '../http.clients/identity.client';
import { redis } from '../connection';
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    const query = req.query;
    identityClient.get('/modena/users', { params: query }).then(response => {
        res.json(response.data)
    }).catch(err => {
        next(err.response?.data)
    });
});

router.get('/modena/users', (req, res, next) => {
    const query = req.query;
    identityClient.get('/modena/users', { params: query }).then(response => {
        res.json(response.data)
    }).catch(err => {
        next(err.response?.data)
    });
});

export default router;