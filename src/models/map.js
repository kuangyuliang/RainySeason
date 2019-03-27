import * as service from '@/services/map';
import { AIR_LAYER_URL } from '@/constants';

export default {
    namespace: "map",
    state: {
        stationData: []
    },
    reducers: {
        refresh(state, { payload: { data: stationData } }) {
            return { ...state, stationData };
        },
        changeAirData(state, airLayerData) {
            return { ...state, airLayerData };
        }
    },
    effects: {
        *fetch({ }, { call, put }) {
            const data = yield call(service.stations);
            yield put({
                type: 'refresh', payload: {
                    data
                }
            });
        },
        *getAirLayer({ payload: { params }, callback }, { call }) {
            const data = yield call(service.getAirLayerData, params);
            if (callback) callback(`${AIR_LAYER_URL}render/getimg?hash=${data.hash}`);
        },
        *getWindyLayer({ payload: { date }, callback }, { call }) {
            let data;
            let params = {
                dir: date.format('YYYYMMDD'),
                file: date.format('YYYYMMDDHH0000')
            };
            try {
                data = yield call(service.getWindyData, params);
            } catch{
                params = {
                    ...params,
                    dir: date.subtract(1, 'day').format('YYYYMMDD')
                };
                data = yield call(service.getWindyData, params);
            }
            if (callback) callback(data);
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/') {
                    dispatch({ type: 'fetch' });
                }
            });
        }
    }
};