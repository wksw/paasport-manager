import { RequestProviderEvent, TransportProvider } from '@/services/paasport';
import { GetErrors } from '@/services/paasport/transport/v2/transport_v2_umirequest';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Modal } from 'antd';
import React, { useState } from 'react';

const TransportError: React.FC = () => {
    const [detailVisible, setDetailVisible] = useState(false);
    const [detail, setDetail] = useState({});
    const columns: ProColumns<TRANSPORT_V2.TransportErrorResp_Data>[] = [
        {
            title: '方法',
            dataIndex: 'method',
            valueType: 'checkbox',
            valueEnum: RequestProviderEvent,
        },
        {
            title: '错误信息',
            dataIndex: 'error',
            hideInSearch: true,
            ellipsis: true,
        },
        {
            title: '供应商',
            dataIndex: 'provider',
            valueEnum: TransportProvider,
            initialValue: '0',
        },
        {
            title: '发生时间',
            hideInSearch: true,
            sorter: true,
            valueType: 'dateTime',
            dataIndex: 'created_at',
        },
        {
            title: '操作',
            valueType: 'option',
            render: (_, record) => [
                <a onClick={() => {
                    setDetailVisible(!detailVisible);
                    setDetail({
                        ...record,
                        request: JSON.parse(record.request || '{}'),
                        response: JSON.parse(record.response || '{}'),
                        error: JSON.parse(record.error || '{}')
                    })
                }}>详情</a>
            ]
        }
    ]
    return (
        <>
            <ProTable
                options={{
                    density: false,
                    setting: false,
                }}
                rowKey={record => record.id || ''}
                columns={columns}
                request={async (
                    params: any & {
                        pageSize: number;
                        current: number;
                    },
                    sort,
                    filter,
                ) => {
                    console.log("params=", params);
                    let sortStr = "";
                    Object.keys(sort).forEach(element => {
                        if (sort[element] == "ascend") {
                            sortStr += ",+" + element
                        } else {
                            sortStr += ",-" + element
                        }
                    })
                    sortStr = sortStr.replace(/^(\s|,)+|(\s|,)+$/, '');
                    let methods = "";
                    if (params.method) {
                        methods = params.method.join();
                    }
                    const resp = await GetErrors({
                        page: params.current,
                        size: params.pageSize,
                        sort: sortStr,
                        methods: methods,
                        provider: params.provider,
                    });
                    return {
                        data: resp.data,
                        success: true,
                        total: resp.total,
                    };
                }}
            ></ProTable>
            <Modal
                visible={detailVisible}
                onCancel={() => setDetailVisible(!detailVisible)}
                closable={false}
                centered
                footer={null}
                maskClosable={true}
                width={700}
            >
                <pre style={{ width: '650px' }}>{JSON.stringify(detail, null, 2)}</pre>
            </Modal>
        </>
    )
}

export default TransportError;