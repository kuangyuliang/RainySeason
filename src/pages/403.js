import React from 'react';
import Link from 'umi/link';
import Exception from '@/components/Exception';

export default () => (
    <Exception
        type="403"
        linkElement={Link}
        desc='抱歉，你无权访问该页面'
        backText='返回首页'
    />
);