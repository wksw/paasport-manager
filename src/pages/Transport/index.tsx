import ProTable, { ActionType, ProColumns, TableDropdown } from '@ant-design/pro-table';
import React, { useRef, useState } from 'react';
import {
  GetAllWithoutApp as GetTransports,
  ReAdd,
} from '@/services/paasport/transport/transport_umirequest';
import { TransportPackageStatusEnum, TransportStatusEnum } from '@/services/paasport';
import { packageStatusIcon, TransportDetail } from '@/components/Transport';
import { TransportStatus } from '@/services/paasport/common/common';
import { Modal } from 'antd';
import { getCarrier } from '@/utils/utils';
import { PageContainer } from '@ant-design/pro-layout';
// import moment from 'moment';

const Transport: React.FC = () => {
  const [detail, setDetail] = useState<TRANSPORT.TrackInfo>({});
  const [transportVisible, setTransportVisible] = useState(false);
  const ref = useRef<ActionType>();
  const reAdd = async (record: TRANSPORT.TrackInfo) => {
    console.log('---readd', record.id);
    await ReAdd({ id: record.id });
    ref.current?.reload();
  };
  const columns: ProColumns<TRANSPORT.TrackInfo>[] = [
    {
      title: '单号',
      dataIndex: 'number',
      key: 'number',
      copyable: true,
      width: 200,
    },
    {
      title: '运输商',
      dataIndex: 'carrier',
      key: 'carrier',
      render: (_, record) => [getCarrier(record)],
    },
    {
      title: '订单号',
      dataIndex: 'order_id',
      key: 'order_id',
      valueType: 'text',
      copyable: true,
      width: 200,
    },
    {
      title: '备注',
      dataIndex: 'note',
      valueType: 'text',
      search: false,
      ellipsis: true,
    },
    {
      title: '物流状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: TransportStatusEnum,
    },
    {
      title: '包裹状态',
      dataIndex: 'package_status',
      key: 'package_status',
      // valueEnum: TransportPackageStatusEnum,
      render: (_, record) => [
        packageStatusIcon(record.package_status, 15),
        <span> {TransportPackageStatusEnum[record.package_status]}</span>,
      ],
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '注册时间',
      valueType: 'dateRange',
      key: 'registe_at',
      hideInTable: true,
      // initialValue: [moment(), moment().add(1, 'day')],
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      valueType: 'dateRange',
      key: 'update_at',
      hideInTable: true,
      // initialValue: [moment(), moment().add(1, 'day')],
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a
          onClick={() => {
            console.log('----track', record);
            setDetail(record);
            setTransportVisible(!transportVisible);
          }}
        >
          详情
        </a>,
        (record.status == TransportStatus.TS_REGISTING ||
          record.status == TransportStatus.TS_REGISTE_FAIL) && (
          <TableDropdown
            key="actionGroup"
            menus={[{ key: 'reAdd', name: <a onClick={() => reAdd(record)}>重新注册</a> }]}
          />
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
      <ProTable<TRANSPORT.TrackInfo, TRANSPORT.FetchReq>
        // search={false}
        toolBarRender={false}
        rowKey="key"
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
          console.log('sort', sort, 'sort_keys', Object.keys(sort), 'filter', filter);
          console.log('request params', params, 'filters', filter);
          const resp = await GetTransports({
            number: params.number,
            carrier: params.carrier,
            order_id: params.order_id,
            status: params.status || -1,
            package_status: params.package_status || -1,
            page: params.current,
            size: params.pageSize,
            sort_field: Object.keys(sort).join(','),
            sort_order: Object.values(sort)[0]?.substring(0, 3) === 'asc' ? 'asc' : 'desc',
            registe_at_from: params?.registe_at?.[0] || '',
            registe_at_to: params?.registe_at?.[1] || '',
            updated_at_from: params?.update_at?.[0] || '',
            updated_at_to: params?.update_at?.[1] || '',
          });
          return {
            data: resp.data,
            success: true,
            total: resp.total_count,
          };
        }}
      ></ProTable>
      <Modal
        visible={transportVisible}
        onCancel={() => setTransportVisible(!transportVisible)}
        closable={false}
        centered
        footer={null}
        maskClosable={true}
        width={750}
      >
        <TransportDetail detail={detail} />
      </Modal>
    </PageContainer>
  );
};

export default Transport;
