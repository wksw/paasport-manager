import { TransportStatusAnalysis, TransportTrackStatusAnalysis } from '@/services/paasport/transport/v2/transport_v2_umirequest';
import { Pie } from '@ant-design/charts';
import ProCard from '@ant-design/pro-card';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';

type StatusAnalysisReq = {
    analysisReq: AnalysisReq;
    pieConfig: any;
    setDeliveredTotal: (total: number) => void;
    setExceptionsTotal: (total: number) => void;
    setStatisticTotal: (total: number) => void;
}

const StatusAnalysis: React.FC<StatusAnalysisReq> = (props) => {
    const { analysisReq, pieConfig, setDeliveredTotal, setExceptionsTotal, setStatisticTotal } = props;
    const dateFormat = 'YYYY-MM-DD';
    const rfc3339 = 'YYYY-MM-DDTHH:mm:ssZ';
    const [totalTrackStatus, setTotalTrackStatus] = useState({
        ...pieConfig,
        angleField: 'total',
        colorField: 'track_status',
        onReady: (plot: any) => {
            plot.on("plot:click", (event: any) => {
                history.push(`/transport/v2/list?track_status=${event?.data?.data?.track_status}&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`)
            })
        }
    })

    const [totalShipmentsByStatus, setTotalShipmentsByStatus] = useState({
        ...pieConfig,
        angleField: 'total',
        colorField: 'package_status',
        onReady: (plot: any) => {
            plot.on("plot:click", (event: any) => {
                history.push(`/transport/v2/list?package_status=${event?.data?.data?.package_status}&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`)
            })
        }
    })

    useEffect(() => {
        const getTransportTrackStatus = async () => {
            const resp = await TransportTrackStatusAnalysis({
                begin_date: analysisReq.begin_date?.format(rfc3339),
                end_date: analysisReq.end_date?.format(rfc3339),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            // setTransportTrackStatus(resp.data);
            setTotalTrackStatus({
                ...totalTrackStatus,
                data: resp.data,
            })
        }
        const getTransportStatusAnalysis = async () => {
            const resp = await TransportStatusAnalysis({
                begin_date: analysisReq.begin_date?.format(rfc3339),
                end_date: analysisReq.end_date?.format(rfc3339),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            let exceptionTotal = 0;
            let delivered = 0;
            if (resp.data) {
                resp.data.forEach((element: any) => {
                    if (element.package_status == "DELIVERED") {
                        delivered = element.total;
                    }
                    if (element.package_status == "EXCEPTION") {
                        exceptionTotal = element.total;
                    }
                });
            }
            setDeliveredTotal(delivered);
            setExceptionsTotal(exceptionTotal);
            setStatisticTotal(resp.total);
            setTotalShipmentsByStatus({
                ...totalShipmentsByStatus,
                data: resp.data,
            })
        }
        getTransportTrackStatus();
        getTransportStatusAnalysis();
    }, [analysisReq])

    return (<ProCard ghost gutter={8} style={{ marginTop: 16 }} size='default'>
        <ProCard
            hoverable
            title='Total track status'
        >
            <Pie {...totalTrackStatus} />
        </ProCard>
        <ProCard
            hoverable
            title='Total shipments by status'
        >
            <Pie {...totalShipmentsByStatus} />
        </ProCard>
    </ProCard>)
}

export default StatusAnalysis;