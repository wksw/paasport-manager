import React, { useState } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { GetAccountAudits } from '@/services/paasport/audit/audit_umirequest';
import { AuditStatusEnum } from '@/services/paasport';
import { AuditDetail } from '@/components/Audit';

// 账户审计
const AccountAudit: React.FC<COMMON.ReqWithIdPage> = (props) => {
  const { id } = props;
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
    <div>
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
          const resp = await GetAccountAudits({
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
      <AuditDetail
        auditDetail={auditDetail}
        visible={auditDetailVisible}
        cancel={(visible) => setAuditDetailVisible(visible)}
      />
    </div>
  );
};

export default AccountAudit;
