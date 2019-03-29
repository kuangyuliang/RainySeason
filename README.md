<h1 align="center">RainySeason</h1>

## 目录
```
.
├── mock                         # 本地模拟数据，基于 express
├── src
    ├── assets                   # 本地静态资源
    ├── component                # 业务通用组件
        └── utils                # 组件工具库
    ├── layouts                  # 通用布局
    ├── models                   # 全局 dva model
    ├── pages                    # 业务页面入口和常用模板，和路由对应
        └── .umi                 # dev 临时目录，需添加到 .gitignore
    ├── services                 # 后台接口服务
    ├── utils                    # 工具库
    ├── app.js                   # 运行时配置文件
    ├── constants.js             # 常量
    ├── defaultSettings.js       # 默认布局设置
    └── global.less              # 全局样式
├── .editorconfig                # 编辑器设置
├── .env                         # 环境变量
├── .eslintrc                    # 代码规范
├── .gitignore                   # git忽略提交文件
├── .umirc.js                    # umi 配置，同 config/config.js，二选一
├── package.json                 # 项目依赖模块
└── webpack.config.js            # 配置 webpack 的 resolve.alias
```

## 组件

### 第三方组件

参照 [Ant Design Pro](https://github.com/ant-design/ant-design-pro/)

- BreadcrumbView 面包屑
- Ellipsis 文本自动省略号
- Exception 异常
- GlobalFooter 全局页脚
- GlobalHeader 全局页头
- PageLoading 加载组件
- SiderMenu 菜单
- TopNavHeader 页头导航组件
- Trend 趋势标记

### 页面生成组件

参照 [demo](./src/pages/test/test.js)

- Form 表单
- Page 页面

### 地图组件

参照 [map](./src/pages/index.js)

- Map 地图
- TimePlay 时间播放器


```javascript
import React, { PureComponent } from 'react';
import TimePlay from '@/components/TimePlay';

export default class Demo extends PureComponent {
    constructor(props) {
        super(props);
        //创建Ref
        this.timeplay = React.createRef();
    }

    test = (date) => {
        console.log(date.format('YYYY-MM-DD HH:mm'));
        //暂停播放(如果只是点击某一个时间点,不需要调用暂停和继续播放)
        this.timeplay.current.delayAnimation();
        //do something...
        setTimeout(() => {
            //继续播放
            this.timeplay.current.continueAnimation();
        }, 5000);
    }

    render(){
        const options = {
            startDate: moment().add(-3, 'months'),  //开始时间
            endDate: moment().add(6, 'days'),       //结束时间
            currentData: moment(),                  //当前时间
            timeUnitControl: false,                 //是否显示修改时间单位
            speed: 1000,                            //播放速度
            callback: this.test                     //回调
        };
        return <TimePlay {...options} />;
    }
}
```

## 使用

```bash
# 安装umi
$ npm install -g umi

# 复制项目到本地
$ git clone git://119.23.241.69:19418/RainySeason.git

# 添加依赖
$ cd RainySeason
$ npm install

# 运行
$ umi dev # 或者 npm start
```