import { Divider, Tabs, Avatar, Badge, Space } from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams, Link } from 'umi';
import { GetByIdWithDeleted as GetAccountById } from '@/services/paasport/account/account_umirequest';
import { GetApp } from '@/services/paasport/application/application_umirequest';
import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import { GenderEnum, RegisteTypeEnum } from '@/services/paasport';
import AccountDevice from './device';
import AccountProtocol from './protocol';
import AccountAudit from './audit';
import AccountMessage from './message';
import AccountPermission from './permission';
import AccountSecurity from './security';
import AccountAddress from './address';
import { PageContainer } from '@ant-design/pro-layout';
import ProDescriptions from '@ant-design/pro-descriptions';
import { ProColumns } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import AccountSubscribes from './subscribe';

const AccountDetail: React.FC = () => {
  const { uid } = useParams();
  const [activeTab, setActiveTab] = useState('');
  const [accountInfo, setAccountInfo] = useState<ACCOUNT.AccountInfo>({});
  const [registeApp, setRegisteApp] = useState<APPLICATION.AppInfo>({});

  const columns: ProColumns<ACCOUNT.AccountInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'uid',
      copyable: true,
    },
    {
      title: '姓',
      dataIndex: 'firstname',
    },
    {
      title: '名',
      dataIndex: 'lastname',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueEnum: GenderEnum,
    },
    {
      title: '签名',
      dataIndex: 'signature',
    },
    {
      title: '绑定邮箱',
      dataIndex: 'email',
      copyable: true,
      render: (_, record) => [record?.email?.email && <a>{record.email.email}</a>],
    },
    {
      title: '绑定手机',
      dataIndex: 'phone',
      copyable: true,
      render: (_, record) => [record?.phone?.phone && <a>{record.phone.phone}</a>],
    },
    {
      title: '生日',
      dataIndex: 'birthday',
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
    },
    {
      title: '注册IP',
      dataIndex: 'remote_address',
    },
    {
      title: '注册设备',
      dataIndex: 'device_name',
    },
    {
      title: '注册方式',
      dataIndex: 'registe_type',
      valueEnum: RegisteTypeEnum,
    },
    {
      title: '注册应用',
      dataIndex: 'app_id',
      render: (_, record) => [
        record.app_id !== '0' && (
          <Link to={'/app/' + record?.app_id + '/info'}>{registeApp?.name}</Link>
        ),
      ],
    },
  ];

  useEffect(() => {
    // 获取应用详情
    if (accountInfo.app_id && accountInfo.app_id !== '0') {
      GetApp({ id: accountInfo.app_id }).then((resp: APPLICATION.AppInfo) => {
        setRegisteApp(resp);
      });
    }
    if (accountInfo.uid) {
      setActiveTab('device');
    }
  }, [accountInfo]);

  return (
    <PageContainer
      header={{
        title: '',
      }}
    >
      <ProCard>
        <ProDescriptions
          title={
            <Space>
              <Avatar src={accountInfo?.avatar}></Avatar>{' '}
              {accountInfo?.name || accountInfo?.username || accountInfo.uid}
              {accountInfo?.deleted_at && accountInfo?.deleted_at !== '' && (
                <Badge count="已注销"></Badge>
              )}
            </Space>
          }
          request={async () => {
            const resp = await GetAccountById({ uid: uid });
            setAccountInfo(resp);
            return {
              success: true,
              data: resp,
            };
          }}
          columns={columns}
        ></ProDescriptions>
        <Divider />
        {accountInfo.uid && (
          <Tabs
            defaultActiveKey={activeTab}
            onChange={(key: string) => {
              setActiveTab(key);
            }}
          >
            <TabPane tab="设备" key="device">
              <AccountDevice uid={accountInfo?.uid}></AccountDevice>
            </TabPane>
            <TabPane tab="协议" key="protocol">
              <AccountProtocol id={accountInfo?.uid} />
            </TabPane>
            <TabPane tab="审计" key="audit">
              <AccountAudit id={accountInfo?.uid} />
            </TabPane>
            <TabPane tab="站内信" key="message">
              <AccountMessage uid={accountInfo?.uid} />
            </TabPane>
            <TabPane tab="权限" key="permission">
              <AccountPermission uid={accountInfo?.uid} />
            </TabPane>
            <TabPane tab="收货地址" key="address">
              <AccountAddress uid={accountInfo.uid} />
            </TabPane>
            <TabPane tab="安全" key="security">
              <AccountSecurity uid={accountInfo.uid} />
            </TabPane>
            <TabPane tab="订阅" key="subscribe">
              <AccountSubscribes uid={accountInfo?.uid} />
            </TabPane>
          </Tabs>
        )}
      </ProCard>
    </PageContainer>
  );
};

export default AccountDetail;
