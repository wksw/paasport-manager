import ProTable, { ProColumns } from '@ant-design/pro-table';
import React from 'react';
import { GetAll as GetProtocols } from '@/services/paasport/protocol/protocol_umirequest';
import { PageContainer } from '@ant-design/pro-layout';

const Protocols: React.FC = () => {
  const columns: ProColumns<PROTOCOL.ProtocolInfo>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'annonation',
      ellipsis: true,
      key: 'annonation',
    },
    {
      title: '启用',
      dataIndex: 'enabled',
      key: 'enabled',
      renderText: (val: boolean) => (val ? '是' : '否'),
    },
    {
      title: '最新版本',
      dataIndex: 'latest_version',
      valueType: 'text',
      renderText: (val: PROTOCOL.ProtocolVersionInfo) => val.version,
    },
    {
      title: '访问地址',
      dataIndex: 'latest_version',
      valueType: 'text',
      renderText: (_, record) => [
        record.latest_version?.address !== '' ? (
          <a href={record.latest_version?.address}>{record.latest_version?.version}</a>
        ) : (
          ''
        ),
      ],
    },
    {
      title: '生效时间',
      dataIndex: 'effective_at',
      valueType: 'dateTime',
    },
    {
      title: '时效时间',
      dataIndex: 'expired_at',
      valueType: 'dateTime',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [<a>详情</a>, <a>版本</a>],
    },
  ];
  return (
    <PageContainer
      header={{
        title: '',
      }}
    >
      <ProTable
        search={false}
        toolBarRender={false}
        rowKey="key"
        columns={columns}
        request={async (
          params: any & {
            pageSize: number;
            current: number;
          },
          sort,
          filter,
        ) => {
          console.log('sort', sort, 'sort_keys', Object.keys(sort), 'filter', filter);
          const resp = await GetProtocols({
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
    </PageContainer>
  );
};

export default Protocols;
