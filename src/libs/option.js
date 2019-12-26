const asset = {};
const customer = {};
const order = {};
const contract = {};
const workbench = {};
const role = {};
asset.deliveryStatus = [
    {
        type: '全部',
        name: 'name1',
        index: 0
    },
    {
        type: '草稿',
        name: 'name2',
        index: 1
    },
    {
        type: '审批中',
        name: 'name3',
        index: 2
    },
    {
        type: '已通过',
        name: 'name4',
        index: 3
    },
    {
        type: '被驳回',
        name: 'name5',
        index: 4
    }
];
asset.deliveryStatusMap = {
    0: '草稿',
    1: '审批中',
    2: '已通过',
    3: '被驳回'
};
asset.deviceStatusMap = {
    '-1': '销售出库',
    0: '出库中（针对仓库）',
    1: '待收货',
    10: '入库；已收货',
    20: '领用',
    30: '拆除',
    40: '安装',
    50: '丢失',
    60: '上线',
    70: '退货'
};
asset.deviceTypeMap = {
    0: '出库',
    1: '入库',
    2: '领用',
    3: '拆除',
    4: '安装',
    5: '丢失',
    6: '上线'
};
asset.issueStatus = [
    {
        val: '销售出库',
        index: -1
    },
    {
        val: '出库中（针对仓库）',
        index: 0
    },
    {
        val: '待收货',
        index: 1
    },
    {
        val: '入库；已收货',
        index: 10
    },
    {
        val: '领用',
        index: 20
    },
    {
        val: '拆除',
        index: 30
    },
    {
        val: '安装',
        index: 40
    },
    {
        val: '丢失',
        index: 50
    },
    {
        val: '上线',
        index: 60
    },
    {
        val: '退货',
        index: 70
    }
];
asset.query = [
    {
        name: '所有类型仓库',
        id: undefined
    },
    {
        name: '成品库',
        id: 0
    },
    {
        name: '工程物资库',
        id: 1
    },
    {
        name: '固定资产库',
        id: 2
    }
];
customer.types = [
    {
        no: 0,
        type: '所有客户'
    },
    {
        no: 1,
        type: '直销客户'
    },
    {
        no: 2,
        type: '合作伙伴'
    },
    {
        no: 3,
        type: '伙伴客户'
    }
];
customer.natures = [
    {
        value: '直销客户',
        index: 1
    },
    {
        value: '合作伙伴',
        index: 2
    },
    {
        value: '伙伴客户',
        index: 3
    }
];

