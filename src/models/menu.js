import { queryMenu } from '@/services/menu';
import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    breadcrumbNameMap: {},
  },

  effects: {
    *getMenuData({ }, { call, put }) {
      const menuData = yield call(queryMenu);
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap },

      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
