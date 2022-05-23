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
