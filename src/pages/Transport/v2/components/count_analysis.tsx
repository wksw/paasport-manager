import { TransportCountWithCarrierAnalysis, TransportDeliveredAndNoDeliveredAnalysis } from '@/services/paasport/transport/v2/transport_v2_umirequest';
import { getCarrierText } from '@/utils/utils';
import { Bar, Column } from '@ant-design/charts';
import ProCard from '@ant-design/pro-card';
import React, { useEffect, useState } from 'react';
import { Link, history } from 'umi';
import CountByLaneAnalysis from './count_by_lane_analysis';

type CountAnalysisReq = {
    analysisReq: AnalysisReq
}

const CountAnalysis: React.FC<CountAnalysisReq> = (props) => {
    const { analysisReq } = props;
    const dateFormat = 'YYYY-MM-DD';
    const rfc3339 = 'YYYY-MM-DDTHH:mm:ssZ';
    const [transportByCarrierConfig, setTransportByCarrierConfig] = useState({
        data: [],
        xField: 'total',
        yField: 'carrier',
        // legend: false,
        maxBarWidth: 20,
        minBarWidth: 10,
        height: 300,
        onReady: (plot: any) => {
            plot.on("plot:click", (event: any) => {
                console.log('----', event);
                history.push(`/transport/v2/list?carrier=${event?.data?.data?.carrier}&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`)
            })
        }
    })
    const [transportOverTimeConfig, setTransportOverTimeConfig] = useState({
        data: [],
        isStack: true,
        xField: 'ref_date',
        yField: 'total',
        seriesField: 'package_status',
        height: 300

    })

    useEffect(() => {
        const getTransportCountWithCarrier = async () => {
            const resp = await TransportCountWithCarrierAnalysis({
                begin_date: analysisReq.begin_date?.format(rfc3339),
                end_date: analysisReq.end_date?.format(rfc3339),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            if (resp.data) {
                resp.data.forEach((element: TRANSPORT_V2.TransportCountWithCarrierAnalysisResp) => {
                    element.carrier = getCarrierText(element.carrier);
                })
            }
            // setTransportWithCarrier(resp.data)
            setTransportByCarrierConfig({
                ...transportByCarrierConfig,
                data: resp.data,
            })
        }
        const getTransportOvertime = async () => {
            const resp = await TransportDeliveredAndNoDeliveredAnalysis({
                begin_date: analysisReq.begin_date?.format(dateFormat),
                end_date: analysisReq.end_date?.format(dateFormat),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            // setTransportOverTime(resp.data)
            setTransportOverTimeConfig({
                ...transportOverTimeConfig,
                data: resp.data,
            })
        }
        getTransportCountWithCarrier();
        getTransportOvertime();
    }, [analysisReq])
    return (
        <>
            <ProCard ghost gutter={8} style={{ marginTop: 16 }}>
                <ProCard
                    hoverable
                    title='Total shipments by carrier'
                    extra={
                        <Link to={{
                            pathname: '/transport/v2/list',
                            search: `?begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`,
                        }}>view detail</Link>
                    }
                >
                    <Bar {...transportByCarrierConfig} />
                </ProCard>
                <ProCard
                    hoverable
                    title='Total shipments over time'
                    extra={<Link to={{
                        pathname: '/transport/v2/list',
                        search: `?begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`,
                    }}>view detail</Link>}
                >
                    <Column {...transportOverTimeConfig} />
                </ProCard>
            </ProCard>
            <CountByLaneAnalysis analysisReq={analysisReq} />
        </>
    );
}

export default CountAnalysis;