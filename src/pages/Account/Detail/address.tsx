import ProTable, { ProColumns } from '@ant-design/pro-table';
import React from 'react';
import { GetAddresses } from '@/services/paasport/account/address/address_umirequest';

const AccountAddress: React.FC<COMMON.ReqWithUid> = (props) => {
  const { uid } = props;
  const columns: ProColumns<ACCOUNT.AccountAddress>[] = [
    {
      title: '收件人',
      dataIndex: 'consignee',
      key: 'consignee',
    },
    {
      title: '姓',
      dataIndex: 'firstname',
      key: 'firstname',
    },
    {
      title: '名',
      dataIndex: 'lastname',
      key: 'lastname',
    },
    {
      title: '手机号',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: '备用手机号',
      dataIndex: 'altemate_phone',
      key: 'altemate_phone',
    },
    {
      title: '国家',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: '省',
      dataIndex: 'province',
      key: 'province',
    },
    {
      title: '市',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: '区',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      ellipsis: true,
    },
    {
      title: '备用地址',
      dataIndex: 'address1',
      ellipsis: true,
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
  ];
  return (
    <ProTable<ACCOUNT.AccountAddress, ACCOUNT.ReqWithSearchPage>
      columns={columns}
      search={false}
      toolBarRender={false}
      rowKey="key"
      request={async (
        params: any & {
          pageSize: number;
          current: number;
        },
        sort,
        filter,
      ) => {
        const resp = await GetAddresses({
          id: uid,
          page: params.current,
          size: params.pageSize,
          sort_field: Object.keys(sort).join(','),
          sort_order: Object.values(sort)[0]?.substring(0, 3),
        });
        // setDeviceInfo(resp.data[0]);
        // onChange(resp.data[0].device_id)
        return {
          data: resp.data,
          success: true,
          total: resp.total_count,
        };
      }}
    ></ProTable>
  );
};

export default AccountAddress;
