import ProTable, { ProColumns } from '@ant-design/pro-table';
import React from 'react';
import { GetAccountSubscriptions1 } from '@/services/paasport/account/subscribe/subscribe_umirequest';

const AccountSubscribes: React.FC<COMMON.ReqWithUid> = (props) => {
    const { uid } = props;
    const columns: ProColumns<ACCOUNT.SubscribeInfo>[] = [
        {
            title: '场景',
            dataIndex: 'scene',
            key: 'scene',
        },
        {
            title: '源',
            dataIndex: 'source_title',
            key: 'source_title',
            render: (_, record) => [
                <a href={record.source_link} target='window'>{record.source_title}</a>
            ]
        },
        {
            title: '消息类型',
            dataIndex: 'message_types',
            key: 'message_types'
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
        <ProTable<ACCOUNT.SubscribeInfo, COMMON.ReqWithFiltePage>
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
                const resp = await GetAccountSubscriptions1({
                    id: uid,
                    page: params.current,
                    size: params.pageSize,
                    sort_field: Object.keys(sort).join(','),
                    sort_order: Object.values(sort)[0]?.substring(0, 3),
                });
                return {
                    data: resp.scenes,
                    success: true,
                    total: resp.total_count,
                };
            }}
        ></ProTable>
    );
};

export default AccountSubscribes;
