import { TransportAlterEvent, TransportAlterResolved, TransportPackageStatusEnumV2, TransportPackageSubStatusEnum, TransportProvider, TransportStatusEnumV2 } from '@/services/paasport';
import { GetAlters } from '@/services/paasport/transport/v2/transport_v2_umirequest';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import React, { useState } from 'react';
import carriers from '@/services/17track_carriers';
import { getCarrierV2 } from '@/utils/utils';
import { packageStatusIcon } from '@/components/Transport';
import { Divider, Drawer, Space, Timeline, Typography } from 'antd';
import { Link } from 'umi';
import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import ProDescriptions from '@ant-design/pro-descriptions';
import Detail from './components/detail';

const TransportAlter: React.FC = (props) => {
    const { location: { query } } = props;
    const [detail, setDetail] = useState<TRANSPORT_V2.TrackInfo>({});
    const [transportVisible, setTransportVisible] = useState(false);
    const columns: ProColumns<TRANSPORT_V2.TransportAlterResp_Data>[] = [
        {
            title: '单号',
            dataIndex: 'track_info.number',
            key: 'track_info.number',
            copyable: true,
            hideInSearch: true,
            width: 200,
            renderText: (_, record) => record.track_info.number
        },
        {
            title: '运输商',
            dataIndex: 'track_info.carrier',
            key: 'carrier',
            hideInSearch: true,
            valueEnum: () => {
                let carrierEnum = {}
                carrierEnum['0'] = "所有";
                carriers.forEach(element => {
                    carrierEnum[element.key] = element._name
                })
                return carrierEnum
            },
            render: (_, record) => [getCarrierV2(record.track_info)],
        },
        {
            title: '订单号',
            dataIndex: 'track_info.order_id',
            key: 'order_id',
            valueType: 'text',
            copyable: true,
            hideInSearch: true,
            width: 200,
            renderText: (_, record) => record.track_info.order_id
        },
        {
            title: '物流状态',
            dataIndex: 'track_info.track_status',
            key: 'track_status',
            valueEnum: TransportStatusEnumV2,
            hideInSearch: true,
            renderText: (_, record) => record.track_info.track_status
        },
        {
            title: '包裹状态',
            dataIndex: 'track_info.package_status',
            hideInSearch: true,
            key: 'package_status',
            valueEnum: TransportPackageStatusEnumV2,
            initialValue: query.package_status || '',
            render: (_, record) => [
                packageStatusIcon(record.track_info.package_status, 15),
                <span> {TransportPackageStatusEnumV2[record.track_info.package_status]} {TransportPackageSubStatusEnum[record.track_info.package_sub_status]}</span>,
            ],
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
            title: '物流创建时间',
            hideInSearch: true,
            sorter: true,
            valueType: 'dateTime',
            dataIndex: 'track_info.created_at',
            renderText: (_, record) => record.track_info.created_at
        },
        {
            title: '物流最后更新时间',
            hideInSearch: true,
            sorter: true,
            valueType: 'dateTime',
            dataIndex: 'track_info.updated_at',
            renderText: (_, record) => record.track_info.updated_at
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
        },
        {
            title: '操作',
            valueType: 'option',
            render: (_, record) => [
                <a
                    onClick={() => {
                        // console.log('----track', record);
                        setDetail(record.track_info);
                        setTransportVisible(!transportVisible);
                    }}
                >
                    详情
                </a>,
            ],
        },
    ]
    return (
        <>
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
            <Detail detail={detail} visible={transportVisible} onClose={(visible: boolean) => setTransportVisible(visible)} />
        </>
    )
}

export default TransportAlter;