import React, { useState } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { GetAll as GetAudits } from '@/services/paasport/audit/audit_umirequest';
import { AuditStatusEnum } from '@/services/paasport';
import { AuditDetail } from '@/components/Audit';
import { Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';

const Audits: React.FC = () => {
  const [auditDetail, setAuditDetail] = useState<AUDIT.AuditInfo>({});
  const [auditDetailVisible, setAuditDetailVisible] = useState(false);
  const columns: ProColumns<AUDIT.AuditInfo>[] = [
    {
      title: '接口',
      key: 'api',
      valueType: 'text',
      dataIndex: 'api',
    },
    {
      title: '应用',
      key: 'app_id',
      dataIndex: 'app_id',
      valueType: 'text',
    },
    {
      title: '账户',
      key: 'account',
      dataIndex: 'account_id',
      render: (_, record) => [
        record.account_id !== '0' ? (
          <Link to={'/account/' + record.account_id + '/detail'}>{record.account_id}</Link>
        ) : (
          '-'
        ),
      ],
    },
    {
      title: '状态',
      key: 'status',
      valueEnum: AuditStatusEnum,
      valueType: 'select',
      dataIndex: 'status',
    },
    {
      title: '源IP',
      key: 'source_ip',
      dataIndex: 'source_ip',
      valueType: 'text',
    },
    {
      title: '审计版本',
      key: 'version',
      valueType: 'text',
      dataIndex: 'version',
    },
    {
      title: '耗时(ms)',
      key: 'duration',
      valueType: 'text',
      dataIndex: 'duration',
    },
    {
      title: '审计时间',
      key: 'created_at',
      sorter: true,
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
            setAuditDetail(record);
            setAuditDetailVisible(true);
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
      <ProTable<AUDIT.AuditInfo, COMMON.ReqWithFiltePage>
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
          const resp = await GetAudits({
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
        rowKey="key"
      ></ProTable>
      <AuditDetail
        auditDetail={auditDetail}
        visible={auditDetailVisible}
        cancel={(visible: boolean) => setAuditDetailVisible(visible)}
      />
    </PageContainer>
  );
};

export default Audits;
