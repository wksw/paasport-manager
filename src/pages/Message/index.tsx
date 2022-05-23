import React, { useState } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { GetMessages, GetMessageStatus } from '@/services/paasport/message/message_umirequest';
import { MessageType } from '@/services/paasport/common/common';
import { MessageStatusEnum, MessageTypeEnum } from '@/services/paasport';
import { Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

const MessageStatus: React.FC<MESSAGE.MessageInfo> = (props) => {
  const { id, type, params, template_id } = props;
  const columns: ProColumns<MESSAGE.MessageStatus>[] = [
    {
      title: '目的地',
      dataIndex: 'destination',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: MessageStatusEnum,
    },
    {
      title: '错误信息',
      dataIndex: 'error',
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
      render: (_, record) => [
        type == MessageType.M_EAMIL && (
          <a
            href={
              process.env.base_url + '/a1/static/template?id=' + template_id + '&params=' + params
            }
            target="view_window"
          >
            预览
          </a>
        ),
      ],
    },
  ];
  return (
    <ProTable
      toolBarRender={false}
      search={false}
      columns={columns}
      params={{ id: id }}
      request={async (
        params: any & {
          pageSize: number;
          current: number;
        },
        sort,
        filter,
      ) => {
        const resp = await GetMessageStatus({
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

const Messages: React.FC = () => {
  // const [auditDetailVisible, setAuditDetailVisible] = useState(false)
  // const [modal, contextHolder] = Modal.useModal();
  const [messageVisible, setMessageVisible] = useState(false);
  const [messageInfo, setMessageInfo] = useState<MESSAGE.MessageInfo>({});
  const columns: ProColumns<MESSAGE.MessageInfo>[] = [
    {
      title: '目的地',
      key: 'destination',
      valueType: 'text',
      dataIndex: 'destination',
      ellipsis: true,
    },
    {
      title: '消息类型',
      key: 'type',
      dataIndex: 'type',
      valueEnum: MessageTypeEnum,
    },
    {
      title: '发送模版',
      key: 'template_id',
      dataIndex: 'template_id',
    },
    {
      title: '发送应用',
      key: 'app_id',
      dataIndex: 'app_id',
      valueType: 'text',
    },
    {
      title: '发送者',
      key: 'sender',
      dataIndex: 'sender',
      valueType: 'text',
    },
    {
      title: '消息数量',
      key: 'total_num',
      dataIndex: 'total_num',
    },
    {
      title: '已发送',
      key: 'sended_num',
      dataIndex: 'sended_num',
    },
    {
      title: '成功量',
      key: 'success_num',
      dataIndex: 'success_num',
    },
    {
      title: '失败量',
      key: 'fail_num',
      dataIndex: 'fail_num',
    },
    {
      title: '正在发送',
      key: 'running_num',
      dataIndex: 'running_num',
    },
    {
      title: '状态',
      key: 'status',
      valueEnum: MessageStatusEnum,
      valueType: 'select',
      dataIndex: 'status',
    },
    {
      title: '发送时间',
      key: 'created_at',
      valueType: 'dateTime',
      dataIndex: 'created_at',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          onClick={() => {
            setMessageInfo(record);
            setMessageVisible(!messageVisible);
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
          console.log('----params', params);
          const resp = await GetMessages({
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

      <Modal
        visible={messageVisible}
        onCancel={() => setMessageVisible(!messageVisible)}
        closable={false}
        centered
        footer={null}
        maskClosable={true}
        width={1000}
      >
        <MessageStatus
          id={messageInfo.id}
          type={messageInfo.type}
          params={messageInfo.params}
          template_id={messageInfo.template_id}
        ></MessageStatus>
      </Modal>
    </PageContainer>
  );
};

export default Messages;
