import React, { useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns, TableDropdown } from '@ant-design/pro-table';
import { DeleteMessageTemplate, GetMessageTemplates, OpenCloseTemplate } from '@/services/paasport/message/message_umirequest';
import { MessageTypeEnum } from '@/services/paasport';
import { PageContainer } from '@ant-design/pro-layout';
import { StatusBool } from '@/services/paasport/common/common';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TemplateEditor from './components/TemplateEditor';
import { Get as GetStorage } from '@/storage/storage';
// import defineConfig from '../../../../config/config';

// const { base_url } = defineConfig;

const Templates: React.FC = () => {
  const [editorVisible, setEditorVisible] = useState(false);
  const [templateInfo, setTemplateInfo] = useState({});
  const [editorModel, setEditorModel] = useState("create")
  const ref = useRef<ActionType>();
  const deleteTemplate = async (id: string) => {
    await DeleteMessageTemplate({ id: id })
    ref.current?.reload()
  }
  const enableTemplate = async (record: MESSAGE.MessageTemplateInfo) => {
    await OpenCloseTemplate({ template_id: record.id, enabled: !record.enabled })
    ref.current?.reload()
  }
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
        <a onClick={() => {
          setEditorVisible(!editorVisible)
          setTemplateInfo(record);
          setEditorModel("update")
        }}>编辑</a>,
        <TableDropdown
          key="actionGroup"
          menus={[
            {
              key: 'preview', name: <Button type='link'
                onClick={() => window.open(`${GetStorage("PAASPORT-ENDPOINT")}/a1/static/template?id=${record.id}&params=${record.params}`, "_blank")}
                disabled={record.render_self != StatusBool.SB_TRUE}
              >预览</Button>
            },
            { key: 'delete', name: <Button type="link" onClick={() => deleteTemplate(record.id)}>删除</Button> },
            { key: 'enable', name: <Button type='link' onClick={() => enableTemplate(record)}>{record.enabled ? '禁用' : '启用'}</Button> }
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
      <ProTable<MESSAGE.MessageInfo, COMMON.ResultWithPage>
        toolbar={{
          title: (<Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => {
            setEditorVisible(!editorVisible)
            setTemplateInfo({});
            setEditorModel("create");
          }}>新建</Button>),
        }}
        options={{
          density: false,
          setting: false,
        }}
        search={false}
        columns={columns}
        actionRef={ref}
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
      <TemplateEditor visible={editorVisible}
        templateInfo={templateInfo}
        model={editorModel}
        cancel={(visible: boolean) => {
          ref.current?.reload();
          setEditorVisible(visible)
        }} />
    </PageContainer>
  );
};

export default Templates;

