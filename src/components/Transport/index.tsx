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
import { Col, Row, Timeline, Tooltip, Typography } from 'antd';
// import countries from '@/services/17track_countries';
import { getCarrier, getCountry } from '@/utils/utils';
// import styles from './index.less';

type TransportDetailProps = {
  detail: TRANSPORT.TrackInfo;
};

export function packageStatusIcon(status: any, fontSize: number) {
  switch (status) {
    case 0:
      return (
        <Tooltip title="查询不到">
          <FrownTwoTone style={{ fontSize: fontSize }} />
        </Tooltip>
      );
    case 10:
      // 运输途中
      return (
        <Tooltip title="运输途中">
          <RocketTwoTone style={{ fontSize: fontSize }} />
        </Tooltip>
      );
    case 20:
      // 运输过久
      return (
        <Tooltip title="运输过久">
          <ClockCircleTwoTone style={{ fontSize: fontSize }} />
        </Tooltip>
      );
    case 30:
      // 到达待取
      return (
        <Tooltip title="到达待取">
          <HourglassTwoTone style={{ fontSize: fontSize }} />
        </Tooltip>
      );
    case 35:
      // 投递失败
      return (
        <Tooltip title="投递失败">
          <CloseCircleTwoTone style={{ fontSize: fontSize }} />
        </Tooltip>
      );
    case 40:
      return (
        <Tooltip title="已签收">
          <CheckCircleTwoTone style={{ fontSize: fontSize }} />
        </Tooltip>
      );
    case 50:
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
  if (detail.track.z2 == null) {
    detail.track.z2 = [];
  }
  if (detail.track.z1 == null) {
    detail.track.z1 = [];
  }
  if (detail.track.z9 == null) {
    detail.track.z9 = [];
  }
  // const tracks =
  console.log('detail', detail);

  const tracks = detail.track.z2.concat(detail.track.z1).concat(detail.track.z9);
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
            <Col span={4}>{packageStatusIcon(detail.package_status, 30)}</Col>
            <Col span={20}>
              <Row align="middle">
                <Col style={{ fontSize: 10 }}>
                  <Typography.Text style={{ marginBottom: 0 }} ellipsis={true} copyable={true}>
                    {detail.number}
                  </Typography.Text>
                </Col>
              </Row>
              <Row>
                <Col style={{ fontSize: 8 }}>
                  {detail.track.f !== -1 && detail.track.f !== 0 && (
                    <Typography.Text type="secondary" style={{ marginBottom: 0 }}>
                      {'妥投时间 ' + detail.track.f + ' (天)'}
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
                <Col style={{ fontSize: 14 }}>{getCountry(detail.track.b)}</Col>
              </Row>
              <Row justify="center">
                <Col style={{ fontSize: 14 }}>{getCarrier(detail)}</Col>
              </Row>
            </Col>
            <Col span={4}>{'->'}</Col>
            <Col span={10} style={{ fontSize: 14 }}>
              {getCountry(detail.track.c)}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Timeline>
          {tracks.map((item: any) => (
            <Timeline.Item>
              <span style={{ fontWeight: 'bold' }}>{item.a}</span> {item.c} {item.z}
            </Timeline.Item>
          ))}
        </Timeline>
      </Row>
    </ProCard>
  );
};
