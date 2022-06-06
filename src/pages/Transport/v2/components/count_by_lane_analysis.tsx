import { TransportCountWithLaneAnalysis } from '@/services/paasport/transport/v2/transport_v2_umirequest';
import { Bar } from '@ant-design/charts';
import ProCard from '@ant-design/pro-card';
import { Radio, RadioChangeEvent } from 'antd';
import React, { useEffect, useState } from 'react';

type CountByLaneAnalysisReq = {
    analysisReq: AnalysisReq
}

const CountByLaneAnalysis: React.FC<CountByLaneAnalysisReq> = (props) => {
    const { analysisReq } = props;
    const rfc3339 = 'YYYY-MM-DDTHH:mm:ssZ';
    const [lane, setLane] = useState(0);
    const onLaneChanged = ({ target: { value } }: RadioChangeEvent) => {
        setLane(value)
    }
    const [transportByLaneConfig, setTransportByLaneConfig] = useState({
        data: [],
        xField: 'total',
        yField: 'lane',
        // legend: false,
        maxBarWidth: 20,
        minBarWidth: 10,
        height: 300
    })
    useEffect(() => {
        const getTransportCountWithLane = async () => {
            const resp = await TransportCountWithLaneAnalysis({
                begin_date: analysisReq.begin_date?.format(rfc3339),
                end_date: analysisReq.end_date?.format(rfc3339),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
                lane: lane,
            })
            setTransportByLaneConfig({
                ...transportByLaneConfig,
                data: resp.data,
            })
        }
        getTransportCountWithLane();
    }, [analysisReq, lane])
    return (
        <>
            <ProCard ghost gutter={8} style={{ marginTop: 16 }}>
                <ProCard
                    hoverable
                    title='Total shipments by lane'
                >
                    <Radio.Group
                        options={[{
                            label: 'By State',
                            value: 0,
                        }, {
                            label: 'By Country',
                            value: 1,
                        }]}
                        value={lane}
                        onChange={onLaneChanged}
                        optionType='button'
                        buttonStyle='outline'
                        style={{ marginBottom: 10 }}
                    />
                    <Bar {...transportByLaneConfig} />
                </ProCard>
            </ProCard>
        </>
    );
}

export default CountByLaneAnalysis;