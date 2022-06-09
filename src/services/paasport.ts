// import { LoginType } from '@/services/paasport/common/common';
// 性别枚举
export const GenderEnum = {
  '-1': '未知',
  0: '未知',
  1: '其他',
  2: '男',
  3: '女',
};

// 注册类型枚举
export const RegisteTypeEnum = {
  '-1': '未知',
  0: '邮箱',
  1: '手机号码',
  2: '第三方账号',
  3: '微信',
  4: 'QQ',
  5: '微博',
  6: '支付宝',
  7: '钉钉',
  8: 'Facebook',
  9: 'Google',
  10: 'Twitter',
  11: 'Ins',
  20: '未知',
  21: '微信小程序',
  22: '系统',
  23: '亚马逊',
  24: 'Magento',
  25: 'Songmics',
  26: 'Vasagle',
};

export const LoginTypeEnum = {
  '-1': '未知',
  0: '未知登陆类型',
  1: '手机验证码登陆',
  2: '第三方账号微信扫码登陆',
  3: '第三方账号QQ扫码登陆',
  4: '第三方账号WEIBO扫码登陆',
  5: '扫码登陆',
  6: '账号密码登陆',
  7: 'aksk请求',
  8: '第三方open_id登陆',
  9: '其他应用授权',
  10: '支付宝',
  11: '钉钉',
  12: '脸书',
  13: '谷歌',
  14: 'twitter',
  15: '微信小程序',
  16: 'instagram',
  17: 'oauth2.0',
  18: '刷新',
  19: 'token登陆',
  20: '亚马逊',
  21: 'magento',
  22: 'songmics',
  23: 'vasagle',
};

export const AuditStatusEnum = {
  '-1': '未知',
  0: '等待',
  1: '成功',
  2: '失败',
};

export const InsiteMessageEventTypeEnum = {
  '-1': '未知',
  0: '其他',
  1: '系统通知',
  2: '点赞',
  3: '@',
  4: '回复',
  5: '已读',
};

export const SyncModelEnum = {
  0: '账户注册',
  1: '账户更新',
  2: '账户注销',
  3: '账户迁移',
  4: '同步账户ID',
  5: '结果同步',
  6: '账户恢复',
};

export const SyncStatusEnum = {
  0: '等待',
  1: '运行',
  2: '成功',
  3: '失败',
  4: '取消',
};

export const SyncFromEnum = {
  0: '其他系统',
  1: 'PP系统',
};

export const MessageStatusEnum = {
  0: '等待',
  1: '失败',
  2: '正在处理',
  3: '成功',
  4: '被取消',
  5: '完成',
};

export const MessageTypeEnum = {
  0: '系统消息',
  1: '邮件消息',
  2: '短信',
  3: '语音消息',
};

export const TransportStatusEnum = {
  '-1': '所有状态',
  0: '注册中',
  1: '更新中',
  2: '停止追踪中',
  3: '重启追踪中',
  5: '追踪中',
  6: '已停止追踪',
  7: '注册失败',
  8: '更新失败',
  9: '停止失败',
  10: '重启失败',
  11: '获取信息失败',
};

export const TransportStatusEnumV2 = {
  "": "所有",
  "REGISTING": "注册中",
  "UPDATING": "更新中",
  "STOPING": "停止中",
  "RETRACKING": "重启追踪中",
  "TRACKING": "追踪中",
  "STOPED": "已停止",
  "REGISTE_FAIL": "注册失败",
  "UPDATE_FAIL": "更新失败",
  "STOP_FAIL": "停止失败",
  "RETRACK_FAIL": "重启失败",
  "NO_TRACK": "暂无物流信息",
  "PENDING": "等待追踪中",
  "DELTEING": "删除中",
  "DELETE_FAIL": "删除失败",
  "DELETED": "已删除",
}

export const TransportPackageStatusEnumV2 = {
  "": "所有",
  "NOT_FOUND": "暂无包裹信息",
  "IN_WAREHOUSE": "仓库处理中",
  "INFO_RECEIVED": "待揽件",
  "ORDERED": "已下单",
  "IN_TRANSIT": "运输途中",
  "AVAILABLE_FOR_PICKUP": "可取件",
  "OUT_FOR_DELIVERY": "派送中",
  "DELIVERY_FAIL": "派送失败",
  "DELIVERED": "成功签收",
  "EXPIRED": "运输过久",
  "EXCEPTION": "包裹异常",
}

