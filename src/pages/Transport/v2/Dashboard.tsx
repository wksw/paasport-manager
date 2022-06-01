import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import { Button, Card, Collapse, Tabs } from 'antd';
import ProForm, { ProFormDateRangePicker } from '@ant-design/pro-form';
import {
    TransportStatusAnalysis, TransportExceptionReasonAnalysis,
    TransportExceptionByCarrierAnalysis, TransportDeliveredAndNoDeliveredAnalysis,
    TransportCountWithCarrierAnalysis, TransportTrackStatusAnalysis,
    TransportTransitAnalysis, TransportTransitAvgTimeAnalysis, TransportTransitP85TimeAnalysis
} from '@/services/paasport/transport/v2/transport_v2_umirequest';
import { Space, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/plots';
import { Link as ULink } from 'umi';
const { Text } = Typography
import { Pie } from '@ant-design/plots';
import { Bar } from '@ant-design/plots';
import carriers from '@/services/17track_carriers';

const { Panel } = Collapse;


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
    const [durationDays, setDurationDays] = useState(0);
    const dateRangeConfig = {
        name: 'startEnd',
        format: dateFormat,
    }
    const pieConfig = {
        data: [],
        hasLegend: true,
        radius: 0.80,
        innerRadius: 0.55,
        label: {
            type: 'outer',
            offset: '30%',
            content: '{name} {percentage}',
            style: {
                fontSize: 10,
                textAlign: 'center'
            }
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
        meta: {
            value: {
                formatter: (v) => v,
            }
        }
    }
    const [returnToSenderTotal, setReturnTosenderTotal] = useState(0);
    const [returningToSenderTotal, setReturningToSenderTotal] = useState(0);
    const [statsticTotal, setStatsticTotal] = useState(0);
    const [exceptionsTotal, setExceptionsTotal] = useState(0);
    const [deliveredTotal, setDeliveredTotal] = useState(0);
    // const [shipmentsShow, setShipmentsShow] = useState(true);
    // const [TransitTimeShow, setTransitTimeShow] = useState(true);

    const [trackStatusConfig, setTrackStatusConfig] = useState({
        ...pieConfig,
        angleField: 'total',
        colorField: 'track_status'
    })
    const [transportExceptionsConfig, setTransportExceptionsConfig] = useState({
        ...pieConfig,
        angleField: 'total',
        colorField: 'package_status'
    })
    const [transportExceptionReasonsConfig, setTransportExceptionReasonsConfig] = useState({
        ...pieConfig,
        angleField: 'total',
        colorField: 'package_sub_status'
    })
    const [transportStatusConfig, setTransportStatusConfig] = useState({
        ...pieConfig,
        angleField: 'total',
        colorField: 'package_status'
    });
    const [transportOverTimeConfig, setTransportOverTimeConfig] = useState({
        data: [],
        isStack: true,
        xField: 'ref_date',
        yField: 'total',
        seriesField: 'package_status'

    })
    const [transitLastP85Time, setTransitLastP85Time] = useState(0);
    const [transitP85Time, settransitP85Time] = useState({
        data: [],
        xField: 'ref_date',
        yField: 'days_of_transit_done',
        height: 300
    })
    const [transitLastAvgTime, setTransitLastAvgTime] = useState(0);
    const [transitAvgTime, settransitAvgTime] = useState({
        data: [],
        xField: 'ref_date',
        yField: 'days_of_transit_done',
        height: 300
    })
    const [transitTimeDistribution, setTransitTimeDistribution] = useState({
        ...pieConfig,
        angleField: 'total',
        colorField: 'days_of_transit_done',
        legend: {
            itemName: {
                formatter: (text: string, item: any, index: number) => `${text} days`
            },
        },
        label: {
            type: 'outer',
            offset: '30%',
            content: '{name} days {percentage}',
            style: {
                fontSize: 10,
                textAlign: 'center'
            }
        },
        tooltip: {
            formatter: (datum: any) => {
                console.log('---datum=', datum);
                return { name: datum.days_of_transit_done + ' days', value: datum.total }
            }
        },
    })
    const [transportByCarrierConfig, setTransportByCarrierConfig] = useState({
        data: [],
        xField: 'total',
        yField: 'carrier',
        legend: false,
        maxBarWidth: 20,
        minBarWidth: 10,
    })
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
            setDeliveredTotal(delivered);
            setExceptionsTotal(exceptionTotal);
            setStatsticTotal(resp.total);
            setTransportStatusConfig({
                ...transportStatusConfig,
                data: resp.data,
            })
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
                let returnToSender = 0;
                let returningToSender = 0;
                resp.data.forEach((element: any) => {
                    if (element.package_sub_status == "EXCEPTION_RETURNED") {
                        returnToSender += element.total;
                    }
                    if (element.package_sub_status == "EXCEPTION_RETURNING") {
                        returningToSender += element.total;
                    }
                })
                setReturnTosenderTotal(returnToSender);
                setReturningToSenderTotal(returningToSender);
            }
            setTransportExceptionReasonsConfig({
                ...transportExceptionReasonsConfig,
                data: resp.data,
            })
        }
        const getTransportExceptions = async () => {
            const resp = await TransportExceptionByCarrierAnalysis({
                begin_date: analysisReq.begin_date?.format(rfc3339),
                end_date: analysisReq.end_date?.format(rfc3339),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            if (resp.data) {
                resp.data.forEach(element => {
                    for (const v of carriers) {
                        if (v.key == element.carrier) {
                            element.carrier = v._name
                        }
                    }
                })
            }
            setTransportExceptionsConfig({
                ...transportExceptionsConfig,
                data: resp.data,
            })
        }
        const getTransportOvertime = async () => {
            const resp = await TransportDeliveredAndNoDeliveredAnalysis({
                begin_date: analysisReq.begin_date?.format(dateFormat),
                end_date: analysisReq.end_date?.format(dateFormat),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            // setTransportOverTime(resp.data)
            setTransportOverTimeConfig({
                ...transportOverTimeConfig,
                data: resp.data,
            })
        }
        const getTransportCountWithCarrier = async () => {
            const resp = await TransportCountWithCarrierAnalysis({
                begin_date: analysisReq.begin_date?.format(rfc3339),
                end_date: analysisReq.end_date?.format(rfc3339),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            if (resp.data) {
                resp.data.forEach(element => {
                    for (const v of carriers) {
                        if (v.key == element.carrier) {
                            element.carrier = v._name
                        }
                    }
                })
            }
            // setTransportWithCarrier(resp.data)
            setTransportByCarrierConfig({
                ...transportByCarrierConfig,
                data: resp.data,
            })
        }
        const getTransportTrackStatus = async () => {
            const resp = await TransportTrackStatusAnalysis({
                begin_date: analysisReq.begin_date?.format(rfc3339),
                end_date: analysisReq.end_date?.format(rfc3339),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            // setTransportTrackStatus(resp.data);
            setTrackStatusConfig({
                ...trackStatusConfig,
                data: resp.data,
            })
        }
        const getTransitAvgTime = async () => {
            const resp = await TransportTransitAvgTimeAnalysis({
                begin_date: analysisReq.begin_date?.format(dateFormat),
                end_date: analysisReq.end_date?.format(dateFormat),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            settransitAvgTime({
                ...transitAvgTime,
                data: resp.data,
            })
            setTransitLastAvgTime(resp.days_of_transit_done)

        }
        const getTransitP85Time = async () => {
            const resp = await TransportTransitP85TimeAnalysis({
                begin_date: analysisReq.begin_date?.format(dateFormat),
                end_date: analysisReq.end_date?.format(dateFormat),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            settransitP85Time({
                ...transitP85Time,
                data: resp.data,
            })
            setTransitLastP85Time(resp.days_of_transit_done)
        }
        const getTransitTime = async () => {
            const resp = await TransportTransitAnalysis({
                begin_date: analysisReq.begin_date?.format(rfc3339),
                end_date: analysisReq.end_date?.format(rfc3339),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            let distribution = {
                '0-3': 0,
                '4-7': 0,
                '8-11': 0,
                '12-15': 0,
                '16-30': 0,
                '30+': 0,
            }
            if (resp.data) {
                resp.data.forEach(element => {
                    if (element.days_of_transit_done <= 3) {
                        distribution['0-3'] += element.total
                    } else if (element.days_of_transit_done >= 4 && element.days_of_transit_done <= 7) {
                        distribution['4-7'] += element.total
                    }
                })
            }
            let data = []
            for (var i in distribution) {
                data.push({
                    days_of_transit_done: i,
                    total: distribution[i],
                })
            }
            console.log('--------data=', data)
            setTransitTimeDistribution({
                ...transitTimeDistribution,
                data: data,
            })
        }
        getTransportStatusAnalysis();
        getTransportExceptionReasons();
        getTransportExceptions();
        getTransportOvertime();
        getTransportCountWithCarrier();
        getTransportTrackStatus();
        getTransitAvgTime();
        getTransitP85Time();
        getTransitTime();
        setDurationDays(analysisReq.end_date.diff(analysisReq.begin_date, "days") - 1)
    }, [analysisReq])
    return (
        <>
            {/* 查询过滤 */}
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

            {/* 数量统计 */}
            <ProCard ghost gutter={8} style={{ marginTop: 16 }} size='default'>
                <ProCard
                    hoverable
                    title={<Text type="secondary">Total</Text>}
                    extra={<ULink to={{
                        pathname: '/transport/v2/list',
                    }}><RightOutlined /></ULink>}
                >
                    <Space direction='vertical'>
                        <Text style={{ fontSize: 20 }}>{statsticTotal}</Text>
                        <Text type="secondary" style={{ visibility: 'hidden' }}> empty</Text>
                    </Space>
                </ProCard>
                <ProCard
                    hoverable
                    title={<Text type="secondary">EXCEPTION</Text>}
                    extra={<ULink to={{
                        pathname: '/transport/v2/list',
                        search: `?package_status=EXCEPTION&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`,
                    }}><RightOutlined /></ULink>}
                >
                    <Space direction='vertical'>
                        <Text style={{ fontSize: 20 }}>{exceptionsTotal}</Text>
                        <Text type="secondary">{(exceptionsTotal / statsticTotal * 100).toFixed(2)}% of total shipments</Text>
                    </Space>
                </ProCard>

                <ProCard
                    hoverable
                    title={<Text type="secondary">RETURNING TO SENDER</Text>}
                    extra={<ULink to={{
                        pathname: '/transport/v2/list',
                        search: `?package_status=EXCEPTION&package_sub_status=EXCEPTION_RETURNING&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`,
                    }}><RightOutlined /></ULink>}
                >
                    <Space direction='vertical'>
                        <Text style={{ fontSize: 20 }}>{returningToSenderTotal}</Text>
                        <Text type="secondary">{(returningToSenderTotal / statsticTotal * 100).toFixed(2)}% of total shipments</Text>
                    </Space>
                </ProCard>

                <ProCard
                    hoverable
                    title={<Text type="secondary">RETURNED TO SENDER</Text>}
                    extra={<ULink to={{
                        pathname: '/transport/v2/list',
                        search: `?package_status=EXCEPTION&package_sub_status=EXCEPTION_RETURNED&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`,
                    }}><RightOutlined /></ULink>}
                >
                    <Space direction='vertical'>
                        <Text style={{ fontSize: 20 }}>{returnToSenderTotal}</Text>
                        <Text type="secondary">{(returnToSenderTotal / statsticTotal * 100).toFixed(2)}% of total shipments</Text>
                    </Space>
                </ProCard>

                <ProCard
                    hoverable
                    title={<Text type="secondary">DELIVERED</Text>}
                    extra={<ULink to={{
                        pathname: '/transport/v2/list',
                        search: `?package_status=DELIVERED&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`,
                    }}><RightOutlined /></ULink>}
                >
                    <Space direction='vertical'>
                        <Text style={{ fontSize: 20 }}>{deliveredTotal}</Text>
                        <Text type="secondary">{(deliveredTotal / statsticTotal * 100).toFixed(2)}% of total shipments</Text>
                    </Space>
                </ProCard>
            </ProCard>

            {/* 状态分析 */}
            <ProCard ghost gutter={8} style={{ marginTop: 16 }} size='default'>
                <ProCard
                    hoverable
                    title='Total track status'
                >
                    <Pie {...trackStatusConfig} />
                </ProCard>
                <ProCard
                    hoverable
                    title='Total shipments by status'
                >
                    <Pie {...transportStatusConfig} />
                </ProCard>
            </ProCard>

            {/* 数量分析 */}
            <ProCard ghost gutter={8} style={{ marginTop: 16 }}>
                <ProCard
                    hoverable
                    title='Total shipments by carrier'
                    extra={
                        <ULink to={{
                            pathname: '/transport/v2/list',
                            search: `?begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`,
                        }}>view detail</ULink>
                    }
                >
                    <Bar {...transportByCarrierConfig} />
                </ProCard>
                <ProCard
                    hoverable
                    title='Total shipments over time'
                    extra={<ULink to={{
                        pathname: '/transport/v2/list',
                        search: `?begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`,
                    }}>view detail</ULink>}
                >
                    <Column {...transportOverTimeConfig} />
                </ProCard>
            </ProCard>

            {/* 异常分析 */}
            <ProCard ghost gutter={8} style={{ marginTop: 16 }}>
                <ProCard
                    hoverable
                    title='Exception shipments by reasons'
                >
                    <Pie {...transportExceptionReasonsConfig} />
                </ProCard>
                <ProCard
                    hoverable
                    title='Exception shipments by carrier'
                >
                    <Pie {...transportExceptionsConfig} />
                </ProCard>
            </ProCard>
            {/* 运输时长 */}
            <ProCard ghost gutter={8} style={{ marginTop: 16 }}>
                <ProCard
                    title="P85 transit time(d)"
                    style={{ height: 500 }}
                    colSpan={6}
                >
                    <Space direction='vertical'>
                        <Text type="secondary">LAST {durationDays} DAYS</Text>
                        <Typography.Title level={2}>{transitLastP85Time}</Typography.Title>
                    </Space>
                    <Column {...transitP85Time} style={{ marginTop: 15 }}></Column>
                </ProCard>
                <ProCard
                    title="Avg. transit time(d)"
                    style={{ height: 500 }}
                    colSpan={6}
                >
                    <Space direction='vertical'>
                        <Text type="secondary">LAST {durationDays} DAYS</Text>
                        <Typography.Title level={2}>{transitLastAvgTime}</Typography.Title>
                    </Space>
                    <Column {...transitAvgTime} style={{ marginTop: 15 }}></Column>
                </ProCard>
                <ProCard
                    title='Transit time distribution'
                    style={{ height: 500 }}
                    colSpan={12}
                >
                    <Pie {...transitTimeDistribution}></Pie>
                </ProCard>
            </ProCard>

        </>
    )
}

export default Dashboard;