import { jwtHelper } from "../helper";

const publicUrls = [
    '/v1/account/login',
    '/v1/account/refresh'
];

const AuthMiddleware = (req, res, next) => {
    try {
        if (publicUrls.includes(req.originalUrl)) {
            return next();
        }

        const authHeader = req.headers['authorization'];
        if (authHeader) {
            const [bearer, token] = authHeader && authHeader.split(' ');
            if (token == null) {
                next({
                    status: 401,
                    success: false,
                    message: 'Token not found'
                })
            } else {
                const decode = jwtHelper.decryptToken(token);
                if (decode == null) {
                    next({
                        status: 401,
                        success: false,
                        message: 'Invalid token or token already expired!'
                    })
                } else {
                    //attach user info to request object
                    const { userid, userName, position, department, email, roleId, role } = decode;
                    req.user = {
                        userid, userName, position, department, email, roleId, role
                    };
                    next();
                }
            }
        } else {
            next({
                status: 401,
                success: false,
                message: 'Authorization not found'
            })
        }
    } catch (error) {
        res.status(401).json({
            status: 401,
            success: false,
            message: 'Invalid token',
            error
        });
    }

}

export default AuthMiddleware;