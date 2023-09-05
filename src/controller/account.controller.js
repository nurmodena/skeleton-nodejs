import jwt from 'jsonwebtoken';
import { identityClient } from '../http.clients';
import { mongodb, redis } from '../connection';
import { jwtHelper } from '../helper';

const AccountController = {
    login: (req, res, next) => {
        try {
            const payload = req.body;
            identityClient.post('/user/validate', payload).then(async result => {
                const { user } = result.data;
                if (user) {
                    const payload = {
                        userid: user.emp_no,
                        userName: `${user.first_name} ${user.middle_name} ${user.last_name}`,
                        position: user.employee_position,
                        department: user.organization_unit,
                        email: user.email,
                        roleId: 1,
                        role: 'Administrator'
                    };
                    const [data, token] = jwtHelper.createToken(payload);
                    const [emailName] = user.email.split('@');
                    const [refresh_key, refresh_token] = await jwtHelper.createRefreshToken(emailName);
                    res.json({
                        status: 200,
                        success: true,
                        message: 'Login success!',
                        ...data,
                        access_token: token,
                        refresh_token
                    });
                } else {
                    next({ status: 401, success: false, message: 'User not registered' })
                }
            }).catch(err => {
                console.log('2. error', err);
                next(err.response ? err.response.data : err)
            })
        } catch (error) {
            console.log('3. error', error);
            next(error);
        }
    },
    logout: (req, res, next) => {
        try {
            const { email } = req.user;
            const [emailName] = email.split('@');
            const refresh_key = `refresh_token_${emailName}`;
            redis.del(refresh_key).then((val) => { }).catch(err => { });
            res.json({ status: 201, success: true, message: 'You already loged out' });
        } catch (error) {
            next(error);
        }
    },
    refresh: async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization'];
            const { refresh_token } = req.body;
            if (authHeader) {
                const [bearer, token] = authHeader.split(' ');
                if (token && token != 'null') {
                    const [header, payload, signature] = token.split('.');
                    const strPayload = Buffer.from(payload, 'base64').toString('utf8');
                    const data = JSON.parse(strPayload);
                    const { email } = data;
                    const [emailName] = email.split('@');
                    const valid = await jwtHelper.checkRefreshToken(emailName, refresh_token);
                    if (valid) {
                        identityClient.get('/user/' + email).then(async result => {
                            const user = result.data;
                            if (user) {
                                const payload = {
                                    userid: user.emp_no,
                                    userName: `${user.first_name} ${user.middle_name} ${user.last_name}`,
                                    position: user.employee_position,
                                    department: user.organization_unit,
                                    email: user.email,
                                    roleId: 1,
                                    role: 'Administrator'
                                };
                                const [data, token] = jwtHelper.createToken(payload);
                                res.json({
                                    status: 200,
                                    success: true,
                                    message: 'Login success!',
                                    ...data,
                                    access_token: token,
                                    refresh_token
                                });
                            } else {
                                next({ status: 401, success: false, message: 'User not registered' })
                            }
                        }).catch(err => {
                            console.log('2. error', err);
                            next(err.response ? err.response.data : err)
                        })
                    } else {
                        next({ status: 401, success: false, message: 'Invalid refresh token' })
                    }

                } else {
                    next({ status: 401, success: false, message: 'Token not found' })
                }
            } else {
                next({ status: 401, success: false, message: 'Authorization not found' })
            }

        } catch (error) {
            next({ status: 500, success: false, message: 'Internal server error', error })
        }
    }
}

export default AccountController;