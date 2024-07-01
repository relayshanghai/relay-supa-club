import apm from 'elastic-apm-node';

const useVercel = process.env.VERCEL_ENV === 'true';

if (!apm.isStarted() || useVercel) {
    apm.start({
        serviceName: process.env.ELASTIC_APM_SERVICE_NAME,
        serverUrl: process.env.ELASTIC_APM_SERVER_URL,
        secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
        apiKey: process.env.ELASTIC_APM_API_KEY,
        environment: process.env.ELASTIC_APM_ENVIRONMENT,
    });
}

export default apm;
