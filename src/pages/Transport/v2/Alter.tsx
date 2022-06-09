import { TransportAlterEvent, TransportAlterResolved } from '@/services/paasport';
import { GetAlters } from '@/services/paasport/transport/v2/transport_v2_umirequest';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import React from 'react';
import { Link } from 'umi';

const TransportAlter: React.FC = (props) => {
    const { location: { query } } = props;
    const columns: ProColumns<TRANSPORT_V2.TransportAlterResp_Data>[] = [
        {
            title: '物流ID',
            hideInSearch: true,
            dataIndex: 'transport_id',
            renderText: (_, record) => <Link to={{
                pathname: "/transport/v2/track",
                search: `?number=${record.transport_id}`
            }}> {record.transport_id}</ Link >
        },
        {
            title: '事件',
            dataIndex: 'event',
            valueType: 'checkbox',
            valueEnum: TransportAlterEvent,
        },
        {
            title: '原因',
            hideInSearch: true,
            dataIndex: 'reason',
        },
        {
            title: '是否已处理',
            valueEnum: TransportAlterResolved,
            dataIndex: 'resolved',
            initialValue: query.resolved || ''
        },
        {
            title: '发生时间',
            hideInSearch: true,
            sorter: true,
            valueType: 'dateTime',
            dataIndex: 'created_at',
        },
        {
            title: '处理时间',
            hideInSearch: true,
            sorter: true,
            valueType: 'dateTime',
            dataIndex: 'updated_at',
        }
    ]
    return (
        <ProTable
            options={{
                density: false,
                setting: false,
            }}
            rowKey={record => record.transport_id || ''}
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
                let events = "";
                if (params.event) {
                    events = params.event.join();
                }
                const resp = await GetAlters({
                    page: params.current,
                    size: params.pageSize,
                    sort: sortStr,
                    all: params.resolved ? params.resolved == -1 : true,
                    events: events,
                    resolved: params.resolved ? params.resolved == -1 ? false : params.resolved : false
                });
                return {
                    data: resp.data,
                    success: true,
                    total: resp.total,
                };
            }}
        ></ProTable>
    )
}

export default TransportAlter;