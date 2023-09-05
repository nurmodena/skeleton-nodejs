import { createHash } from "crypto";
import { configDotenv } from 'dotenv';
import { sign, verify, decode } from 'jsonwebtoken';
import { redis } from "../connection";
import { log } from "console";

configDotenv();
const { JWT_EXP_TOKEN, JWT_EXP_REFRESH_TOKEN, JWT_SECRET_KEY } = process.env;
const jwt = {
    createToken: (payload = {}) => {
        payload.exp = Math.floor(Date.now() / 1000) + parseInt(JWT_EXP_TOKEN || 3600);
        payload.iat = Math.floor((Date.now() / 1000));
        payload.iss = 'https://accordo.modena.com';
        payload.aud = 'https://accordo.modena.com';
        const token = sign(payload, JWT_SECRET_KEY);
        return [payload, token];
    },
    decryptToken: token => {
        try {
            const decoded = verify(token, JWT_SECRET_KEY);
            return decoded;
        } catch (error) {
            throw error;
        }
    },
    createRefreshToken: async (emailName) => {
        try {
            const refresh_key = `refresh_token_${emailName}`;
            const refreshToken = await redis.get(refresh_key);
            if (refreshToken) {
                return [refresh_key, refreshToken];
            }
            const refresh_value = `${emailName}-${Date.now()}`;
            const refresh_token = Buffer.from(createHash('sha256').update(refresh_value).digest('hex')).toString();
            await redis.set(refresh_key, refresh_token, { EX: parseInt(JWT_EXP_REFRESH_TOKEN || 86400) });
            return [refresh_key, refresh_token];
        } catch (error) {
            console.log('error on create refresh token', error)
            throw error;
        }
    },
    checkRefreshToken: async (emailName, refresh_token) => {
        try {
            const refresh_key = `refresh_token_${emailName}`;
            const refreshToken = await redis.get(refresh_key);
            return (refreshToken == refresh_token) ? true : false;
        } catch (error) {
            console.log('error on check refresh token', error)
            // throw error;
            return false;
        }
    }
};

export default jwt;