import ProCard from '@ant-design/pro-card';
import React from 'react';
import { Typography } from 'antd';

import { Bar } from '@ant-design/plots';

const { Link } = Typography;

export const TotalShipments: React.FC = () => {
    return (
        <ProCard
            style={{ marginTop: 16 }}
            title='Total shipments by carrier'
            extra={
                <Link>View details</Link>
            }
        >
            <Bar
                data={[
                    {
                        year: '1951 年',
                        value: 38,
                    },
                    {
                        year: '1952 年',
                        value: 52,
                    },
                    {
                        year: '1956 年',
                        value: 61,
                    },
                    {
                        year: '1957 年',
                        value: 145,
                    },
                    {
                        year: '1958 年',
                        value: 48,
                    },
                ]}
                xField='value'
                yField='year'
                legend={{
                }}
            />
        </ProCard>
    )
}