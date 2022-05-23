import ProTable, { ProColumns } from '@ant-design/pro-table';
import React, { useState } from 'react';
import { SyncFromEnum, SyncModelEnum, SyncStatusEnum } from '@/services/paasport';
import { Modal } from 'antd';
import { GetResult as GetSyncResult } from '@/services/paasport/sync/sync_umirequest';
import { PageContainer } from '@ant-design/pro-layout';

type SyncDetailProps = {
  content: string;
  visible: boolean;
  cancel: (visible: boolean) => void;
};

const SyncDetail: React.FC<SyncDetailProps> = (props) => {
  const { content, visible, cancel } = props;
  return (
    <Modal
      visible={visible}
      onCancel={() => cancel(false)}
      closable={false}
      centered
      footer={null}
      maskClosable={true}
      width={600}
    >
      <pre style={{ width: 550 }}>
        {visible ? JSON.stringify(JSON.parse(content), null, 2) : ''}
      </pre>
    </Modal>
  );
};

const AccountSync: React.FC = () => {
  const [syncContent, setSyncContent] = useState('');
  const [visible, setVisible] = useState(false);
  const columns: ProColumns<SYNC.SyncInfo>[] = [
    {
      title: '模式',
      valueEnum: SyncModelEnum,
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '来源',
      dataIndex: 'frm',
      valueEnum: SyncFromEnum,
      key: 'frm',
    },
    {
      title: '状态',
      valueEnum: SyncStatusEnum,
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '开始时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      search: false,
      key: 'created_at',
    },
    {
      title: '结束时间',
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      search: false,
      key: 'updated_at',
    },
    {
      title: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          onClick={() => {
            setSyncContent(record?.content);
            setVisible(true);
          }}
        >
          详情
        </a>,
      ],
    },
  ];
  return (
    <PageContainer
      header={{
        title: '',
      }}
    >
      <ProTable
        columns={columns}
        request={async (
          params: any & {
            pageSize: number;
            current: number;
          },
          sort,
          filter,
        ) => {
          console.log('params', params, 'sort', sort, 'filter', filter);
          const resp = await GetSyncResult({
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
        options={{
          search: true,
          // search: (paramss) => { },
          // search: {
          //     onSearch: (params) => {
          //         console.log("---search", params);
          //     }
          // },
          density: false,
          fullScreen: false,
          setting: false,
        }}
        rowKey="key"
        search={false}
        onSubmit={(params) => {
          console.log('----submit', params);
        }}
      ></ProTable>
      <SyncDetail
        content={syncContent}
        cancel={(visible: boolean) => setVisible(visible)}
        visible={visible}
      />
    </PageContainer>
  );
};

export default AccountSync;
