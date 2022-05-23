import ProCard from '@ant-design/pro-card';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import React, { useEffect, useState } from 'react';
import { LoginTypeEnum } from '@/services/paasport';
import { GetDeviceLoginInfo, GetDevices } from '@/services/paasport/login/login_umirequest';
import styles from './split.less';

// 登录历史
const DeviceLoginHistory: React.FC<COMMON.ReqWithAccountDevice> = (props) => {
  const { account_id, device_id } = props;
  const [params, setParams] = useState({ account_id: account_id, device_id: device_id });
  useEffect(() => {
    if (device_id != undefined || device_id !== '') {
      setParams({
        account_id: account_id,
        device_id: device_id,
      });
    }
  }, [device_id]);

  const colums: ProColumns<LOGIN.LoginInfo>[] = [
    {
      title: '登录IP',
      key: 'login_ip',
      valueType: 'text',
      dataIndex: 'login_ip',
      search: false,
    },
    {
      title: '登录应用',
      key: 'app',
      // valueType: 'text',
      dataIndex: 'app_id',
      search: false,
      // renderText: (val) => val,
    },
    {
      title: '登录类型',
      valueEnum: LoginTypeEnum,
      dataIndex: 'login_type',
      search: false,
      valueType: 'select',
      key: 'login_type',
    },
    {
      title: '登录时间',
      key: 'login_time',
      dataIndex: 'login_time',
      valueType: 'dateTime',
      search: false,
    },
  ];
  return (
    <ProTable<LOGIN.LoginInfo, COMMON.ReqWithAccountDevicePage>
      search={false}
      toolBarRender={false}
      columns={colums}
      params={params}
      options={false}
      request={async (
        params: any & {
          pageSize: number;
          current: number;
        },
        sort,
        filter,
      ) => {
        const resp = await GetDeviceLoginInfo({
          account_id: params.account_id,
          device_id: params.device_id,
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

// 账户设备请求参数
type AccountDevicesProps = {
  uid: string | undefined;
  onChange: (deviceId: string | undefined) => void;
};

// 账户设备
const AccountDevices: React.FC<AccountDevicesProps> = (props) => {
  const { onChange, uid } = props;
  const [deviceInfo, setDeviceInfo] = useState<LOGIN.DeviceInfo>({});
  useEffect(() => {
    onChange(deviceInfo?.device_id);
  }, [deviceInfo]);
  const columns: ProColumns<LOGIN.LoginInfo>[] = [
    {
      title: '设备名称',
      key: 'device_name',
      valueType: 'text',
      ellipsis: true,
      dataIndex: 'device_name',
    },
    {
      title: '终端类型',
      dataIndex: 'terminal_type',
      key: 'terminal_type',
      ellipsis: true,
      valueType: 'text',
    },
    {
      title: '登录次数',
      key: 'count',
      valueType: 'text',
      dataIndex: 'count',
    },
    {
      title: '首次登录时间',
      sorter: true,
      key: 'created_at',
      dataIndex: 'created_at',
      valueType: 'dateTime',
    },
    {
      title: '最近登录时间',
      key: 'updated_at',
      sorter: true,
      dataIndex: 'updated_at',
      valueType: 'dateTime',
    },
  ];
  return (
    <ProTable<LOGIN.DeviceInfo, COMMON.ReqWithIdPage>
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
        const resp = await GetDevices({
          id: uid,
          page: params.current,
          size: params.pageSize,
          sort_field: Object.keys(sort).join(','),
          sort_order: Object.values(sort)[0]?.substring(0, 3),
        });
        setDeviceInfo(resp.data[0]);
        return {
          data: resp.data,
          success: true,
          total: resp.total_count,
        };
      }}
      onRow={(record) => {
        return {
          onClick: () => {
            if (record.device_id) {
              setDeviceInfo(record);
            }
          },
        };
      }}
      rowKey="ip"
      rowClassName={(record) => {
        return record.device_id === deviceInfo.device_id ? styles['split-row-select-active'] : '';
      }}
    ></ProTable>
  );
};

// 登录设备
const AccountDevice: React.FC<COMMON.ReqWithUid> = (props) => {
  const { uid } = props;
  const [deviceId, setDeviceId] = useState<string | undefined>('');
  return (
    <ProCard split="vertical">
      <ProCard>
        <AccountDevices uid={uid} onChange={(dId: string | undefined) => setDeviceId(dId)} />
      </ProCard>
      <ProCard>
        <DeviceLoginHistory account_id={uid} device_id={deviceId} />
      </ProCard>
    </ProCard>
  );
};

export default AccountDevice;
