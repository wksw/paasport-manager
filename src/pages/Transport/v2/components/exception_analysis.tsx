import { TransportExceptionByCarrierAnalysis, TransportExceptionReasonAnalysis } from '@/services/paasport/transport/v2/transport_v2_umirequest';
import { Pie } from '@ant-design/charts';
import ProCard from '@ant-design/pro-card';
import React, { useEffect, useState } from 'react';
import carriers from '@/services/17track_carriers';
import { history } from 'umi';

type ExceptionAnalysisReq = {
    analysisReq: AnalysisReq;
    pieConfig: any;
    setReturnedToSenderTotal: (total: number) => void;
    setReturningToSenderTotal: (total: number) => void;
}
const ExceptionAnalysis: React.FC<ExceptionAnalysisReq> = (props) => {
    const dateFormat = 'YYYY-MM-DD';
    const { analysisReq, pieConfig, setReturnedToSenderTotal, setReturningToSenderTotal } = props;
    const rfc3339 = 'YYYY-MM-DDTHH:mm:ssZ';
    const [transportExceptionReasonsConfig, setTransportExceptionReasonsConfig] = useState({
        ...pieConfig,
        angleField: 'total',
        colorField: 'package_sub_status',
        onReady: (plot: any) => {
            plot.on("plot:click", (event: any) => {
                history.push(`/transport/v2/list?package_sub_status=${event?.data?.data?.package_sub_status}&package_status=EXCEPTION&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`)
            })
        }
    })
    const [transportExceptionsConfig, setTransportExceptionsConfig] = useState({
        ...pieConfig,
        angleField: 'total',
        colorField: 'carrier',
        onReady: (plot: any) => {
            plot.on("plot:click", (event: any) => {
                history.push(`/transport/v2/list?carrier=${event?.data?.data?.carrier}&package_status=EXCEPTION&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`)
            })
        }
    })
    useEffect(() => {
        const getTransportExceptionReasons = async () => {
            const resp = await TransportExceptionReasonAnalysis({
                begin_date: analysisReq.begin_date?.format(rfc3339),
                end_date: analysisReq.end_date?.format(rfc3339),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            let returnedToSender = 0;
            let returningToSender = 0;
            if (resp.data) {
                resp.data.forEach((element: any) => {
                    if (element.package_sub_status == "EXCEPTION_RETURNED") {
                        returnedToSender += element.total;
                    }
                    if (element.package_sub_status == "EXCEPTION_RETURNING") {
                        returningToSender += element.total;
                    }
                })
            }
            setReturnedToSenderTotal(returnedToSender);
            setReturningToSenderTotal(returningToSender);
            setTransportExceptionReasonsConfig({
                ...transportExceptionReasonsConfig,
                data: resp.data,
            })
        }
        const getTransportExceptions = async () => {
            const resp = await TransportExceptionByCarrierAnalysis({
                begin_date: analysisReq.begin_date?.format(rfc3339),
                end_date: analysisReq.end_date?.format(rfc3339),
                app_id: analysisReq.app_id,
                carrier: analysisReq.carrier,
                provider: analysisReq.provider,
            })
            if (resp.data) {
                resp.data.forEach((element: TRANSPORT_V2.TransportStatusAnalysisResp) => {
                    for (const v of carriers) {
                        if (v.key == element.carrier) {
                            element.carrier = v._name
                        }
                    }
                })
            }
            setTransportExceptionsConfig({
                ...transportExceptionsConfig,
                data: resp.data,
            })
        }
        getTransportExceptionReasons();
        getTransportExceptions();
    }, [analysisReq])
    return (
        <ProCard ghost gutter={8} style={{ marginTop: 16 }}>
            <ProCard
                hoverable
                title='Exception shipments by reasons'
            >
                <Pie {...transportExceptionReasonsConfig} />
            </ProCard>
            <ProCard
                hoverable
                title='Exception shipments by carrier'
            >
                <Pie {...transportExceptionsConfig} />
            </ProCard>
        </ProCard>
    );
}

export default ExceptionAnalysis;