import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
// import { Shipments } from '@/components/Transport/v2/Analysis/Shipments/Shipments';
// import { Exceptions } from '@/components/Transport/v2/Analysis/Shipments/Exceptions';
import { TotalShipments } from '@/components/Transport/v2/Analysis/Shipments/TotalShipments';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import { Button } from 'antd';
import ProForm, { ProFormDateRangePicker } from '@ant-design/pro-form';
// import { AnalysisReq } from '@/components/Transport/v2/Analysis/Shipments/typings.d';
import {
    TransportStatusAnalysis, TransportExceptionReasonAnalysis,
    TransportExceptionByCarrierAnalysis, TransportDeliveredAndNoDeliveredAnalysis,
    TransportCountWithCarrierAnalysis
} from '@/services/paasport/transport/v2/transport_v2_umirequest';
import { Space, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/plots';
const { Text, Link } = Typography
import { Pie } from '@ant-design/plots';
import { Bar } from '@ant-design/plots';


const Dashboard: React.FC = () => {
    const dateFormat = 'YYYY-MM-DD';
    const rfc3339 = 'YYYY-MM-DDTHH:mm:ssZ';
    const [analysisReq, setAnalysisReq] = useState({
        begin_date: moment(moment().add(-30, "days"), dateFormat),
        end_date: moment(moment().add(1, "days"), dateFormat),
        app_id: '0',
        carrier: 0,
        provider: -1,
    })
    const [transportStatus, setTransportStatus] = useState({});
    const [transportExceptions, setTransportExceptions] = useState({});
    const [transportExceptionReasons, setTransportExceptionReasons] = useState({});
    const [transportOverTime, setTransportOverTime] = useState([]);
    const [transportWithCarrier, setTransportWithCarrier] = useState([]);
    const dateRangeConfig = {
        name: 'startEnd',
        format: dateFormat,
    }
    const [statstic, setStatstic] = useState({
        total: 0,
        exceptions: {
            total: 0,
            percent: 0.00
        },
        returnToSender: {
            total: 0,
            percent: 0.00
        },
        delivered: {
            total: 0,
            percent: 0.00
        }
    });
    useEffect(() => {
        const getTransportStatusAnalysis = async () => {
            const resp = await TransportStatusAnalysis({
                begin_date: analysisReq.begin_date?.format(rfc3339),
                end_date: analysisReq.end_date?.format(rfc3339),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            let exceptionTotal = 0;
            let delivered = 0;
            if (resp.data) {
                resp.data.forEach((element: any) => {
                    if (element.package_status == "DELIVERED") {
                        delivered = element.total;
                    }
                    if (element.package_status == "EXCEPTION") {
                        exceptionTotal = element.total;
                    }
                });
            }
            setStatstic({
                ...statstic,
                total: resp.total,
                exceptions: {
                    total: exceptionTotal,
                    percent: (exceptionTotal / resp.total * 100).toFixed(2),
                },
                delivered: {
                    total: delivered,
                    percent: (delivered / resp.total * 100).toFixed(2)
                }
            })
            setTransportStatus(resp);
        }
        const getTransportExceptionReasons = async () => {
            const resp = await TransportExceptionReasonAnalysis({
                begin_date: analysisReq.begin_date?.format(rfc3339),
                end_date: analysisReq.end_date?.format(rfc3339),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            if (resp.data) {
                let returnToSender = 0
                resp.data.forEach(element => {
                    if (element.package_sub_status == "EXCEPTION_RETURNING" || element.package_sub_status == "EXCEPTION_RETURNED") {
                        returnToSender += element.total;
                    }
                })
                setStatstic({
                    ...statstic,
                    returnToSender: {
                        total: returnToSender,
                        percent: returnToSender / statstic.total * 100,
                    },
                })
            }
            setTransportExceptionReasons(resp)
        }
        const getTransportExceptions = async () => {
            const resp = await TransportExceptionByCarrierAnalysis({
                begin_date: analysisReq.begin_date?.format(rfc3339),
                end_date: analysisReq.end_date?.format(rfc3339),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            setTransportExceptions(resp)
        }
        const getTransportOvertime = async () => {
            const resp = await TransportDeliveredAndNoDeliveredAnalysis({
                begin_date: analysisReq.begin_date?.format(dateFormat),
                end_date: analysisReq.end_date?.format(dateFormat),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            setTransportOverTime(resp.data)
        }
        const getTransportCountWithCarrier = async () => {
            const resp = await TransportCountWithCarrierAnalysis({
                begin_date: analysisReq.begin_date?.format(rfc3339),
                end_date: analysisReq.end_date?.format(rfc3339),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            setTransportWithCarrier(resp.data)
        }
        getTransportStatusAnalysis();
        getTransportExceptionReasons();
        getTransportExceptions();
        getTransportOvertime();
        getTransportCountWithCarrier();
    }, [analysisReq])
    return (
        <PageContainer
            header={{
                title: ''
            }}
        >
            <ProCard >
                <ProForm layout='inline'
                    autoFocusFirstInput={false}
                    initialValues={{
                        startEnd: [analysisReq.begin_date, analysisReq.end_date]
                    }}
                    onFinish={async (values) => {
                        setAnalysisReq({
                            ...analysisReq,
                            begin_date: moment(values.startEnd[0], dateFormat),
                            end_date: moment(values.startEnd[1], dateFormat),
                        })
                    }}
                    submitter={{
                        resetButtonProps: {
                            style: {
                                display: 'none'
                            }
                        },
                        submitButtonProps: {
                            style: {
                                display: 'none'
                            }
                        }
                    }}
                >
                    <ProFormDateRangePicker {...dateRangeConfig} />
                    <Button type="primary" htmlType='submit'>Apply</Button>
                </ProForm>
            </ProCard>
            <ProCard ghost gutter={8} style={{ marginTop: 16 }}>
                <ProCard
                    title={<Text type="secondary">Total</Text>}
                    extra={<RightOutlined
                        onClick={() => {
                        }}
                    />}
                >
                    <Space direction='vertical'>
                        <Text style={{ fontSize: 20 }}>{statstic.total}</Text>
                        <Text type="secondary" style={{ visibility: 'hidden' }}> empty</Text>
                    </Space>
                </ProCard>
                <ProCard
                    title={<Text type="secondary">EXCEPTION</Text>}
                    extra={<RightOutlined
                        onClick={() => {
                        }}
                    />}
                >
                    <Space direction='vertical'>
                        <Text style={{ fontSize: 20 }}>{statstic.exceptions.total}</Text>
                        <Text type="secondary">{statstic.exceptions.percent}% of total shipments</Text>
                    </Space>
                </ProCard>
                <ProCard
                    title={<Text type="secondary">RETURNED TO SENDER</Text>}
                    extra={<RightOutlined
                        onClick={() => {
                        }}
                    />}
                >
                    <Space direction='vertical'>
                        <Text style={{ fontSize: 20 }}>{statstic.returnToSender.total}</Text>
                        <Text type="secondary">{statstic.returnToSender.percent}% of total shipments</Text>
                    </Space>
                </ProCard>
                <ProCard
                    title={<Text type="secondary">DELIVERED</Text>}
                    extra={<RightOutlined
                        onClick={() => {
                        }}
                    />}
                >
                    <Space direction='vertical'>
                        <Text style={{ fontSize: 20 }}>{statstic.delivered.total}</Text>
                        <Text type="secondary">{statstic.delivered.percent}% of total shipments</Text>
                    </Space>
                </ProCard>
            </ProCard>
            <ProCard ghost gutter={8} style={{ marginTop: 16 }}>
                <ProCard
                    title='Total shipments over time'
                    extra={
                        <Link>View details</Link>
                    }
                >
                    <Column
                        data={transportOverTime}
                        isStack={true}
                        xField='ref_date'
                        yField='total'
                        seriesField='package_status'
                    />
                </ProCard>
                <ProCard
                    title='Total shipments by status'
                >
                    <Pie
                        data={transportStatus?.data || []}
                        angleField='total'
                        colorField='package_status'
                        radius={1}
                        innerRadius={0.64}
                        meta={{
                            value: {
                                formatter: (v) => v,
                            }
                        }}
                    />
                </ProCard>
            </ProCard>
            <ProCard ghost gutter={8} style={{ marginTop: 16 }}>
                <ProCard
                    title='Exception shipments by reasons'
                >
                    <Pie
                        data={transportExceptionReasons?.data || []}
                        angleField='total'
                        colorField='package_sub_status'
                        radius={1}
                        innerRadius={0.64}
                        meta={{
                            value: {
                                formatter: (v) => v,
                            }
                        }}
                    />
                </ProCard>
                <ProCard
                    title='Exception shipments by carrier'
                >
                    <Pie
                        data={transportExceptions?.data || []}
                        angleField='total'
                        colorField='package_status'
                        radius={1}
                        innerRadius={0.64}
                        meta={{
                            value: {
                                formatter: (v) => v,
                            }
                        }}
                    />
                </ProCard>
            </ProCard>
            <ProCard
                style={{ marginTop: 16 }}
                title='Total shipments by carrier'
                extra={
                    <Link>View details</Link>
                }
            >
                <Bar
                    data={transportWithCarrier}
                    xField='total'
                    yField='carrier'
                    legend={{
                    }}
                />
            </ProCard>
        </PageContainer >
    )
}

export default Dashboard;