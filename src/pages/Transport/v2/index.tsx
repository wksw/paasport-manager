import ProTable, { ActionType, ProColumns, TableDropdown } from '@ant-design/pro-table';
import React, { useRef, useState } from 'react';
import {
    GetTracks,
    Registe,
} from '@/services/paasport/transport/v2/transport_v2_umirequest';
import { packageStatusIcon, TransportDetail } from '@/components/Transport/v2';
import { Modal } from 'antd';
import { getCarrier } from '@/utils/utils';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import moment from 'moment';

const Transport: React.FC = () => {
    const [detail, setDetail] = useState<TRANSPORT_V2.TrackInfo>({});
    const [transportVisible, setTransportVisible] = useState(false);
    const ref = useRef<ActionType>();
    const reAdd = async (record: TRANSPORT_V2.TrackInfo) => {
        await Registe({ id: record.id });
        ref.current?.reload();
    };
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
            render: (_, record) => [getCarrier(record)],
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
            valueType: "text",
        },
        {
            title: '包裹状态',
            dataIndex: 'package_status',
            key: 'package_status',
            render: (_, record) => [
                packageStatusIcon(record.package_status, 15),
                <span> {record.package_status}</span>,
            ],
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
                (record.track_status == "REGISTING" ||
                    record.track_status == "REGISTE_FAIL") && (
                    <TableDropdown
                        key="actionGroup"
                        menus={[{ key: 'reAdd', name: <a onClick={() => reAdd(record)}>重新注册</a> }]}
                    />
                ),
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
                toolBarRender={false}
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
                        track_status: params.status || -1,
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
                        total: resp.total_count,
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
