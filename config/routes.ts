export default [
  {
    path: '/account',
    name: '账户',
    routes: [
      {
        path: '/account/list',
        name: '账户列表',
        component: './Account/List',
        routes: [],
      },
      {
        path: '/account/:uid/detail',
        name: '详情',
        hideInMenu: true,
        component: './Account/Detail',
      },
      {
        path: '/account/sync',
        name: '同步',
        component: './Account/Sync',
      },
      {
        path: '/account/:uid/info',
        name: '信息',
        hideInMenu: true,
        component: './Account/Info',
      },
    ],
  },
  {
    path: '/message',
    name: '消息',
    routes: [
      {
        path: '/message/list',
        name: '消息列表',
        component: './Message',
      },
      {
        path: '/message/template',
        name: '模版',
        component: './Message/Template',
      },
    ],
  },
  {
    path: '/audit',
    name: '审计',
    component: './Audits',
  },
  {
    path: '/login',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/login',
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
    component: './Protocol',
  },
  {
    path: '/transport',
    name: '物流',
    routes: [
      {
        path: '/transport/list',
        name: '物流追踪',
        component: './Transport',
      },
      {
        path: '/transport/track',
        name: '物流查询',
        layout: false,
        hideInMenu: true,
        component: './Transport/Track',
      },
      {
        path: '/transport/v2/track',
        name: '物流查询',
        layout: false,
        hideInMenu: true,
        component: './Transport/v2/Track',
      },
    ],
  },
  {
    path: '/',
    redirect: '/account/list',
  },
  {
    component: './404',
  },
];
