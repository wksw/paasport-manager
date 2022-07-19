import { GetDeviceAnalysis } from '@/services/paasport/audit/v2/audit_v2_umirequest';
import { Bar } from '@ant-design/charts';
import { Typography } from 'antd';
import React, { useEffect, useState } from 'react'

const DeviceAnalysis: React.FC = () => {
    const [config, setConfig] = useState({
        data: [],
        xField: 'total_counts',
        yField: 'device_name',
        minBarWidth: 20,
        maxBarWidth: 20,
        xAxis: false,
        width: 50,
        height: 100,
        // barWidthRatio: 0.8,
        // marginRatio: 0.8,
        yAxis: {
            label: {
                formatter: (text: string, item: any, index: number) => {
                    if (text.length > 10) {
                        return `${text.substring(0, 10)}***`
                    }
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
    });
    useEffect(() => {
        const getDeviceAnalysis = async () => {
            const resp = await GetDeviceAnalysis({ sort: 'total_counts' })
            var data = []
            for (let i = 0; i < 3; i++) {
                data.push(resp.data[0].data[i])
            }
            setConfig({
                ...config,
                data: data,
            })
        }
        getDeviceAnalysis();
    }, [])
    return (<Bar {...config} />);
}

export default DeviceAnalysis;