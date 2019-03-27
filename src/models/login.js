import * as api from '@/services/login'
import { routerRedux } from 'dva/router';
import { getPageQuery } from '@/utils/utils';
import { stringify } from 'qs';
import { setLocalStorage, removeLocalStorage } from '@/utils/utils';

export default {
    namespace: 'login',
    state: {
        success: undefined,
        error: {}
    },
    reducers: {
        changeLoginStatus(state, { payload: { success, error } }) {
            return { ...state, success, error };
        }
    },
    effects: {
        *login({ payload: { userNameOrEmailAddress, password } }, { call, put }) {
            const data = yield call(api.login, { userNameOrEmailAddress, password, rememberClient: true });
            console.log(data);
            yield put({
                type: 'changeLoginStatus', payload: {
                    success: data.success,
                    error: data.error
                }
            });
            if (data.success) {
                const { accessToken } = data.result;
                setLocalStorage('token', accessToken);
                const urlParams = new URL(window.location.href);
                const params = getPageQuery();
                let { redirect } = params;
                if (redirect) {
                    const redirectUrlParams = new URL(redirect);
                    if (redirectUrlParams.origin === urlParams.origin) {
                        redirect = redirect.substr(urlParams.origin.length);
                        if (redirect.match(/^\/.*#/)) {
                            redirect = redirect.substr(redirect.indexOf('#') + 1);
                        }
                    } else {
                        window.location.href = redirect;
                        return;
                    }
                }
                console.log(redirect);
                yield put(routerRedux.replace(redirect || '/'));
            }
        },
        *logout(_, { put }) {
            yield put({
                type: 'changeLoginStatus',
                payload: {
                    success: false
                },
            });
            removeLocalStorage('token');
            yield put(
                routerRedux.push({
                    pathname: '/login',
                    search: stringify({
                        redirect: window.location.href,
                    }),
                })
            );
        }
    }
};