customer.levels = [
    {
        val: 'A级',
        index: 1
    },
    {
        val: 'B级',
        index: 2
    },
    {
        val: 'C级',
        index: 3
    },
    {
        val: 'D级',
        index: 4
    },
    {
        val: 'E级',
        index: 5
    }
];
customer.levelMap = {
    1: 'A级',
    2: 'B级',
    3: 'C级',
    4: 'D级',
    5: 'E级'
};
customer.industrys = [
    {
        val: '公共事业及管理组织',
        index: 1
    },
    {
        val: '工业',
        index: 2
    },
    {
        val: '商业住宿餐饮',
        index: 3
    },
    {
        val: '金融房地产及居民服务',
        index: 4
    },
    {
        val: '运输仓储邮政',
        index: 5
    },
    {
        val: '信息计算机和软件',
        index: 6
    },
    {
        val: '农林牧渔水利',
        index: 7
    },
    {
        val: '建筑业',
        index: 8
    },
    {
        val: '军工保密',
        index: 9
    },
    {
        val: '其他',
        index: 10
    }
];
customer.industryMap = {
    1: '公共事业及管理组织',
    2: '工业',
    3: '商业住宿餐饮',
    4: '金融房地产及居民服务',
    5: '运输仓储邮政',
    6: '信息计算机和软件',
    7: '农林牧渔水利',
    8: '建筑业',
    9: '军工保密',
    10: '其他'
};
order.typeMap = {
    0: '合同订单',
    1: '备货订单'
};
order.statusColorMap = {
    '审批中': {
        backgroundColor: '#FDF6EC',
        color: '#E7A440'
    },
    '待支付': {
        backgroundColor: '#F0F9EC',
        color: '#78C950'
    },
    '已下单': {
        backgroundColor: '#F4F4F5',
        color: '#7D7F82'
    },
    '已发货': {
        backgroundColor: '#EEEEFF',
        color: '#7272D0'
    },
    '已到货': {
        backgroundColor: '#EBF5FE',
        color: '#54A3F6'
    },
    '被驳回': {
        backgroundColor: '#F4F4F5',
        color: '#7D7F82'
    }
};
order.status = [
    {
        type: '全部',
        name: 'name1',
        index: 0
    },
    {
        type: '已下单',
        name: 'name8',
        index: 3
    },
    {
        type: '已发货',
        name: 'name9',
        index: 4
    },
    {
        type: '已到货',
        name: 'name10',
        index: 5
    }
];
order.statusMap = {
    0: '审批中', 1: '待支付', 2: '已下单', 3: '已发货', 4: '已到货', 5: '被驳回'
};
order.status2 = [
    {
        type: '全部',
        name: 'name1',
        index: 0
    },
    {
        type: '审批中',
        name: 'name2',
        index: 1
    },
    {
        type: '待支付',
        name: 'name3',
        index: 2
    },
    {
        type: '已下单',
        name: 'name4',
        index: 3
    },
    {
        type: '已发货',
        name: 'name5',
        index: 4
    },
    {
        type: '已到货',
        name: 'name6',
        index: 5
    },
    {
        type: '被驳回',
        name: 'name7',
        index: 6
    }
];
order.statusMap2 = {
    0: '申请', 1: '审批', 2: '支付', 3: '下单', 4: '出库', 5: '到货'
};
order.types = [
    {
        type: '全部',
        ids: [0, 1]
    },
    {
        type: '合同订单',
        ids: [0]
    },
    {
        type: '备货订单',
        ids: [1]
    }
];
order.statusMap3 = {
    3: '下单', 4: '出库', 5: '到货'
};
contract.status = [
    {
        status: '所有合同状态',
        index: -1
    },
    {
        status: '审批签约中',
        index: 0
    },
    {
        status: '生效实施中',
        index: 1
    },
    {
        status: '上线试运行',
        index: 2
    },
    {
        status: '回款待确认',
        index: 3
    },
    {
        status: '财务开票中',
        index: 4
    },
    {
        status: '商务转运营',
        index: 5
    },
    {
        status: '到期待续签',
        index: 6
    }
];
contract.natureMap = {
    1: '新签',
    2: '续签',
    3: '补装',
    4: '移点',
    5: '减点',
    6: '重签',
    7: '作废',
    8: '续费',
    9: '其他'
};
contract.contentMap = {
    1: '配用电',
    2: '环保设施智能监测系统',
    3: '中央空调',
    4: '油烟监测',
    5: '工地扬尘',
    6: '园区抄表',
    7: '综合能源',
    100: '其他'
};
contract.contents = [
    {
        val: '配用电',
        index: 1
    },
    {
        val: '环保设施智能监测系统',
        index: 2
    },
    {
        val: '中央空调',
        index: 3
    },
    {
        val: '油烟监测',
        index: 4
    },
    {
        val: '工地扬尘',
        index: 5
    },
    {
        val: '园区抄表',
        index: 6
    },
    {
        val: '综合能源',
        index: 7
    },
    {
        val: '其他',
        index: 100
    }
];
contract.natures = [
    {
        val: '新签',
        index: 1
    },
    {
        val: '续签',
        index: 2
    },
    {
        val: '补装',
        index: 3
    },
    {
        val: '移点',
        index: 4
    },
    {
        val: '减点',
        index: 5
    },
    {
        val: '重签',
        index: 6
    },
    {
        val: '作废',
        index: 7
    },
    {
        val: '续费',
        index: 8
    },
    {
        val: '其他',
        index: 9
    }
];
contract.types = [
    {
        val: '非备货合同',
        index: 0
    },
    {
        val: '备货合同',
        index: 1
    }
];
contract.salesTypeMap = {
    1: '渠道',
    2: '直销',
    3: '其他'
};
contract.salesTypes = [
    {
        val: '渠道',
        index: 1
    },
    {
        val: '直销',
        index: 2
    },
    {
        val: '其他',
        index: 3
    }
];
contract.statusColorMap = {
    审批签约中: {
        backgroundColor: '#FDF6EC',
        color: '#E7A440'
    },
    生效实施中: {
        backgroundColor: '#F0F9EC',
        color: '#78C950'
    },
    上线试运行: {
        backgroundColor: '#CCF5F5',
        color: '#66E0E0'
    },
    回款待确认: {
        backgroundColor: '#EBF5FE',
        color: '#54A3F6'
    },
    财务开票中: {
        backgroundColor: '#EEEEFF',
        color: '#7272D0'
    },
    商务转运营: {
        backgroundColor: '#F4F4F5',
        color: '#7D7F82'
    },
    到期待续签: {
        backgroundColor: '#F8EBEB',
        color: '#F68C8C'
    }
};
contract.subjectNameMap = {
    1: '电能云',
    2: '智慧能源',
    3: '维智泰',
    4: '耀邦达',
    5: '股份公司',
    6: '志达',
    7: '康源',
    8: '新联能源',
    100: '其他'
};
contract.paybackWayMap = {
    0: '线下支付',
    1: '备货金抵扣'
};
workbench.typeMap = {
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
    11: '开票提醒',
    12: '发货方案审批'
};
workbench.addTypes = [
    // {
    //   val: '审批提醒',
    //   index: 1
    // },
    // {
    //   val: '签署提醒',
    //   index: 2
    // },
    // {
    //   val: '支付提醒',
    //   index: 3
    // },
    // {
    //   val: '（财务）到款确认',
    //   index: 4
    // },
    // {
    //   val: '下单提醒',
    //   index: 5
    // },
    // {
    //   val: '发货提醒',
    //   index: 6
    // },
    // {
    //   val: '收货提醒',
    //   index: 7
    // },
    // {
    //   val: '上线审批',
    //   index: 8
    // },
    // {
    //   val: '上线通知',
    //   index: 9
    // },
    {
        val: '回款核准',
        index: 10
    }
    // {
    //   val: '开票提醒',
    //   index: 11
    // },
    // {
    //   val: '发货方案审批',
    //   index: 12
    // },
];
workbench.statusMap = {
    1: '待办',
    2: '已办'
};
role.roleMap = {
    19: '超级管理员',
    20: '业务管控',
    18: '财务',
    17: '合作伙伴',
    22: '销售人员'
};
export default { asset, customer, contract, order, workbench, role };
