import ProCard from '@ant-design/pro-card';
import React from 'react';
import { Typography } from 'antd';
import { ShipmentsOverTime } from './ShipmentsOvertime';
import { ShipmentsByStatus } from './ShipmentsByStatus';

const { Link } = Typography;

export const Shipments: React.FC = () => {
    return (
        <ProCard ghost gutter={8} style={{ marginTop: 16 }}>
            <ProCard
                title='Total shipments over time'
                extra={
                    <Link>View details</Link>
                }
            >
                <ShipmentsOverTime />
            </ProCard>
            <ProCard
                title='Total shipments by status'
            >
                <ShipmentsByStatus />
            </ProCard>
        </ProCard>

    )
}
