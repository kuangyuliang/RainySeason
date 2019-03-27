import request from '@/utils/request';

export async function queryMenu() {
    return request('/api/getMenu');
}