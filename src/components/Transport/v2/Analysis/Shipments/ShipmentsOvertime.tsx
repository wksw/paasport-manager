import ProCard from '@ant-design/pro-card';
import React from 'react';
import { Typography } from 'antd';

const { Link } = Typography;

import { Column } from '@ant-design/plots';

export const ShipmentsOverTime: React.FC = () => {
    return (
        <Column
            data={[
                {
                    "year": "1991",
                    "value": 3,
                    "type": "Lon"
                },
                {
                    "year": "1992",
                    "value": 4,
                    "type": "Lon"
                },
                {
                    "year": "1993",
                    "value": 3.5,
                    "type": "Lon"
                },
                {
                    "year": "1994",
                    "value": 5,
                    "type": "Lon"
                },
                {
                    "year": "1995",
                    "value": 4.9,
                    "type": "Lon"
                },
                {
                    "year": "1996",
                    "value": 6,
                    "type": "Lon"
                },
                {
                    "year": "1997",
                    "value": 7,
                    "type": "Lon"
                }]}
            isStack={true}
            xField='year'
            yField='value'
            seriesField='type'
        />
    )
}