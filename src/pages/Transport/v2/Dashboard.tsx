import React, { useState } from 'react';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import { Button } from 'antd';
import ProForm, { ProFormDateRangePicker } from '@ant-design/pro-form';
import StatisticAnalysis from './components/statistic_analysis';
import StatusAnalysis from './components/status_analysis';
import CountAnalysis from './components/count_analysis';
import ExceptionAnalysis from './components/exception_analysis';
import TransitAnalysis from './components/transit_analysis';

// const { Panel } = Collapse;


const Dashboard: React.FC = () => {
    const dateFormat = 'YYYY-MM-DD';
    const [analysisReq, setAnalysisReq] = useState({
        begin_date: moment(moment().add(-7, "days"), dateFormat),
        end_date: moment(moment().add(1, 'days'), dateFormat),
        app_id: '0',
        carrier: 0,
        provider: -1,
        lane: 0,
        count_lane: 0,
    })

    const [statisticTotal, setStatisticTotal] = useState(0);
    const [exceptionsTotal, setExceptionsTotal] = useState(0);
    const [returningToSenderTotal, setReturningToSenderTotal] = useState(0);
    const [returnedToSenderTotal, setReturnedToSenderTotal] = useState(0);
    const [deliveredTotal, setDeliveredTotal] = useState(0);

    const dateRangeConfig = {
        name: 'startEnd',
        format: dateFormat,
    }
    const pieConfig = {
        data: [],
        hasLegend: true,
        radius: 0.80,
        innerRadius: 0.55,
        label: {
            type: 'outer',
            offset: '30%',
            content: '{name} {percentage}',
            style: {
                fontSize: 10,
                textAlign: 'center'
            }
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
        meta: {
            value: {
                formatter: (v: any) => v,
            }
        },
        height: 300,
    }
    return (
        <>
            {/* 查询过滤 */}
            <ProCard >
                <ProForm layout='inline'
                    autoFocusFirstInput={false}
                    initialValues={{
                        startEnd: [analysisReq.begin_date, analysisReq.end_date]
                    }}
                    onFinish={async (values) => {
                        setAnalysisReq({
                            ...analysisReq,
                            begin_date: moment(values.startEnd[0], dateFormat),
                            end_date: moment(values.startEnd[1], dateFormat),
                        })
                    }}
                    submitter={{
                        resetButtonProps: {
                            style: {
                                display: 'none'
                            }
                        },
                        submitButtonProps: {
                            style: {
                                display: 'none'
                            }
                        }
                    }}
                >
                    <ProFormDateRangePicker {...dateRangeConfig} />
                    <Button type="primary" htmlType='submit'>Apply</Button>
                </ProForm>
            </ProCard>

            <ProCard title='Shipments' style={{ marginTop: 16 }} bodyStyle={{ height: 0, padding: '8px' }}></ProCard>
            {/* 数量统计 */}
            <StatisticAnalysis
                analysisReq={analysisReq}
                statisticTotal={statisticTotal}
                exceptionsTotal={exceptionsTotal}
                returningToSenderTotal={returningToSenderTotal}
                returnedToSenderTotal={returnedToSenderTotal}
                deliveredTotal={deliveredTotal}
            />
            {/* 状态分析 */}
            <StatusAnalysis
                analysisReq={analysisReq}
                setDeliveredTotal={(total: number) => setDeliveredTotal(total)}
                setExceptionsTotal={(total: number) => setExceptionsTotal(total)}
                setStatisticTotal={(total: number) => setStatisticTotal(total)}
                pieConfig={pieConfig}
            />
            {/* 数量分析 */}
            <CountAnalysis analysisReq={analysisReq} />
            {/* 异常分析 */}
            <ExceptionAnalysis
                analysisReq={analysisReq}
                pieConfig={pieConfig}
                setReturnedToSenderTotal={(total: number) => setReturnedToSenderTotal(total)}
                setReturningToSenderTotal={(total: number) => setReturningToSenderTotal(total)}
            />

            <ProCard title='Transit time' style={{ marginTop: 16 }} bodyStyle={{ height: 0, padding: '8px' }}></ProCard>
            {/* 运输时长 */}
            <TransitAnalysis analysisReq={analysisReq} pieConfig={pieConfig} />
        </>
    )
}

export default Dashboard;