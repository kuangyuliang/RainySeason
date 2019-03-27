import request from '@/utils/request';
import serialize from '@/utils/serialize';

export async function stations() {
    return request('/api/getStationInfos');
}

export async function getAirLayerData(params) {
    return request('/air/render/postspa', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: serialize(params),
    });
}

export async function getWindyData(params) {
    return request(`/windy/WindData/${params.dir}/Json/${params.file}.json`);
}