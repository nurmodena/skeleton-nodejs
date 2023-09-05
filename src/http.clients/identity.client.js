import axios from 'axios';
import { configDotenv } from 'dotenv';

configDotenv();

const { IDENTITY_SERVICE_URL, IDENTITY_SECURTY_CODE } = process.env;
const client = axios.create({
    baseURL: IDENTITY_SERVICE_URL,
    headers: {
        'Security-Code': IDENTITY_SECURTY_CODE
    },
    timeout: 600
});

export default client;
