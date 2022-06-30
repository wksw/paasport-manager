import { Divider, Space, Timeline, Typography } from 'antd';
import moment from 'moment';
import React from 'react';

export const TransportDetailContent: React.FC<TransportDetailProps> = (props) => {
    const { detail } = props;
    return (<>
        {
            detail.package_status == 'DELIVERED' && <>
                <Typography.Title level={4}>Delivered on {moment(detail.track.latest_event.created_at).format("YYYY-MM-DD")}</Typography.Title>
                <Divider />
            </>
        }
        < Timeline >
            {detail?.track?.events?.map((item: any) => (
                <Timeline.Item>
                    <Space direction='vertical'>
                        <Typography.Title level={5}> {item?.description}</Typography.Title>
                        <Typography.Text type='secondary'>{item?.location?.country}{item?.location?.city ? ',' + item?.location?.city : ''} • {item.provider.name} </Typography.Text>
                        <Typography.Text type='secondary'>{moment(item?.created_at).format("YYYY-MM-DD HH:mm:ss")}(Local time)</Typography.Text>
                    </Space>
                </Timeline.Item>
            ))}
        </Timeline >
        {
            detail.package_status == 'DELIVERED' && <>
                <Divider /> <Typography.Text type='secondary' style={{ fontSize: 18 }}>destination is {detail.track.destination.country} • Transit in {detail.track.metrics.days_of_transit_done} days</Typography.Text>
            </>
        }
    </>
    );
}
