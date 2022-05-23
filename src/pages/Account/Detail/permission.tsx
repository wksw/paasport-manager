import ProTable, { ProColumns } from '@ant-design/pro-table';
import React from 'react';
import { GetResourceBindRoles } from '@/services/paasport/auth/auth_umirequest';

const AccountPermission: React.FC<COMMON.ReqWithUid> = (props) => {
  const { uid } = props;
  const columns: ProColumns<AUTH.RoleInfo>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'annonation',
      key: 'annonation',
      ellipsis: true,
    },
    {
      title: '启用/禁用',
      dataIndex: 'enabled',
      key: 'enabled',
      renderText: (val: boolean) => (val ? '启用' : '禁用'),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      valueType: 'dateTime',
    },
  ];
  return (
    <ProTable<AUTH.RoleInfo>
      columns={columns}
      toolBarRender={false}
      search={false}
      request={async (
        params: any & {
          pageSize: number;
          current: number;
        },
        sort,
        filter,
      ) => {
        const resp = await GetResourceBindRoles({
          resource: uid,
          page: params.current,
          size: params.pageSize,
          sort_field: Object.keys(sort).join(','),
          sort_order: Object.values(sort)[0]?.substring(0, 3),
        });
        return {
          data: resp.data,
          success: true,
          total: resp.total_count,
        };
      }}
    ></ProTable>
  );
};

export default AccountPermission;
