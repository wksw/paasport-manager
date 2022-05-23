import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Avatar, Space } from 'antd';
import React from 'react';
import {
  GetAll as GetAccounts,
  SearchAccount,
} from '@/services/paasport/account/account_umirequest';
// import { currentUser } from '@/services/ant-design-pro/api';
import { TableDropdown } from '@ant-design/pro-table';
import { Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Base64 } from 'js-base64';

const Accounts: React.FC = () => {
  const columns: ProColumns<ACCOUNT.AccountInfo>[] = [
    {
      title: '账户ID',
      key: 'uid',
      dataIndex: 'uid',
      hideInTable: true,
    },
    {
      title: '头像',
      key: 'avatar',
      dataIndex: 'avatar',
      valueType: 'avatar',
      search: false,
      render: (_, record) => (
        <Space>
          <Avatar size="large" src={record.avatar}></Avatar>
        </Space>
      ),
    },
    {
      title: '昵称',
      dataIndex: 'name',
      valueType: 'text',
      search: false,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueType: 'select',
      search: false,
      valueEnum: {
        0: { text: '未知' },
        1: { text: '保密' },
        2: { text: '男' },
        3: { text: '女' },
      },
    },
    {
      title: '手机',
      dataIndex: 'phone',
      copyable: true,
      renderText: (val: ACCOUNT.PhoneResp) => `${val.phone}`,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      copyable: true,
      renderText: (val: ACCOUNT.EmailResp) => `${val.email}`,
    },
    {
      title: '已注销',
      key: 'deleted_at',
      dataIndex: 'deleted_at',
      search: false,
      renderText: (val: string) => (val === '' ? '否' : '是'),
    },
    {
      title: '注册时间',
      sorter: true,
      key: 'created_at',
      search: false,
      dataIndex: 'created_at',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      key: 'option',
      search: false,
      render: (_, record) => [
        <Link to={'/account/' + record.uid + '/detail'}> 详情</Link>,
        <TableDropdown
          key="actionGroup"
          menus={[
            { key: 'modifyPassword', name: '修改密码' },
            { key: 'delete', name: '注销' },
          ]}
        />,
      ],
    },
  ];
  return (
    <PageContainer
      header={{
        title: '',
      }}
    >
      <ProTable<ACCOUNT.AccountInfo, COMMON.ResultWithPage>
        request={async (
          params: any & {
            pageSize: number;
            current: number;
          },
          sort,
          filter,
        ) => {
          console.log('sort', sort, 'sort_keys', Object.keys(sort), 'filter', filter);
          console.log('----params', params);
          var query = {
            filter: {},
            sort: [],
          };
          if (params.phone) {
            query.filter['phone'] = params.phone;
          }
          if (params.uid) {
            query.filter['uid'] = params.uid;
          }
          if (params.email) {
            query.filter['email'] = params.email;
          }
          Object.keys(sort).forEach((key) => {
            if (sort[key] == 'ascend') {
              query.sort.push(`+${key}`);
            } else {
              query.sort.push(`-${key}`);
            }
          });
          console.log('---query', query);
          const resp = await SearchAccount({
            page: params.current,
            size: params.pageSize,
            query: Base64.encode(JSON.stringify(query), true),
            // sort_field: Object.keys(sort).join(','),
            // sort_order: Object.values(sort)[0]?.substring(0, 3),
          });
          return {
            data: resp.data,
            success: true,
            total: resp.total_count,
          };
        }}
        columns={columns}
        // search={false}
        // toolBarRender={false}
        options={{
          // search: true,
          density: false,
          fullScreen: false,
          setting: false,
        }}
      />
    </PageContainer>
  );
};

export default Accounts;
