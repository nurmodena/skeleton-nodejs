import axios from 'axios';
import { configDotenv } from 'dotenv';

configDotenv();

const { WORKFLOW_SERVICE_URL, WORKFLOW_SECURTY_CODE } = process.env;
const client = axios.create({
    baseURL: WORKFLOW_SERVICE_URL,
    headers: {
        'Security-Code': WORKFLOW_SECURTY_CODE
    },
    timeout: 600
});

export default client;
