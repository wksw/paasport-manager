import React from 'react';
// import { Modal } from 'antd';
import ProCard from '@ant-design/pro-card';
import {
    FrownTwoTone,
    QuestionCircleTwoTone,
    ClockCircleTwoTone,
    WarningTwoTone,
    CheckCircleTwoTone,
    HourglassTwoTone,
    RocketTwoTone,
    CloseCircleTwoTone,
} from '@ant-design/icons';
import { Col, Row, Tooltip, Typography } from 'antd';
import { getCarrierV2 } from '@/utils/utils';
import { TransportDetailContent } from './TrackDetail';

export function packageStatusIcon(status: any, fontSize: number) {
    switch (status) {
        case 'NOT_FOUND':
            return (
                <Tooltip title="查询不到">
                    <FrownTwoTone style={{ fontSize: fontSize }} />
                </Tooltip>
            );
        case 'IN_TRANSIT':
            // 运输途中
            return (
                <Tooltip title="运输途中">
                    <RocketTwoTone style={{ fontSize: fontSize }} />
                </Tooltip>
            );
        case 'EXPIRED':
            // 运输过久
            return (
                <Tooltip title="运输过久">
                    <ClockCircleTwoTone style={{ fontSize: fontSize }} />
                </Tooltip>
            );
        case 'AVAILABLE_FOR_PICKUP':
            // 到达待取
            return (
                <Tooltip title="到达待取">
                    <HourglassTwoTone style={{ fontSize: fontSize }} />
                </Tooltip>
            );
        case 'DELIVERY_FAIL':
            // 投递失败
            return (
                <Tooltip title="投递失败">
                    <CloseCircleTwoTone style={{ fontSize: fontSize }} />
                </Tooltip>
            );
        case 'DELIVERED':
            return (
                <Tooltip title="已签收">
                    <CheckCircleTwoTone style={{ fontSize: fontSize }} />
                </Tooltip>
            );
        case 'EXCEPTION':
            // 可能异常
            return (
                <Tooltip title="可能异常">
                    <WarningTwoTone style={{ fontSize: fontSize }} />
                </Tooltip>
            );
        default:
            return (
                <Tooltip title="未知错误">
                    <QuestionCircleTwoTone style={{ fontSize: fontSize }} />
                </Tooltip>
            );
    }
}

export const TransportDetail: React.FC<TransportDetailProps> = (props) => {
    const { detail } = props;
    // const tracks =
    console.log('detail', detail);

    return (
        <ProCard
            layout="default"
            size="small"
            headerBordered={true}
            title={null}
            subTitle={null}
            bodyStyle={{ marginLeft: '20px' }}
        >
            <Row align="middle" justify="center" style={{ marginBottom: '20px', marginLeft: '40px' }}>
                <Col span={12}>
                    <Row align="middle">
                        <Col span={4}>{packageStatusIcon(detail?.package_status, 30)}</Col>
                        <Col span={20}>
                            <Row align="middle">
                                <Col style={{ fontSize: 10 }}>
                                    <Typography.Text style={{ marginBottom: 0 }} ellipsis={true} copyable={true}>
                                        {detail?.number}
                                    </Typography.Text>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ fontSize: 8 }}>
                                    {detail?.track?.metrics?.days_of_transit_done !== 0 && (
                                        <Typography.Text type="secondary" style={{ marginBottom: 0 }}>
                                            {'妥投时间 ' + detail?.track?.metrics?.days_of_transit_done + ' (天)'}
                                        </Typography.Text>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col span={10}>
                    <Row align="middle">
                        <Col span={10}>
                            <Row justify="center">
                                <Col style={{ fontSize: 14 }}>{detail?.track?.departure?.country}</Col>
                            </Row>
                            <Row justify="center">
                                <Col style={{ fontSize: 14 }}>{getCarrierV2(detail)}</Col>
                            </Row>
                        </Col>
                        <Col span={4}>{'->'}</Col>
                        <Col span={10} style={{ fontSize: 14 }}>
                            {detail?.track?.destination?.country}
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row justify="center">
                <TransportDetailContent detail={detail} />
            </Row>
        </ProCard>
    );
};