export const TransportPackageStatusEnum = {
  '-1': '所有状态',
  0: '查询不到',
  10: '运输途中',
  20: '运输过久',
  30: '到达待取',
  35: '投递失败',
  40: '成功签收',
  50: '可能异常',
};
export const TransportProvider = {
  0: '17Track'
}
export const TransportAlterResolved = {
  '': '所有',
  true: '已处理',
  false: '未处理'
}

export const TransportAlterEvent = {
  'REPORT_LATE': '上报超时',
  'TRANSIT_LATE': '运输超时'
}

export const RequestProviderEvent = {
  "REGISTE": "注册",
  "STOP": "停止",
  "RETRACK": "重启",
  "DELETE": "删除",
  "GET": "获取",
  "PUSH": "重新推送",
}
export const TransportPackageSubStatusEnum = {
  "": "所有",
  "EMPTY": "",
  "NOT_FOUND_PENDING": "暂无包裹追踪信息",
  "NOT_FOUND_INVALID_CARRIER": "无效的运输商编号",
  "IN_WAREHOUSE_PICKUP_START": "仓库分拣中",
  "IN_WAREHOUSE_PICKUP_COMMPLETE": "仓库分拣完成",
  "IN_TRANSIT_PICKUP": "已揽收",
  "IN_TRANSIT_ARRIVAL_SCAN": "到达分拣中心",
  "IN_TRANSIT_ARRIVAL_DESTINATION_COUNTRY": "到达目的地国家",
  "IN_TRANSIT_CLEARANCE_START": "开始报关",
  "IN_TRANSIT_CLEARANCE_COMPLETE": "报关完毕",
  "IN_TRANSIT_DEPARTURE": "已离港",
  "IN_TRANSIT_ARRIVAL": "已到港",
  "IN_TRANSIT_FORWARD": "转发到不同的目的地",
  "IN_TRANSIT_RESOLVE_PROBLEM": "已解决问题",
  "IN_TRANSIT_OTHER": "其他情况",
  "OUT_FOR_DELIVERY_CONTACTED": "已联系客户",
  "OUT_FOR_DELIVERY_APPOINTMENT": "已预约",
  "DELIVERY_FAIL_NOBODY": "无收件人",
  "DELIVERY_FAIL_SECURITY": "安全原因",
  "DELIVERY_FAIL_REJECTED": "拒收",
  "DELIVERY_FAIL_INVALID_ADDRESS": "无效的收货地址",
  "DELIVERY_FAIL_BUSSINESS_CLOSED": "暂停营业",
  "DELIVERY_FAIL_OTHER": "由于其他原因导致投递失败",
  "DELIVERED_SUCCESS": "投递成功",
  "DELIVERED_PICKED_UP": "已签收",
  "DELIVERED_PICKED_UP_SIGN": "签收并签名",
  "DELIVERED_PICKED_UP_RECEIVED_CASH": "签收并货到付款",
  "EXCEPTION_SHIPPING": "运输异常",
  "EXCEPTION_NOBODY": "无人签收",
  "EXCEPTION_REJECTED": "拒收",
  "EXCEPTION_CLEARANCE_DELAY": "清关延迟",
  "ECEPTION_UNFORESEEN_DELAY": "不可预见的意外延迟",
  "EXCEPTION_HELD_PAYMENT": "未支付被扣留",
  "EXCEPTION_INVALID_ADDRESS": "无效的地址",
  "EXCEPTION_PICK_UP_MISSED": "可取件但没有人收",
  "EXCEPTION_REJECT_BY_CARRIER": "被承运人拒收",
  "EXCEPTION_RETURNING": "退件中",
  "EXCEPTION_RETURNED": "退件已签收",
  "EXCEPTION_DAMAGE": "包裹损坏",
  "EXCEPTION_LOST": "包裹丢失",
  "EXCEPTION_SECURITY": "安全原因",
  "EXCEPTION_DESTROYED": "被销毁",
  "EXCEPTION_CANCELED": "被取消",
  "EXCEPTION_OTHER": "其他原因",
}
