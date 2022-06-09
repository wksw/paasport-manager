import { GetAlters } from '@/services/paasport/transport/v2/transport_v2_umirequest';
import { RightOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'umi';

type StatisticAnalysisReq = {
    analysisReq: AnalysisReq;
    statisticTotal: number;
    exceptionsTotal: number;
    returningToSenderTotal: number;
    returnedToSenderTotal: number;
    deliveredTotal: number;
}

const StatisticAnalysis: React.FC<StatisticAnalysisReq> = (props) => {
    const { analysisReq, statisticTotal, exceptionsTotal, returningToSenderTotal, returnedToSenderTotal, deliveredTotal } = props;
    const [warning, setWarning] = useState(0);
    const dateFormat = 'YYYY-MM-DD';
    const commonConfig = {
        hoverable: true,
        style: { height: 150 }
    }
    useEffect(() => {
        const getAlters = async () => {
            const resp = await GetAlters({})
            setWarning(resp.total)
        }
        getAlters();
    }, [analysisReq])
    return (<ProCard ghost gutter={8} style={{ marginTop: 16 }} size='default'>
        <ProCard
            {...commonConfig}
            title={<Typography.Text type="secondary">Total</Typography.Text>}
            layout='center'
            extra={<Link to={{
                pathname: '/transport/v2/list',
                search: `?begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`
            }}><RightOutlined /></Link>}
        >
            <Space direction='vertical'>
                <Typography.Title level={1}>{statisticTotal}</Typography.Title>
                {/* <Typography.Text type="secondary" style={{ visibility: 'hidden' }}> empty</Typography.Text> */}
            </Space>
        </ProCard>
        <ProCard
            {...commonConfig}
            title={<Typography.Text type="secondary">EXCEPTION</Typography.Text>}
            extra={<Link to={{
                pathname: '/transport/v2/list',
                search: `?package_status=EXCEPTION&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`,
            }}><RightOutlined /></Link>}
        >
            <Space direction='vertical'>
                <Typography.Text style={{ fontSize: 20 }}>{exceptionsTotal}</Typography.Text>
                <Typography.Text type="secondary">{(exceptionsTotal / statisticTotal * 100).toFixed(2)}% of total shipments</Typography.Text>
            </Space>
        </ProCard>
        <ProCard
            {...commonConfig}
            title={<Typography.Text type='danger'>WARNGINGS</Typography.Text>}
            layout='center'
            extra={<Link to={{
                pathname: '/transport/v2/alter',
                search: `?resolved=false`
            }}><RightOutlined /></Link>}
        >
            <Space direction='vertical'>
                <Typography.Text type='danger' style={{ fontSize: 40 }}>{warning}</Typography.Text>
                {/* <Typography.Text type="secondary" style={{ visibility: 'hidden' }}> empty</Typography.Text> */}
            </Space>
        </ProCard>

        <ProCard
            {...commonConfig}
            title={<Typography.Text type="secondary">RETURNING TO SENDER</Typography.Text>}
            extra={<Link to={{
                pathname: '/transport/v2/list',
                search: `?package_status=EXCEPTION&package_sub_status=EXCEPTION_RETURNING&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`,
            }}><RightOutlined /></Link>}
        >
            <Space direction='vertical'>
                <Typography.Text style={{ fontSize: 20 }}>{returningToSenderTotal}</Typography.Text>
                <Typography.Text type="secondary">{(returningToSenderTotal / statisticTotal * 100).toFixed(2)}% of total shipments</Typography.Text>
            </Space>
        </ProCard>

        <ProCard
            {...commonConfig}
            title={<Typography.Text type="secondary">RETURNED TO SENDER</Typography.Text>}
            extra={<Link to={{
                pathname: '/transport/v2/list',
                search: `?package_status=EXCEPTION&package_sub_status=EXCEPTION_RETURNED&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`,
            }}><RightOutlined /></Link>}
        >
            <Space direction='vertical'>
                <Typography.Text style={{ fontSize: 20 }}>{returnedToSenderTotal}</Typography.Text>
                <Typography.Text type="secondary">{(returnedToSenderTotal / statisticTotal * 100).toFixed(2)}% of total shipments</Typography.Text>
            </Space>
        </ProCard>

        <ProCard
            {...commonConfig}
            title={<Typography.Text type="secondary">DELIVERED</Typography.Text>}
            extra={<Link to={{
                pathname: '/transport/v2/list',
                search: `?package_status=DELIVERED&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`,
            }}><RightOutlined /></Link>}
        >
            <Space direction='vertical'>
                <Typography.Text style={{ fontSize: 20 }}>{deliveredTotal}</Typography.Text>
                <Typography.Text type="secondary">{(deliveredTotal / statisticTotal * 100).toFixed(2)}% of total shipments</Typography.Text>
            </Space>
        </ProCard>
    </ProCard >)
}

export default StatisticAnalysis;