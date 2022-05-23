import ProCard from '@ant-design/pro-card';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import React, { useEffect, useState } from 'react';
import {
  GetAllowAddresses,
  GetAllowDevices,
  GetDenyLoginTypes,
} from '@/services/paasport/auth/auth_umirequest';
import { Checkbox, CheckboxOptionType } from 'antd';
import { LoginTypeEnum } from '@/services/paasport';
// import Login from '../Login';

const SecurityIP: React.FC<COMMON.ReqWithUid> = (props) => {
  const { uid } = props;
  const columns: ProColumns<AUTH.AllowAddressInfo>[] = [
    {
      title: 'IP地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      key: 'created_at',
      valueType: 'dateTime',
    },
  ];
  return (
    <ProTable
      columns={columns}
      toolBarRender={false}
      search={false}
      request={async (
        params: any & {
          pageSize: number;
          current: number;
        },
        sort,
        filter,
      ) => {
        const resp = await GetAllowAddresses({
          id: uid,
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

const SecurityDevice: React.FC<COMMON.ReqWithUid> = (props) => {
  const { uid } = props;
  const columns: ProColumns<AUTH.AllowAddressInfo>[] = [
    {
      title: '设备ID',
      dataIndex: 'device_id',
      key: 'device_id',
    },
    {
      title: '设备名称',
      dataIndex: 'device_name',
      ellipsis: true,
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      key: 'created_at',
      valueType: 'dateTime',
    },
  ];
  return (
    <ProTable
      columns={columns}
      toolBarRender={false}
      search={false}
      request={async (
        params: any & {
          pageSize: number;
          current: number;
        },
        sort,
        filter,
      ) => {
        const resp = await GetAllowDevices({
          id: uid,
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

const SecurityLogin: React.FC<COMMON.ReqWithUid> = (props) => {
  const { uid } = props;
  const loginTypes = Object.keys(LoginTypeEnum).map((key) => {
    return { label: LoginTypeEnum[key], value: key };
  });
  const [loginTypeValues, setLoginTypeValues] = useState(loginTypes.map((key) => key.value));
  useEffect(() => {
    async function fetchData() {
      const resp = await GetDenyLoginTypes({
        id: uid,
        size: 10000,
      });
      if (resp.total_count !== 0) {
        const values = [...loginTypeValues];
        resp.data.forEach((v, i) => {
          loginTypeValues.forEach((v1, i1) => {
            if (v.type == v1) {
              values.splice(i1, 1);
            }
          });
        });
        setLoginTypeValues(values);
      }
    }
    fetchData();
  }, []);
  console.log('-----loginTypes', loginTypes);
  return <Checkbox.Group options={loginTypes} value={loginTypeValues}></Checkbox.Group>;
};

const AccountSecurity: React.FC<COMMON.ReqWithUid> = (props) => {
  const { uid } = props;

  return (
    <div>
      <ProCard bordered type="inner" title="IP白名单">
        <SecurityIP uid={uid} />
      </ProCard>
      <ProCard bordered type="inner" title="设备白名单">
        <SecurityDevice uid={uid} />
      </ProCard>
      <ProCard bordered type="inner" title="登录白名单">
        <SecurityLogin uid={uid} />
      </ProCard>
    </div>
  );
};
export default AccountSecurity;
