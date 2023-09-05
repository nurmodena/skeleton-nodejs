import express, { response } from 'express';
import { accountController as controller } from '../controller';
import { identityClient } from '../http.clients';
const router = express.Router();

/* GET home page. */
router.post('/login', controller.login);
router.get('/logout', controller.logout);
router.post('/refresh', controller.refresh);

router.get('/modena/users', (req, res, next) => {
    const query = req.query;
    identityClient.get('/modena/users', { params: query }).then(response => {
        res.json(response.data)
    }).catch(err => {
        next(err.response?.data)
    });
});

export default router;