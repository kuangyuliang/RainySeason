import React from 'react';
import Link from 'umi/link';
import Exception from '@/components/Exception';

export default () => (
    <Exception
        type="500"
        linkElement={Link}
        desc='抱歉，服务器出错了'
        backText='返回首页'
    />
);