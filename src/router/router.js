import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};
export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
// 客户管理
export const otherRouter = {
    path: '/customermanage/customerManage',
    name: 'otherRouter',
    redirect: '/customermanage',
    component: Main,
    children: [
        { path: 'customermanage', title: {i18n: '客户管理'}, name: 'customermanage_index', component: () => import('@/views/customermanage/customer-manage.vue') },
        { path: '/customermanage/see', title: '客户档案', name: 'see', component: () => import('@/views/customermanage/see.vue') },
        { path: '/customermanage/edit', title: '客户档案（编辑）', name: 'edit-custom', component: () => import('@/views/customermanage/edit.vue') },
        { path: '/customermanage/new', title: '客户档案（新建）', name: 'new-custom', component: () => import('@/views/customermanage/edit.vue') },
        { path: '/customermanage/add-informat', title: '新增开票信息', name: 'add-informat', component: () => import('@/views/customermanage/add-informat.vue') }
    ]
};
// 合同管理
export const otherRouter1 = {
    path: '/contractmanage/contractManage',
    name: 'otherRouter1',
    redirect: '/contractmanage',
    component: Main,
    children: [
        { path: 'contractmanage', title: {i18n: '合同管理'}, name: 'contractmanage_index', component: () => import('@/views/contractmanage/contract-manage.vue') },
        { path: '/contractmanage/detail', title: '合同台账', name: 'detail', component: () => import('@/views/contractmanage/detail.vue') },
        { path: '/contractmanage/edit', title: '合同台账（编辑）', name: 'edit', component: () => import('@/views/contractmanage/edit.vue') }
    ]
};
// 订单管理
export const otherRouterOrder = {
    path: '/ordermanage/orderManage',
    name: 'otherRouterOrder',
    redirect: '/ordermanage',
    component: Main,
    children: [
        { path: 'ordermanage', title: {i18n: '订单管理'}, name: 'ordermanage_index', component: () => import('@/views/ordermanage/order-manage.vue') },
        { path: '/ordermanage/create', title: '申请备货', name: 'create', component: () => import('@/views/ordermanage/create-order.vue') },
    ]
};
// 资产管理
export const assetRouter = {
    path: '/delivery-manage',
    name: 'assetRouter',
    redirect: '/assetmanage/delivery-manage',
    component: Main,
    children: [
        { path: 'delivery-manage', title: {i18n: '发货管理'}, name: 'delivery-manage_index', component: () => import('@/views/assetmanagement/delivery-manage/delivery-manage.vue') },
        { path: '/assetmanage/delivery-manage/detail', title: '发货方案详情', name: 'delivery_detail', component: () => import('@/views/assetmanagement/delivery-manage/detail.vue') },
        { path: '/assetmanage/delivery-manage/newbuild', title: '新建发货方案', name: 'delivery_detail1', component: () => import('@/views/assetmanagement/delivery-manage/newbuild.vue') },
        { path: '/assetmanage/delivery-manage/editbuild', title: '发货方案（编辑）', name: 'delivery_detail2', component: () => import('@/views/assetmanagement/delivery-manage/newbuild.vue') },
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
        component: Main,
        children: [
            { path: 'home', title: '工作台', name: 'home_index', icon: 'ios-monitor-outline', component: () => import('@/views/workbench/work-bench.vue') }
        ]
    },
    // 客户管理
    {
        path: '/customermanage',
        icon: 'person-stalker',
        name: 'customermanage',
        title: '客户管理',
        component: Main,
        children: [
            { path: 'customerManage', title: '客户管理', name: 'customer-manage', icon: 'person-stalker', component: () => import('@/views/customermanage/customer-manage.vue') },
            // { path: 'customerManage1', title: '查看', name: 'customer-manage1', icon: 'arrow-move', component: () => import('@/views/customermanage/see.vue') },
            // { path: 'customerManage2', title: '编辑', name: 'customer-manage2', icon: 'arrow-move', component: () => import('@/views/customermanage/edit.vue') }
        ]
    },
    // 合同管理
    {
        path: '/contractmanage',
        icon: 'ios-compose-outline',
        name: 'contractmanage',
        title: '合同管理',
        component: Main,
        children: [
            { path: 'contractManage', title: '合同管理', name: 'contract-manage', icon: 'ios-compose-outline', component: () => import('@/views/contractmanage/contract-manage.vue') }
        ]
    },
    // 订单管理
    {
        path: '/ordermanage',
        icon: 'android-list',
        name: 'ordermanage',
        title: '订单管理',
        component: Main,
        children: [
            { path: 'orderManage', title: '订单管理', name: 'order-manage', icon: 'android-list', component: () => import('@/views/ordermanage/order-manage.vue') }
        ]
    },
    // 资产管理
    {
        path: '/assetmanage',
        icon: 'social-usd-outline',
        name: 'assetmanage',
        title: '资产管理',
        component: Main,
        children: [
            { path: 'device-query', title: '设备资产查询', name: 'device-query', icon: 'pull-request', component: () => import('@/views/assetmanagement/device-query/device-query.vue') },
            { path: 'issue-query', title: '出/入库单查询', name: 'issue-query', icon: 'arrow-swap', component: () => import('@/views/assetmanagement/issue-query/issue-query.vue') },
            { path: 'delivery-manage', title: '发货管理', name: 'delivery-manage', icon: 'plane', component: () => import('@/views/assetmanagement/delivery-manage/delivery-manage.vue')},
            // { path: 'model-config', title: '产品型号配置', name: 'model-config', icon: 'gear-a', component: () => import('@/views/assetmanagement/model-config/model-config.vue')},
        ]
    },
    // // 报表
    // {
    //     path: '/tables',
    //     icon: 'android-list',
    //     name: 'tables',
    //     title: '表格',
    //     component: Main,
    //     children: [
    //         { path: 'dragableTable', title: '报表', name: 'dragable-table', icon: 'android-list', component: () => import('@/views/tables/dragable-table.vue') }
    //     ]
    // },
    // 报表
    {
        path: '/tables',
        icon: 'social-yen',
        name: 'tables',
        title: '预投管理',
        component: Main,
        children: [
            { path: 'dragableTable', title: '设备统计', name: 'dragable-table', component: () => import('@/views/tables/dragable-table.vue') }
        ]
    },
    // 设置
    {
        path: '/setting',
        icon: 'ios-gear',
        name: 'setting',
        title: '设置',
        component: Main,
        children: [
            // { path: 'personSetting', title: '个人设置', name: 'person-setting', icon: 'ios-person-outline', component: () => import('@/views/setting/person-setting.vue') },
            { path: 'addressManage', title: '收货地址管理', name: 'address-manage', icon: 'ios-navigate-outline', component: () => import('@/views/setting/address-manage.vue') },
            // { path: 'memberManage', title: '成员管理', name: 'member-manage', icon: 'ios-people', component: () => import('@/views/setting/member-manage.vue') }
        ]
    },
    // {
    //     path: '/error-page',
    //     icon: 'android-sad',
    //     title: '错误页面',
    //     name: 'errorpage',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '错误页面', name: 'errorpage_index', component: () => import('@/views/error-page/error-page.vue') }
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
