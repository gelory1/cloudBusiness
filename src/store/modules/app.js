import {otherRouter, otherRouter1, otherRouterOrder, assetRouter, appRouter} from '@/router/router';
import Util from '@/libs/util';
import Cookies from 'js-cookie';
import Vue from 'vue';
import axios from '@/api/axios';

const typeMap = {
    1: ' 审批提醒',
    2: ' 签署提醒',
    3: '支付提醒',
    4: '（财务）到款确认',
    5: '下单提醒',
    6: '发货提醒',
    7: '收货提醒',
    8: '上线审批',
    9: '上线通知',
    10: '回款核准',
    11: '开票提醒'
};
const app = {
    state: {
        cachePage: [],
        lang: '',
        isFullScreen: false,
        openedSubmenuArr: [], // 要展开的菜单数组
        menuTheme: 'dark', // 主题
        themeColor: '',
        pageOpenedList: [{
            title: '首页',
            path: '',
            name: 'home_index'
        }],
        currentPageName: '',
        currentPath: [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            }
        ], // 面包屑数组
        menuList: [],
        routers: [
            otherRouter,
            otherRouter1,
            otherRouterOrder,
            assetRouter,
            ...appRouter
        ],
        tagsList: [...otherRouter.children, ...otherRouter1.children, ...assetRouter.children, ...otherRouterOrder.children],
        messageCount: 0,
        dontCache: ['text-editor', 'artical-publish'], // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
        provinces: [],
        workBenchData: [],
        showNotice: false,
        notifyData: {
            status: false,
            data: {}
        },
        authority: []
    },
    mutations: {
        setTagsList (state, list) {
            state.tagsList.push(...list);
        },
        setAutority (state, list) {
            state.authority = list;
        },
        updateMenulist (state) {
            let accessCode = parseInt(Cookies.get('access'));
            let menuList = [];
            appRouter.forEach((item, index) => {
                if (item.access !== undefined) {
                    if (Util.showThisRoute(item.access, accessCode)) {
                        if (item.children.length === 1) {
                            menuList.push(item);
                        } else {
                            let len = menuList.push(item);
                            let childrenArr = [];
                            childrenArr = item.children.filter(child => {
                                if (child.access !== undefined) {
                                    if (child.access === accessCode) {
                                        return child;
                                    }
                                } else {
                                    return child;
                                }
                            });
                            menuList[len - 1].children = childrenArr;
                        }
                    }
                } else {
                    if (item.children.length === 1) {
                        menuList.push(item);
                    } else {
                        let len = menuList.push(item);
                        let childrenArr = [];
                        childrenArr = item.children.filter(child => {
                            if (child.access !== undefined) {
                                if (Util.showThisRoute(child.access, accessCode)) {
                                    return child;
                                }
                            } else {
                                return child;
                            }
                        });
                        if (childrenArr === undefined || childrenArr.length === 0) {
                            menuList.splice(len - 1, 1);
                        } else {
                            let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
                            handledItem.children = childrenArr;
                            menuList.splice(len - 1, 1, handledItem);
                        }
                    }
                }
            });
            state.menuList = menuList;
        },
        changeMenuTheme (state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme (state, mainTheme) {
            state.themeColor = mainTheme;
        },
        addOpenSubmenu (state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        closePage (state, name) {
            state.cachePage.forEach((item, index) => {
                if (item === name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
        initCachepage (state) {
            if (localStorage.cachePage) {
                state.cachePage = JSON.parse(localStorage.cachePage);
            }
        },
        removeTag (state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
        pageOpenedList (state, get) {
            let openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearAllTags (state) {
            state.pageOpenedList.splice(1);
            state.cachePage.length = 0;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearOtherTags (state, vm) {
            let currentName = vm.$route.name;
            let currentIndex = 0;
            state.pageOpenedList.forEach((item, index) => {
                if (item.name === currentName) {
                    currentIndex = index;
                }
            });
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
            let newCachepage = state.cachePage.filter(item => {
                return item === currentName;
            });
            state.cachePage = newCachepage;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        setOpenedList (state) {
            state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
        },
        setCurrentPath (state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentPageName (state, name) {
            state.currentPageName = name;
        },
        setAvator (state, path) {
            localStorage.avatorImgPath = path;
        },
        switchLang (state, lang) {
            state.lang = lang;
            Vue.config.lang = lang;
        },
        clearOpenedSubmenu (state) {
            state.openedSubmenuArr.length = 0;
        },
        setMessageCount (state, count) {
            state.messageCount = count;
        },
        increateTag (state, tagObj) {
            if (!Util.oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name);
                localStorage.cachePage = JSON.stringify(state.cachePage);
            }
            state.pageOpenedList.push(tagObj);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        getProvinces (state, data) {
            state.provinces = data;
        },
        setWorkBenchData (state, data) {
            state.showNotice = true;
            state.workBenchData = data;
        },
        resetWorkBenchData (state) {
            state.workBenchData = [];
        },
        setNotifyData (state, data) {
            state.notifyData = data;
        },
        resetShowNotice (state) {
            state.showNotice = false;
        }
    },
    actions: {
        getworkBench (context, payload) {
            let request = {
                'typeid': 28001,
                'data': [
                    {
                        'workBenchStatus': 1,
                        'accountId': payload.accountId,
                        'keyword': ''
                    }
                ]
            };
            let _this = payload.this;
            context.commit('setNotifyData', {status: false, data: []});
            axios.XLWORKBENCH(request).then(response => {
                if (!Cookies.get('user')) return;
                let { data } = response.data.result;
                let updateStatus = false;
                data.forEach(d => {
                    if (!context.state.workBenchData.find(w => d.workbenchId === w.workbenchId) && context.state.showNotice) {
                        updateStatus = true;
                        let message = '';
                        switch (d.workBenchType) {
                            case 1:
                                message = '审批提醒，您有一个待审批的工作，点击直接处理';
                                break;
                            case 10:
                                message = `回款待核准，金额：${d.workBenchContentObj.payAmount}(付款方：${d.workBenchContentObj.payUnitName})，点击直接处理`;
                                break;
                            case 4:
                                message = `到账待确认，金额：${d.workBenchContentObj.payAmount || d.workBenchContentObj.orderAmount}(付款方：${d.workBenchContentObj.payUnitName})，点击直接处理`;
                                break;
                            case 3:
                                if (d.workBenchContentObj.contractNo) {
                                    message = `${d.workBenchContentObj.contractNo}合同已签署完毕，请尽快支付。点击直接处理`;
                                } else if (d.workBenchContentObj.orderNo) {
                                    message = `${d.workBenchContentObj.orderNo}备货订单已签署完毕，请尽快支付。点击直接处理`;
                                }
                                break;
                            case 12:
                                message = '发货方案审批提醒，您有一个待审批的发货方案，请尽快审批。审批请戳这里';
                                break;
                        };
                        _this.$notify({
                            title: typeMap[d.workBenchType],
                            message: message,
                            duration: 60000,
                            offset: 100,
                            openData: () => {
                                let item = {
                                    data: d
                                };
                                if (!_this.$store.state.app.workBenchData.find(w => w.workbenchId === d.workbenchId)) {
                                    _this.$Message.info('该待办已处理！');
                                    return;
                                }
                                if (_this.$route.path !== '/home') {
                                    _this.$router.push({path: '/home', query: {notice: item}});
                                } else {
                                    _this.$router.push({query: {}});
                                    context.commit('setNotifyData', {status: true, data: {row: item}});
                                }
                            },
                            onClick: function () {
                                this.close();
                                this.openData();
                            }
                        });
                    }
                });
                if (updateStatus || data.length < context.state.workBenchData.length || !context.state.showNotice) context.commit('setWorkBenchData', data);
            }, error => {
                if (error.data.code === 0 && error.data.result === '') {
                    if (context.state.workBenchData.length > 0) context.commit('resetWorkBenchData');
                }
            });
        }
    }
};

export default app;
