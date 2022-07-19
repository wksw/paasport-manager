import { GetApiAnalysis } from '@/services/paasport/audit/v2/audit_v2_umirequest';
import { Bar } from '@ant-design/charts';
import React, { useEffect, useState } from 'react'

const ApiAnalysis: React.FC<{ setViews: (views: number) => void }> = (props) => {
    const { setViews } = props;
    const [config, setConfig] = useState({
        data: [],
        xField: 'total_counts',
        yField: 'api',
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
                    return text.split(".").pop()
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
        const getApiAnalysis = async () => {
            const resp = await GetApiAnalysis({ sort: 'total_counts' })
            var data: AUDIT_V2.ApiAnalysisData[] = []
            for (let i = 0; i < 3; i++) {
                data.push(resp.data[0].data[i])
            }
            setConfig({
                ...config,
                data: data,
            })
            var total_counts = 0;
            for (const d of resp.data[0].data) {
                total_counts += d.total_counts
            }
            setViews(total_counts)
        }
        getApiAnalysis();
    }, [])
    return (<Bar {...config} />);
}

export default ApiAnalysis;