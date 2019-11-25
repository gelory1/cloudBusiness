
# 新联云商务中心
[![](https://img.shields.io/travis/iview/iview-admin.svg?style=flat-square)](https://travis-ci.org/iview/iview-admin)
[![vue](https://img.shields.io/badge/vue-2.5.13-brightgreen.svg?style=flat-square)](https://github.com/vuejs/vue)
[![iview ui](https://img.shields.io/badge/iview-3.0.0-brightgreen.svg?style=flat-square)](https://github.com/iview/iview)
[![npm](https://img.shields.io/npm/l/express.svg)]()


## 当前版本：v1.0

[在线访问](https://admin.iviewui.com/)


## Install
```bush
// install dependencies
npm install
```
## Run
### Development
```bush
npm run dev
```
### Production(Build)
```bush
npm run build
```

## 简介
&emsp;&emsp;新联商务中心平台，目前框架基于vue-admin创建，使用iview及elementUI库。相关组件库文档，请查看[iview](http://v2.iviewui.com/)，[elementUI](https://element.eleme.cn/#/zh-CN/component/installation)

## 功能

- 登录/登出
- 客户管理
    - 列表过滤
    - 查看详情
    - 客户信息编辑
    - 客户新增、删除
- 合同管理
    - 列表过滤
    - 查看详情
    - 合同信息编辑
- 订单管理
    - 列表过滤
    - 查看详情
- 资产管理
    - 设备资产查询
        - 列表过滤
        - 查看详情
    - 出入库单查询
        - 列表过滤
        - 查看详情
    - 产品型号配置
- 报表
- 设置

## 文件结构
```shell
.
├── build  项目构建配置
└── src
    ├── images  图片文件
    ├── libs  工具方法
    ├── locale  多语言文件
    ├── router  路由配置
    ├── store  状态管理
    ├── styles  样式文件
    ├── template  模板文件
    ├── vendors  公共库文件
    └── views
        ├── assetmanagement  资产管理
        ├── contractmanage  合同管理
        ├── customermnage  客户管理
        ├── ordermanage  订单管理
        ├── Login  登录
        └── Main  主页面
```

