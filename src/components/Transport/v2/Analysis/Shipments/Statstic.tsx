import ProCard from '@ant-design/pro-card';
import React, { useEffect, useState } from 'react';
import { Space, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { AnalysisReq } from './typings.d';
import { Link } from 'umi';

const { Text } = Typography;

export const Statstic: React.FC<AnalysisReq> = (props) => {
    useEffect(() => {

    }, [])
    return (
        <ProCard ghost gutter={8} style={{ marginTop: 16 }}>
            <ProCard
                title={<Text type="secondary">Total</Text>}
                extra={<Link to={{
                    pathname: '/transport/v2/list',
                }}><RightOutlined /></Link>}
            >
                <Space direction='vertical'>
                    <Text style={{ fontSize: 20 }}>{statsticTotal}</Text>
                    <Text type="secondary" style={{ visibility: 'hidden' }}> empty</Text>
                </Space>
            </ProCard>
            <ProCard
                title={<Text type="secondary">EXCEPTION</Text>}
                extra={<Link to={{
                    pathname: '/transport/v2/list',
                    search: `?package_status=EXCEPTION&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`,
                }}><RightOutlined /></Link>}
            >
                <Space direction='vertical'>
                    <Text style={{ fontSize: 20 }}>{exceptionsTotal}</Text>
                    <Text type="secondary">{(exceptionsTotal / statsticTotal * 100).toFixed(2)}% of total shipments</Text>
                </Space>
            </ProCard>

            <ProCard
                title={<Text type="secondary">RETURNING TO SENDER</Text>}
                extra={<Link to={{
                    pathname: '/transport/v2/list',
                    search: `?package_status=EXCEPTION&package_sub_status=EXCEPTION_RETURNING&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`,
                }}><RightOutlined /></Link>}
            >
                <Space direction='vertical'>
                    <Text style={{ fontSize: 20 }}>{returningToSenderTotal}</Text>
                    <Text type="secondary">{(returningToSenderTotal / statsticTotal * 100).toFixed(2)}% of total shipments</Text>
                </Space>
            </ProCard>

            <ProCard
                title={<Text type="secondary">RETURNED TO SENDER</Text>}
                extra={<Link to={{
                    pathname: '/transport/v2/list',
                    search: `?package_status=EXCEPTION&package_sub_status=EXCEPTION_RETURNED&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`,
                }}><RightOutlined /></Link>}
            >
                <Space direction='vertical'>
                    <Text style={{ fontSize: 20 }}>{returnToSenderTotal}</Text>
                    <Text type="secondary">{(returnToSenderTotal / statsticTotal * 100).toFixed(2)}% of total shipments</Text>
                </Space>
            </ProCard>

            <ProCard
                title={<Text type="secondary">DELIVERED</Text>}
                extra={<Link to={{
                    pathname: '/transport/v2/list',
                    search: `?package_status=DELIVERED&begin_date=${analysisReq.begin_date.format(dateFormat)}&end_date=${analysisReq.end_date.format(dateFormat)}`,
                }}><RightOutlined /></Link>}
            >
                <Space direction='vertical'>
                    <Text style={{ fontSize: 20 }}>{deliveredTotal}</Text>
                    <Text type="secondary">{(deliveredTotal / statsticTotal * 100).toFixed(2)}% of total shipments</Text>
                </Space>
            </ProCard>
        </ProCard>
    )
}