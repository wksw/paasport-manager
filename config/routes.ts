
export default [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    access: 'public',
    routes: [{
      path: '/dashboard',
      name: '审计',
      access: 'public',
      layout: false,
      hideInMenu: true,
      component: '@/pages/Dashboard'
    }, {
      path: '/dashboard/transport',
      access: 'transportAnalsysisPermission',
      name: '物流',
      component: './Transport/v2/Dashboard',
    },]
  },
  {
    path: '/account',
    name: '账户',
    icon: 'user',
    access: 'accountAllPermission',
    routes: [
      {
        path: '/account/list',
        name: '账户列表',
        access: 'searchAccountPermission',
        component: './Account/List',
        routes: [],
      },
      {
        path: '/account/:uid/detail',
        name: '详情',
        hideInMenu: true,
        access: 'getAccountAllPermission',
        component: './Account/Detail',
      },
      {
        path: '/account/sync',
        name: '同步',
        access: 'accountSyncAllPermission',
        component: './Account/Sync',
      },
      {
        path: '/account/:uid/info',
        name: '信息',
        hideInMenu: true,
        access: 'getAccountAllPermission',
        component: './Account/Info',
      },
    ],
  },
  {
    path: '/message',
    name: '消息',
    icon: 'message',
    access: 'messageAllPermission',
    routes: [
      {
        path: '/message/list',
        name: '消息列表',
        access: 'messageAllPermission',
        component: './Message',
      },
      {
        path: '/message/template',
        name: '模版',
        access: 'messageTemplateAllPermission',
        component: './Message/Template',
      },
    ],
  },
  {
    path: '/audit',
    name: '审计',
    icon: 'audit',
    access: 'auditAllPermission',
    component: './Audits',
  },
  {
    path: '/login',
    layout: false,
    access: 'public',
    routes: [
      {
        name: 'login',
        path: '/login',
        access: 'public',
        component: './Account/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/protocol',
    name: '协议',
    icon: 'fileText',
    access: 'protocolAllPermission',
    component: './Protocol',
  },
  {
    path: '/transport',
    name: '物流',
    icon: 'shopping',
    access: 'transportPermission',
    routes: [
      {
        path: '/transport/list',
        name: '追踪',
        hideInMenu: true,
        access: 'searchTransportPermission',
        component: './Transport',
      },
      {
        path: '/transport/v2/list',
        name: '追踪',
        access: 'searchTransportPermission',
        component: './Transport/v2',
      },
      {
        path: '/transport/v2/alter',
        access: 'transportAlterPermission',
        name: '告警',
        component: './Transport/v2/Alter',
      },
      {
        path: '/transport/v2/error',
        access: 'transportErrorPermission',
        name: '错误',
        component: './Transport/v2/Error',
      },
      {
        path: '/transport/track',
        name: '物流查询',
        layout: false,
        hideInMenu: true,
        component: './Transport/Track',
        access: 'public'
      },
      {
        path: '/transport/v2/track',
        name: '物流查询',
        layout: false,
        hideInMenu: true,
        component: './Transport/v2/Track',
        access: 'public'
      },
    ],
  },
  {
    path: '/',
    access: 'public',
    redirect: '/dashboard',
  },
  {
    component: './404',
  },
];
