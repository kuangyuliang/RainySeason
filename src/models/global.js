export default {
    namespace: 'global',
  
    state: {
      collapsed: false,
      notices: [],
    },
  
    reducers: {
      changeLayoutCollapsed(state, { payload }) {
        return {
          ...state,
          collapsed: payload,
        };
      },
    },
  };
  