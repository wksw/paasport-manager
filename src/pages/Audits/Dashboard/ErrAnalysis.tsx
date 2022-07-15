import { GetErrAnalysis } from '@/services/paasport/audit/v2/audit_v2_umirequest';
import { Bar } from '@ant-design/charts';
import React, { useEffect, useState } from 'react'

const ErrAnalysis: React.FC = () => {
    const [config, setConfig] = useState({
        data: [],
        xField: 'fail_counts',
        yField: 'err_code',
        minBarWidth: 20,
        maxBarWidth: 20,
        xAxis: false,
        width: 50,
        height: 100,
        // barWidthRatio: 0.8,
        // marginRatio: 0.8,
        yAxis: {
            label: {},
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
        const getErrAnalysis = async () => {
            const resp = await GetErrAnalysis({ sort: 'fail_counts' })
            var data = []
            for (let i = 1; i < 4; i++) {
                data.push(resp.data[0].data[i])
            }
            setConfig({
                ...config,
                data: data,
            })
        }
        getErrAnalysis();
    }, [])
    return (<Bar {...config} />);
}

export default ErrAnalysis;