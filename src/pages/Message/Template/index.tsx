import React from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { GetMessageTemplates } from '@/services/paasport/message/message_umirequest';
import { MessageTypeEnum } from '@/services/paasport';
import { MessageType } from '@/services/paasport/common/common';
import { PageContainer } from '@ant-design/pro-layout';
import { StatusBool } from '@/services/paasport/common/common';
// import defineConfig from '../../../../config/config';

// const { base_url } = defineConfig;

const Templates: React.FC = () => {
  const columns: ProColumns<MESSAGE.MessageTemplateInfo>[] = [
    {
      title: '名称',
      key: 'name',
      valueType: 'text',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '签名',
      key: 'sign_name',
      dataIndex: 'sign_name',
      valueType: 'text',
    },
    {
      title: '所属应用',
      key: 'app_id',
      dataIndex: 'app_id',
      renderText: (val: string) => (val === '0' ? '-' : val),
    },
    {
      title: '类型',
      key: 'type',
      dataIndex: 'type',
      valueEnum: MessageTypeEnum,
    },
    {
      title: '公共模版',
      key: 'type',
      dataIndex: 'type',
      renderText: (val: boolean) => (val ? '是' : '否'),
    },
    {
      title: '启用',
      key: 'enabled',
      dataIndex: 'enabled',
      valueType: 'text',
      renderText: (val: boolean) => (val ? '是' : '否'),
    },
    {
      title: '自渲染',
      key: 'render_self',
      dataIndex: 'render_self',
      renderText: (val: boolean) => (val ? '是' : '否'),
    },
    {
      title: '创建时间',
      key: 'created_at',
      valueType: 'dateTime',
      dataIndex: 'created_at',
    },
    {
      title: '更新时间',
      key: 'updated_at',
      valueType: 'dateTime',
      dataIndex: 'updated_at',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      valueType: 'option',
      render: (_, record) => [
        record.type === MessageType.M_EAMIL && record.render_self == StatusBool.SB_TRUE && (
          <a
            href={`${process.env.base_url}/a1/static/template?id=${record.id}&params=${record.params}`}
            target="view_window"
          >
            预览
          </a>
        ),
      ],
    },
  ];
  return (
    <PageContainer
      header={{
        title: '',
      }}
    >
      <ProTable<MESSAGE.MessageInfo, COMMON.ResultWithPage>
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
          const resp = await GetMessageTemplates({
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

export default Templates;
