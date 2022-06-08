import { TransportTransitAnalysis, TransportTransitAvgTimeAnalysis, TransportTransitByCarrierAnalysis, TransportTransitByLaneAnalysis, TransportTransitP85TimeAnalysis } from '@/services/paasport/transport/v2/transport_v2_umirequest';
import { getCarrierText } from '@/utils/utils';
import { Column, Pie } from '@ant-design/charts';
import ProCard from '@ant-design/pro-card';
import { Col, Divider, Radio, RadioChangeEvent, Row, Space, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

type TransitByLaneAnalysisReq = {
    analysisReq: AnalysisReq;
}

const TransitByLaneAnalysis: React.FC<TransitByLaneAnalysisReq> = (props) => {
    const { analysisReq } = props;
    const rfc3339 = 'YYYY-MM-DDTHH:mm:ssZ';
    const [transitByLane, setTransitByLane] = useState([]);
    const [lane, setLane] = useState(0);
    const onLaneChanged = ({ target: { value } }: RadioChangeEvent) => {
        setLane(value)
    }
    useEffect(() => {
        const getTransitByLane = async () => {
            const resp = await TransportTransitByLaneAnalysis({
                begin_date: analysisReq.begin_date?.format(rfc3339),
                end_date: analysisReq.end_date?.format(rfc3339),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
                lane: lane,
            })
            setTransitByLane(resp.data)
        }
        getTransitByLane();
    }, [analysisReq, lane])

    return (
        <>
            {/* 运输路线分析 */}
            <ProCard hoverable title='Transit time by lane' style={{ marginTop: 16 }}>
                <Radio.Group
                    options={[{
                        label: 'By State',
                        value: 0,
                    }, {
                        label: 'By Country',
                        value: 1,
                    }]}
                    value={lane}
                    onChange={onLaneChanged}
                    optionType='button'
                    buttonStyle='outline'
                />
                <Row gutter={5}>
                    <Col span={6}><Row align='middle' style={{ marginTop: 12 }}>Lane</Row></Col>
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
                {transitByLane?.map((item: TRANSPORT_V2.TransportTransitByLaneResp_Data) => (
                    <>
                        <Row gutter={5}>
                            <Col span={6}><Row align='middle' >{item.lane}</Row></Col>
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
                    </>
                ))}
            </ProCard >
        </>
    );
}
export default TransitByLaneAnalysis;