import * as service from '@/components/Page/services/api';

export default {
    namespace: "np",
    state: {
        list: [],
        total: null,

    },
    reducers: {
        refresh(state, { payload: { list, total, pageIndex } }) {
            return { ...state, list, total, pageIndex };
        }
    },
    effects: {
        *fetch({ payload: { method = "GET", url, params = { pageIndex: 1 } } }, { call, put }) {
            const p = { method, url, param: { ...params } };
            const { result } = yield call(service.send, p);
            yield put({
                type: 'refresh', payload: {
                    list: result.items,
                    total: result.totalCount,
                    pageIndex: parseInt(p.param.pageIndex, 10)
                }
            });
        },
        *send({ payload: { method = "POST", url, params }, callback }, { call }) {
            const p = { method, url, param: { ...params } };
            const { success } = yield call(service.send, p);
            if (callback) callback(success)
        }
    }
};