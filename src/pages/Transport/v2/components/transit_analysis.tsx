import { TransportTransitAnalysis, TransportTransitAvgTimeAnalysis, TransportTransitByCarrierAnalysis, TransportTransitP85TimeAnalysis } from '@/services/paasport/transport/v2/transport_v2_umirequest';
import { getCarrierText } from '@/utils/utils';
import { Column, Pie } from '@ant-design/charts';
import ProCard from '@ant-design/pro-card';
import { Col, Divider, Row, Space, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import TransitByLaneAnalysis from './transit_by_lane_analysis';

type TransitAnalysisReq = {
    analysisReq: AnalysisReq;
    pieConfig: any;
}

const TransitAnalysis: React.FC<TransitAnalysisReq> = (props) => {
    const { analysisReq, pieConfig } = props;
    const dateFormat = 'YYYY-MM-DD';
    const rfc3339 = 'YYYY-MM-DDTHH:mm:ssZ';
    const durationDays = analysisReq.end_date.diff(analysisReq.begin_date, "days") - 1;
    const [transitLastP85Time, setTransitLastP85Time] = useState(0);
    const [transitP85Time, settransitP85Time] = useState({
        data: [],
        xField: 'ref_date',
        yField: 'days_of_transit_done',
        height: 200
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
                return { name: datum.days_of_transit_done + ' days', value: datum.total }
            }
        },
        statistic: {
            content: false,
            title: false,
        },
        height: 300
    })
    const [transitLastAvgTime, setTransitLastAvgTime] = useState(0);
    const [transitAvgTime, settransitAvgTime] = useState({
        data: [],
        xField: 'ref_date',
        yField: 'days_of_transit_done',
        height: 200
    })
    const [transitByCarrier, setTransitByCarrier] = useState([]);
    useEffect(() => {
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
                resp.data.forEach((element: TRANSPORT_V2.TransportTransitResp) => {
                    if (element.days_of_transit_done <= 3) {
                        distribution['0-3'] += element.total
                    } else if (element.days_of_transit_done >= 4 && element.days_of_transit_done <= 7) {
                        distribution['4-7'] += element.total
                    } else if (element.days_of_transit_done >= 8 && element.days_of_transit_done <= 11) {
                        distribution['8-11'] += element.total
                    } else if (element.days_of_transit_done >= 12 && element.days_of_transit_done <= 15) {
                        distribution['12-15'] += element.total
                    } else if (element.days_of_transit_done >= 16 && element.days_of_transit_done <= 30) {
                        distribution['16-30'] += element.total
                    } else {
                        distribution['30+'] += element.total
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
            setTransitTimeDistribution({
                ...transitTimeDistribution,
                data: data,
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
        const getTransitByCarrier = async () => {
            const resp = await TransportTransitByCarrierAnalysis({
                begin_date: analysisReq.begin_date?.format(rfc3339),
                end_date: analysisReq.end_date?.format(rfc3339),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            setTransitByCarrier(resp.data)
        }
        getTransitTime();
        getTransitP85Time();
        getTransitAvgTime();
        getTransitByCarrier();
    }, [analysisReq])

    return (
        <>
            <ProCard ghost gutter={8} style={{ marginTop: 16 }}>
                <ProCard
                    hoverable
                    title={<Typography.Title level={5}>P85 transit time(d)<Typography.Text type='secondary' style={{ fontSize: 4 }}> round up</Typography.Text></Typography.Title>}
                    colSpan={6}
                >
                    <Space direction='vertical'>
                        <Typography.Text type="secondary">LAST {durationDays} DAYS</Typography.Text>
                        <Typography.Title level={2}>{transitLastP85Time}</Typography.Title>
                    </Space>
                    <Column {...transitP85Time} style={{ marginTop: 15 }}></Column>
                </ProCard>
                <ProCard
                    hoverable
                    title='Transit time distribution'
                    // style={{ height: 500 }}
                    colSpan={12}
                >
                    <Pie {...transitTimeDistribution}></Pie>
                </ProCard>
                <ProCard
                    hoverable
                    title={<Typography.Title level={5}>AVG. transit time(d)<Typography.Text type='secondary' style={{ fontSize: 4 }}> round up</Typography.Text></Typography.Title>}
                    // style={{ height: 500 }}
                    colSpan={6}
                >
                    <Space direction='vertical'>
                        <Typography.Text type="secondary">LAST {durationDays} DAYS</Typography.Text>
                        <Typography.Title level={2}>{transitLastAvgTime}</Typography.Title>
                    </Space>
                    <Column {...transitAvgTime} style={{ marginTop: 15 }}></Column>
                </ProCard>
            </ProCard>
            {/* 运输商分析 */}
            <ProCard hoverable title='Transit time by carrier' style={{ marginTop: 16 }}>
                <Row gutter={5}>
                    <Col span={6}><Row align='middle' style={{ marginTop: 12 }}>Carrier</Row></Col>
                    <Col span={6}><Row justify='center' style={{ marginTop: 12 }}>Delivered shipments</Row></Col>
                    <Col span={6}>
                        <Row justify='center'>Transit time(d)</Row>
                        <Row style={{ marginTop: 5 }}>
                            <Col span={6}><Tooltip title='round up'><Typography.Text underline>P85</Typography.Text></Tooltip></Col>
                            <Col span={6}><Tooltip title='round up'><Typography.Text underline>Avg</Typography.Text></Tooltip></Col>
                            <Col span={6} >Min</Col>
                            <Col span={6}>Max</Col>
                        </Row>
                    </Col>
                    <Col span={6}>
                        <Row justify='center'>Transit time distribution(%)</Row>
                        <Row style={{ marginTop: 5 }}>
                            <Col span={4}>0-3d</Col>
                            <Col span={4}>4-7d</Col>
                            <Col span={4}>8-11d</Col>
                            <Col span={4}>12-15d</Col>
                            <Col span={4}>16-30d</Col>
                            <Col span={4}>30+d</Col>
                        </Row>
                    </Col>
                </Row>
                <Divider type='horizontal' />
                {transitByCarrier?.map((item: TRANSPORT_V2.TransportTransitByCarrierResp_Data) => (
                    <>
                        <Row gutter={5}>
                            <Col span={6}><Row align='middle' >{getCarrierText(item.carrier)}</Row></Col>
                            <Col span={6}><Row justify='center'>{item.delivered}</Row></Col>
                            <Col span={6}>
                                <Row>
                                    <Col span={6}>{item.p85}</Col>
                                    <Col span={6}>{item.avg}</Col>
                                    <Col span={6}>{item.min}</Col>
                                    <Col span={6}>{item.max}</Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                {item.distribution && <Row >
                                    <Col span={4}>{(item.distribution["0-3"] / item.total * 100).toFixed(0)}%</Col>
                                    <Col span={4}>{(item.distribution["4-7"] / item.total * 100).toFixed(0)}%</Col>
                                    <Col span={4}>{(item.distribution["8-11"] / item.total * 100).toFixed(0)}%</Col>
                                    <Col span={4}>{(item.distribution["12-15"] / item.total * 100).toFixed(0)}%</Col>
                                    <Col span={4}>{(item.distribution["16-30"] / item.total * 100).toFixed(0)}%</Col>
                                    <Col span={4}>{(item.distribution["30+"] / item.total * 100).toFixed(0)}%</Col>
                                </Row>
                                }
                            </Col>
                        </Row>
                        <Divider type='horizontal' />
                    </>))}
            </ProCard >

            {/* 运输路线分析 */}
            <TransitByLaneAnalysis analysisReq={analysisReq} />
        </>
    );
}
export default TransitAnalysis;