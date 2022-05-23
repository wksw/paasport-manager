import React from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Avatar } from 'antd';
import { GetInsiteMessageEventAllApp } from '@/services/paasport/message/message_umirequest';
import { InsiteMessageEventTypeEnum } from '@/services/paasport';

const AccountMessage: React.FC<COMMON.ReqWithUid> = (props) => {
  const { uid } = props;
  const columns: ProColumns<MESSAGE.InsiteMessageEventInfo>[] = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      valueEnum: InsiteMessageEventTypeEnum,
    },
    {
      title: '应用',
      dataIndex: 'app_id',
      key: 'app_id',
    },
    {
      title: '事件内容',
      dataIndex: 'content',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '事件源',
      dataIndex: 'source_link',
      key: 'source_link',
      render: (_, record) => [
        <a href={record.source_link} target="view_window">
          {record.source_title}
        </a>,
      ],
    },
    {
      title: '已读',
      dataIndex: 'readed',
      key: 'readed',
      renderText: (val: boolean) => (val ? '是' : '否'),
    },
    {
      title: '发送者',
      dataIndex: 'sender',
      render: (_, record) => [
        <span>
          <Avatar src={record.sender?.avatar}></Avatar> {record.sender?.nick_name}
        </span>,
      ],
    },
    {
      title: '接收时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
    },
  ];
  return (
    <ProTable<MESSAGE.InsiteMessageEventInfo, MESSAGE.AccountInsiteMessageReq>
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
        const resp = await GetInsiteMessageEventAllApp({
          account_id: uid,
          type: -1,
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

export default AccountMessage;
