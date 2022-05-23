import React from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { GetProtocols as GetAccountProtocols } from '@/services/paasport/account/account_umirequest';

const AccountProtocol: React.FC<COMMON.ReqWithIdPage> = (props) => {
  const { id } = props;
  const columns: ProColumns<ACCOUNT.ProtocolInfo>[] = [
    {
      title: '标题',
      key: 'title',
      valueType: 'text',
      dataIndex: 'title',
    },
    {
      title: '当前版本',
      key: 'current_version',
      dataIndex: 'current_version',
      render: (_, record) => [
        <a href={record.current_address} target="view_window">
          {record.current_version}
        </a>,
      ],
    },
    {
      title: '最近版本',
      key: 'last_version',
      valueType: 'text',
      dataIndex: 'last_version',
    },
    {
      title: '首次签订时间',
      key: 'created_at',
      valueType: 'dateTime',
      dataIndex: 'created_at',
    },
    {
      title: '最近一次签订时间',
      key: 'updated_at',
      valueType: 'dateTime',
      dataIndex: 'updated_at',
    },
  ];
  return (
    <ProTable<ACCOUNT.ProtocolInfo, COMMON.ReqWithIdPage>
      toolBarRender={false}
      search={false}
      columns={columns}
      request={async (
        params: any & {
          pageSize: number;
          current: number;
        },
        sort,
        filter,
      ) => {
        const resp = await GetAccountProtocols({
          id: id,
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

export default AccountProtocol;
