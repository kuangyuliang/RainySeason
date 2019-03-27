import React from 'react';
import withRouter from 'umi/withRouter';
import BasicLayout from './BasicLayout';
import { getLocalStorage } from '@/utils/utils'

function Layout({ children, location }) {
  const path = location.pathname;
  if (path == '/login') {
    return children;
  }

  const token = getLocalStorage('token');
  if (!token) {
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
    return children;
  }

  return (
    <BasicLayout location={location}>
      {children}
    </BasicLayout>
  );
}

export default withRouter(Layout);