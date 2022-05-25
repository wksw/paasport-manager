import { SettingOutlined } from '@ant-design/icons';
import { Affix, Button, Drawer, Modal, Popconfirm, Tooltip } from 'antd';
import { Set as SetStorage, Get as GetStorage } from '@/storage/storage';
import React, { useState } from 'react';
import { ProFormSelect } from '@ant-design/pro-form';


const EnvironmentSelect: React.FC = () => {
    const endpoints = [{
        label: '本地开发环境',
        value: 'http://paasport.com:9091'
    }, {
        label: 'IDC开发环境',
        value: 'https://cn-shenzhen.passport.zieldev.com:7443'
    }, {
        label: 'IDC生产环境',
        value: 'https://cn-shenzhen.passport.ziel.cn:7443',
    }, {
        label: '香港生产环境',
        value: 'https://passport-gw.zielhome.com',
    }];

    const tenants = {
        'http://paasport.com:9091': [{
            label: '主租户',
            value: 'paasport'
        }],
        'https://cn-shenzhen.passport.zieldev.com:7443': [{
            label: '主租户',
            value: 'paasport'
        }, {
            label: '测试租户',
            value: 'test'
        }],
        'https://cn-shenzhen.passport.ziel.cn:7443': [{
            label: '主租户',
            value: 'paasport'
        }],
        'https://passport-gw.zielhome.com': [{
            label: '主租户',
            value: 'paasport'
        }, {
            label: '测试租户',
            value: 'test'
        }, {
            label: 'DE租户',
            value: 'de'
        }, {
            label: 'FR租户',
            value: 'fr'
        }, {
            label: 'GB租户',
            value: 'gb'
        }, {
            label: 'US租户',
            value: 'us'
        }]
    }

    let localEndpoint = GetStorage('PAASPORT-ENDPOINT')
    if (localEndpoint == null) {
        localEndpoint = endpoints[0].value
        SetStorage('PAASPORT-ENDPOINT', localEndpoint, -1)
    }

    const endpointTenants = tenants[localEndpoint]

    let localTenant = GetStorage('PAASPORT-CURRENT-TENANT')
    if (localTenant == null) {
        localTenant = tenants[localEndpoint][0].value
        SetStorage('PAASPORT-CURRENT-TENANT', localTenant, -1)
    }

    const [currentTenant, setCurrentTenant] = useState(localTenant)
    const [currentEndpoint, setCurrentEndpoint] = useState(localEndpoint)
    const [visible, setVisible] = useState(false);

    return (
        <div>
            < Button
                type='primary'
                shape="circle"
                size='large'
                icon={< SettingOutlined />}
                onClick={() => setVisible(!visible)}
                style={{ width: '3rem', height: '3rem', position: 'fixed', bottom: '5rem', right: '2rem', zIndex: 9999 }} />
            <Modal
                visible={visible}
                closable={false}
                mask={false}
                maskClosable={true}
                width={250}
                footer={null}
                style={{ top: 700, left: 700 }}
                onCancel={() => setVisible(!visible)}
            >
                <ProFormSelect
                    request={async () => endpoints}
                    name="endpoint"
                    placeholder='请选择环境'
                    fieldProps={{
                        defaultValue: localEndpoint,
                        onChange: (value) => {
                            console.log('------endpoint changed', value)
                            setCurrentTenant(tenants[value][0].value)
                            setCurrentEndpoint(value)
                            SetStorage('PAASPORT-ENDPOINT', value, -1);
                            SetStorage('PAASPORT-CURRENT-TENANT', tenants[value][0].value, -1);
                        }
                    }}
                />
                <ProFormSelect
                    // request={async (param) => {
                    //     console.log("-----------param", param);
                    //     return param.endpoint ? tenants[param.endpoint] : endpointTenants
                    // }}
                    name="tenant"
                    fieldProps={{
                        value: currentTenant,
                        options: tenants[currentEndpoint],
                        onChange: (value) => {
                            setCurrentTenant(value)
                            SetStorage('PAASPORT-CURRENT-TENANT', value, -1);
                        }
                    }}
                    placeholder='请选择租户'
                />
            </Modal>
        </div>
    )
}

export default EnvironmentSelect;
