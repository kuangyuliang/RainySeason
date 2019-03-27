import request from '@/utils/request';

export async function login(params) {
    return request('/api/TokenAuth/Authenticate', {
        method: 'POST',
        body: JSON.stringify(params),
    });
}