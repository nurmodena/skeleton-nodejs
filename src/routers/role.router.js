import express, { json } from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({
        status: 200,
        success: true,
        message: 'This is Role route!'
    })
});

export default router;