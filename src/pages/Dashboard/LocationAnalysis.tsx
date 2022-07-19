import { Bar } from '@ant-design/charts';
import React, { } from 'react'

const LocationAnalysis: React.FC<{ locations: AUDIT_V2.RegionAnalysisData[] }> = (props) => {
    const { locations } = props;
    var topLocations: AUDIT_V2.RegionAnalysisData[] = [];
    for (let v of locations.slice(0, 2)) {
        topLocations.push({
            country: `${v.country}-${v.city}`,
            total_counts: v.total_counts,
        })
    }
    const config = {
        data: topLocations,
        xField: 'total_counts',
        yField: 'country',
        minBarWidth: 20,
        maxBarWidth: 20,
        xAxis: false,
        width: 50,
        height: 100,
        yAxis: {
            label: {
                formatter: (text: string, item: any, index: number) => {
                    return text
                }
            },
            position: 'top',
            line: null,
            tickLine: null,
        },
        label: null,
        color: (item: any) => {
            return 'l(1) 0:#0b0e15 1:#367188'
        },
        style: {
            marginRight: 20,
        }
        // theme: 'dark',
    };
    return (<Bar {...config} />);
}

export default LocationAnalysis;