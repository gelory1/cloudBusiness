
// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => require(['@/views/login.vue'],resolve)
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => require(['@/views/error-page/404.vue'],resolve)
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => require(['@//views/error-page/403.vue'],resolve)
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => require(['@/views/error-page/500.vue'],resolve)
};
export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => require(['@/views/main-components/lockscreen/components/locking-page.vue'],resolve)
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
// 客户管理
export const otherRouter = {
    path: '/customermanage/customerManage',
    name: 'otherRouter',
    redirect: '/customermanage',
    component: resolve => require(['@/views/Main.vue'],resolve),
    children: [
        { path: 'customermanage', title: {i18n: '客户管理'}, name: 'customermanage_index', component: resolve => require(['@/views/customermanage/customer-manage.vue'],resolve) },
        { path: '/customermanage/see', title: '客户档案', name: 'see', component: resolve => require(['@/views/customermanage/see.vue'],resolve) },
        { path: '/customermanage/edit', title: '客户档案（编辑）', name: 'edit-custom', component: resolve => require(['@/views/customermanage/edit.vue'],resolve) },
        { path: '/customermanage/new', title: '客户档案（新建）', name: 'new-custom', component: resolve => require(['@/views/customermanage/edit.vue'],resolve) },
        { path: '/customermanage/add-informat', title: '新增开票信息', name: 'add-informat', component: resolve => require(['@/views/customermanage/add-informat.vue'],resolve) }
    ]
};
// 合同管理
export const otherRouter1 = {
    path: '/contractmanage/contractManage',
    name: 'otherRouter1',
    redirect: '/contractmanage',
    component: resolve => require(['@/views/Main.vue'],resolve),
    children: [
        { path: 'contractmanage', title: {i18n: '合同管理'}, name: 'contractmanage_index', component: resolve => require(['@/views/contractmanage/contract-manage.vue'],resolve) },
        { path: '/contractmanage/detail', title: '合同台账', name: 'detail', component: resolve => require(['@/views/contractmanage/detail.vue'],resolve) },
        { path: '/contractmanage/edit', title: '合同台账（编辑）', name: 'edit', component: resolve => require(['@/views/contractmanage/edit.vue'],resolve) }
    ]
};
// 订单管理
export const otherRouterOrder = {
    path: '/ordermanage/orderManage',
    name: 'otherRouterOrder',
    redirect: '/ordermanage',
    component: resolve => require(['@/views/Main.vue'],resolve),
    children: [
        { path: 'ordermanage', title: {i18n: '订单管理'}, name: 'ordermanage_index', component: resolve => require(['@/views/ordermanage/order-manage.vue'],resolve) },
        { path: '/ordermanage/create', title: '申请备货', name: 'create', component: resolve => require(['@/views/ordermanage/create-order.vue'],resolve) },
    ]
};
// 资产管理
export const assetRouter = {
    path: '/delivery-manage',
    name: 'assetRouter',
    redirect: '/assetmanage/delivery-manage',
    component: resolve => require(['@/views/Main.vue'],resolve),
    children: [
        { path: 'delivery-manage', title: {i18n: '发货管理'}, name: 'delivery-manage_index', component: resolve => require(['@/views/assetmanagement/delivery-manage/delivery-manage.vue'],resolve) },
        { path: '/assetmanage/delivery-manage/detail', title: '发货方案详情', name: 'delivery_detail', component: resolve => require(['@/views/assetmanagement/delivery-manage/detail.vue'],resolve) },
        { path: '/assetmanage/delivery-manage/newbuild', title: '新建发货方案', name: 'delivery_detail1', component: resolve => require(['@/views/assetmanagement/delivery-manage/newbuild.vue'],resolve) },
        { path: '/assetmanage/delivery-manage/editbuild', title: '发货方案（编辑）', name: 'delivery_detail2', component: resolve => require(['@/views/assetmanagement/delivery-manage/newbuild.vue'],resolve) },
    ]
};
// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    // 工作台
    {
        path: '/',
        icon: 'ios-monitor-outline',
        name: 'home',
        title: '工作台',
        component: resolve => require(['@/views/Main.vue'],resolve),
        children: [
            { path: 'home', title: '工作台', name: 'home_index', icon: 'ios-monitor-outline', component: resolve => require(['@/views/workbench/work-bench.vue'],resolve) }
        ]
    },
    // 客户管理
    {
        path: '/customermanage',
        icon: 'person-stalker',
        name: 'customermanage',
        title: '客户管理',
        component: resolve => require(['@/views/Main.vue'],resolve),
        children: [
            { path: 'customerManage', title: '客户管理', name: 'customer-manage', icon: 'person-stalker', component: resolve => require(['@/views/customermanage/customer-manage.vue'],resolve) },
            // { path: 'customerManage1', title: '查看', name: 'customer-manage1', icon: 'arrow-move', component: resolve => require(['@/views/customermanage/see.vue'],resolve) },
            // { path: 'customerManage2', title: '编辑', name: 'customer-manage2', icon: 'arrow-move', component: resolve => require(['@/views/customermanage/edit.vue'],resolve) }
        ]
    },
    // 合同管理
    {
        path: '/contractmanage',
        icon: 'ios-compose-outline',
        name: 'contractmanage',
        title: '合同管理',
        component: resolve => require(['@/views/Main.vue'],resolve),
        children: [
            { path: 'contractManage', title: '合同管理', name: 'contract-manage', icon: 'ios-compose-outline', component: resolve => require(['@/views/contractmanage/contract-manage.vue'],resolve) }
        ]
    },
    // 订单管理
    {
        path: '/ordermanage',
        icon: 'android-list',
        name: 'ordermanage',
        title: '订单管理',
        component: resolve => require(['@/views/Main.vue'],resolve),
        children: [
            { path: 'orderManage', title: '订单管理', name: 'order-manage', icon: 'android-list', component: resolve => require(['@/views/ordermanage/order-manage.vue'],resolve) }
        ]
    },
    // 资产管理
    {
        path: '/assetmanage',
        icon: 'social-usd-outline',
        name: 'assetmanage',
        title: '资产管理',
        component: resolve => require(['@/views/Main.vue'],resolve),
        children: [
            { path: 'device-query', title: '设备资产查询', name: 'device-query', icon: 'pull-request', component: resolve => require(['@/views/assetmanagement/device-query/device-query.vue'],resolve) },
            { path: 'issue-query', title: '出/入库单查询', name: 'issue-query', icon: 'arrow-swap', component: resolve => require(['@/views/assetmanagement/issue-query/issue-query.vue'],resolve) },
            { path: 'delivery-manage', title: '发货管理', name: 'delivery-manage', icon: 'plane', component: resolve => require(['@/views/assetmanagement/delivery-manage/delivery-manage.vue'],resolve)},
            // { path: 'model-config', title: '产品型号配置', name: 'model-config', icon: 'gear-a', component: resolve => require(['@/views/assetmanagement/model-config/model-config.vue'],resolve)},
        ]
    },
    // 报表
    {
        path: '/reportform',
        icon: 'android-list',
        name: 'reportform',
        title: '报表',
        component: resolve => require(['@/views/Main.vue'],resolve),
        children: [
            { path: '/reportform/inventory', title: '库存统计', name: 'inventory', component: resolve => require(['@/views/reportform/inventory.vue'],resolve) },
            { path: '/reportform/stock', title: '备货统计', name: 'stock', component: resolve => require(['@/views/reportform/stock.vue'],resolve) },
            { path: '/reportform/delivery', title: '发货统计', name: 'delivery', component: resolve => require(['@/views/reportform/delivery.vue'],resolve) },
        ]
    },
    // 报表
    {
        path: '/tables',
        icon: 'social-yen',
        name: 'tables',
        title: '预投管理',
        component: resolve => require(['@/views/Main.vue'],resolve),
        children: [
            { path: '/tables/dragableTable', title: '设备统计', name: 'dragable-table', component: resolve => require(['@/views/tables/dragable-table.vue'],resolve) }
        ]
    },
    // 设置
    {
        path: '/setting',
        icon: 'ios-gear',
        name: 'setting',
        title: '设置',
        component: resolve => require(['@/views/Main.vue'],resolve),
        children: [
            // { path: 'personSetting', title: '个人设置', name: 'person-setting', icon: 'ios-person-outline', component: resolve => require(['@/views/setting/person-setting.vue'],resolve) },
            { path: 'addressManage', title: '收货地址管理', name: 'address-manage', icon: 'ios-navigate-outline', component: resolve => require(['@/views/setting/address-manage.vue'],resolve) },
            // { path: 'memberManage', title: '成员管理', name: 'member-manage', icon: 'ios-people', component: resolve => require(['@/views/setting/member-manage.vue'],resolve) }
        ]
    },
    // {
    //     path: '/error-page',
    //     icon: 'android-sad',
    //     title: '错误页面',
    //     name: 'errorpage',
    //     component: resolve => require(['@/views/Main.vue'],resolve),
    //     children: [
    //         { path: 'index', title: '错误页面', name: 'errorpage_index', component: resolve => require(['@/views/error-page/error-page.vue'],resolve) }
    //     ]
    // }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    otherRouter1,
    otherRouterOrder,
    assetRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
