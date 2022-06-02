import ProTable, { ActionType, ProColumns, TableDropdown } from '@ant-design/pro-table';
import React, { useRef, useState } from 'react';
import {
    GetTracks,
    Registe,
    DeleteTracks,
} from '@/services/paasport/transport/v2/transport_v2_umirequest';
import { packageStatusIcon, TransportDetail } from '@/components/Transport/v2';
import { TransportPackageStatusEnumV2, TransportStatusEnumV2, TransportPackageSubStatusEnum } from '@/services/paasport';
import { Button, Modal } from 'antd';
import { getCarrierV2 } from '@/utils/utils';
import { PageContainer } from '@ant-design/pro-layout';
import carriers from '@/services/17track_carriers';
import { history, useLocation } from 'umi';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';

const Transport: React.FC = (props) => {
    const { location: { query } } = props;
    const dateFormat = 'YYYY-MM-DD';
    console.log('----query', query);
    const [detail, setDetail] = useState<TRANSPORT_V2.TrackInfo>({});
    const [transportVisible, setTransportVisible] = useState(false);
    const ref = useRef<ActionType>();
    const reAdd = async (record: TRANSPORT_V2.TrackInfo) => {
        await Registe({ id: record.id });
        ref.current?.reload();
    };
    const deleteTransport = async (record: TRANSPORT_V2.TrackInfo) => {
        await DeleteTracks({
            tracks: [{ id: record.id }]
        })
        ref.current?.reload();
    }
    const columns: ProColumns<TRANSPORT_V2.TrackInfo>[] = [
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
            valueEnum: () => {
                let carrierEnum = {}
                carrierEnum['0'] = "所有";
                carriers.forEach(element => {
                    carrierEnum[element.key] = element._name
                })
                return carrierEnum
            },
            initialValue: query.carrier || '0',
            render: (_, record) => [getCarrierV2(record)],
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
            dataIndex: 'track_status',
            key: 'track_status',
            valueEnum: TransportStatusEnumV2,
            initialValue: query.track_status || '',
        },
        {
            title: '包裹状态',
            dataIndex: 'package_status',
            key: 'package_status',
            valueEnum: TransportPackageStatusEnumV2,
            initialValue: query.package_status || '',
            render: (_, record) => [
                packageStatusIcon(record.package_status, 15),
                <span> {TransportPackageStatusEnumV2[record.package_status]} {TransportPackageSubStatusEnum[record.package_sub_status]}</span>,
            ],
        },
        {
            title: '包裹子状态',
            dataIndex: 'package_sub_status',
            key: 'package_sub_status',
            valueEnum: TransportPackageSubStatusEnum,
            initialValue: query.package_sub_status || '',
            hideInTable: true,
        },
        {
            title: '行程',
            dataIndex: 'track',
            key: 'track',
            valueType: 'text',
            renderText: (_, record: TRANSPORT_V2.TrackInfo) => {
                console.log('----reocrd', record);
                if (record.package_status == 'DELIVERED') {
                    let route = '';
                    if (record.track.departure.country != '') {
                        route = record.track.departure.country
                    } else {
                        route = `Unknown`
                    }
                    if (record.track.departure.state != '') {
                        route = `${route}(${record.track.departure.state})`;
                    }
                    if (record.track.destination.country != '') {
                        route = `${route}->${record.track.destination.country}`;
                    } else {
                        route = `${route}->Unknown`
                    }
                    if (record.track.destination.state != '') {
                        route = `${route}(${record.track.destination.state})`;
                    }
                    return route;
                }
                return ''
            },
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
            key: 'created_at_from_to',
            hideInTable: true,
            initialValue: [query.begin_date || moment(moment().add(-30, "days"), dateFormat), query.end_date || moment(moment().add(1, 'days'), dateFormat)],
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
            key: 'updated_at_from_to',
            hideInTable: true,
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
                <TableDropdown
                    key="actionGroup"
                    menus={[
                        { key: 'reAdd', name: <Button type="link" onClick={() => reAdd(record)} disabled={record.track_status != "REGISTING" && record.track_status != "REGISTE_FAIL"}>重新注册</Button> },
                        { key: 'delete', name: <Button type="link" onClick={() => deleteTransport(record)} disabled={record.track_status == "DELTEING"}>删除</Button> },
                    ]}
                />,
            ],
        },
    ];
    return (
        <PageContainer
            header={{
                title: '',
                extra: [
                    <a onClick={() => history.push("/transport/list")}>v1版本</a>
                ]
            }}
        >
            <ProTable<TRANSPORT_V2.TrackInfo, TRANSPORT_V2.GetTrackReq>
                // search={false}
                toolbar={{
                    title: (<Button key="button" icon={<PlusOutlined />} type="primary">新建</Button>),
                }}
                options={{
                    density: false,
                    setting: false,
                }}
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
                    let sortStr = "";
                    Object.keys(sort).forEach(element => {
                        if (sort[element] == "ascend") {
                            sortStr += ",+" + element
                        } else {
                            sortStr += ",-" + element
                        }
                    })
                    sortStr = sortStr.replace(/^(\s|,)+|(\s|,)+$/, '');
                    const resp = await GetTracks({
                        number: params.number,
                        carrier: params.carrier,
                        order_id: params.order_id,
                        track_status: params.track_status || -1,
                        package_status: params.package_status || -1,
                        package_sub_status: params.package_sub_status || -1,
                        page: params.current,
                        size: params.pageSize,
                        sort: sortStr,
                        created_at_from: params.created_at_from_to ? moment(params?.created_at_from_to[0]).format("YYYY-MM-DDTHH:mm:ssZ") : '',
                        created_at_to: params.created_at_from_to ? moment(params?.created_at_from_to[1]).format("YYYY-MM-DDTHH:mm:ssZ") : '',
                        updated_at_from: params.updated_at_from_to ? moment(params?.updated_at_from_to[0]).format("YYYY-MM-DDTHH:mm:ssZ") : '',
                        updated_at_to: params.updated_at_from_to ? moment(params?.updated_at_from_to[1]).format("YYYY-MM-DDTHH:mm:ssZ") : '',
                    });
                    return {
                        data: resp.data,
                        success: true,
                        total: resp.total,
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
        </PageContainer >
    );
};

export default Transport;
