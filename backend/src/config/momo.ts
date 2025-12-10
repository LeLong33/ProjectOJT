import crypto from 'crypto';

export const momoConfig = {
    partnerCode: 'MOMOBKUN20180529',
    accessKey: 'klm05TvNBzhg7h7j',
    secretKey: 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa',
    endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create',
    redirectUrl: 'http://localhost:5173/payment-result',
    ipnUrl: 'http://localhost:5173/payment-result', 
};

export const generateMomoSignature = (data: string): string => {
    return crypto
        .createHmac('sha256', momoConfig.secretKey)
        .update(data)
        .digest('hex');
};