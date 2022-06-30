import { Divider, Drawer, Space, Typography } from 'antd';
import React, { } from 'react';
import ProDescriptions from '@ant-design/pro-descriptions';
import { getCarrierV2 } from '@/utils/utils';
import { TransportProvider } from '@/services/paasport';
import { packageStatusIcon } from '@/components/Transport';
import { Link } from 'umi';
import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { TransportDetailContent } from '@/components/Transport/v2/TrackDetail';

type DetailReq = {
    detail: TRANSPORT_V2.TrackInfo;
    visible: boolean;
    onClose: (visible: boolean) => void;
}

const Detail: React.FC<DetailReq> = (props) => {
    const { detail, onClose, visible } = props;
    return (
        <Drawer
            title={(
                <Space direction='vertical'>
                    <Space direction='horizontal'>
                        {packageStatusIcon(detail?.package_status, 20)}
                        <Typography.Title level={5} underline copyable>{detail.number}</Typography.Title>
                    </Space>
                    {detail?.track?.events && <Link to={{
                        pathname: '/transport/v2/track',
                        search: `?number=${detail.number}`
                    }} >
                        <Typography.Text type='secondary' >
                            <Space>
                                <EyeOutlined disabled={true} />
                                View tracking page
                            </Space>
                        </Typography.Text>
                    </Link>
                    }
                </Space>
            )}
            visible={visible}
            width={600}
            closable={false}
            onClose={() => onClose(!visible)}
            extra={<CloseOutlined onClick={() => onClose(!visible)} />}
        >
            <TransportDetailContent detail={detail} />
            < Divider />
            <ProDescriptions
                title='Shipment details'
                column={1}
                layout='horizontal'
            >
                <ProDescriptions.Item
                    valueType='text'
                    label='ID'
                    span={1}
                    ellipsis
                    copyable
                    contentStyle={{ textAlign: 'right' }}
                >
                    {detail.id}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    label='Number'
                    span={1}
                    ellipsis
                    copyable
                    contentStyle={{ textAlign: 'right' }}
                >
                    {detail.number}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='Carrier'
                    contentStyle={{ textAlign: 'right' }}
                >
                    {getCarrierV2(detail)}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='OrderId'
                    copyable
                    contentStyle={{ textAlign: 'right' }}
                >
                    {detail.order_id}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='Version'
                    contentStyle={{ textAlign: 'right' }}
                >
                    {detail.version}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='Provider'
                    contentStyle={{ textAlign: 'right' }}
                >
                    {TransportProvider[detail.provider] || 'Unknown'}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='Status'
                    contentStyle={{ textAlign: 'right' }}
                >
                    {detail.track_status}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='PackageStatus'
                    contentStyle={{ textAlign: 'right' }}
                >
                    {detail.package_status}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='PackageSubStatus'
                    contentStyle={{ textAlign: 'right' }}
                >
                    {detail.package_sub_status}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='dateTime'
                    label='CreatedAt'
                    fieldProps={{
                        format: 'YYYY-MM-DD HH:mm:ss',
                    }}
                    contentStyle={{ justifyContent: 'flex-end' }}
                >
                    {detail.created_at}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='dateTime'
                    label='UpdatedAt'
                    fieldProps={{
                        format: 'YYYY-MM-DD HH:mm:ss',
                    }}
                    contentStyle={{ justifyContent: 'flex-end' }}
                >
                    {detail.updated_at}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='Note'
                    contentStyle={{ textAlign: 'right' }}
                >
                    {detail.note}
                </ProDescriptions.Item>
            </ProDescriptions>
            {detail.extra && <ProDescriptions
                title='Shipment Extra'
                column={1}
                layout='horizontal'
            >
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='AccountNumber'
                    contentStyle={{ textAlign: 'right' }}
                >
                    {detail.extra.account_number}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='OriginCountry'
                    contentStyle={{ textAlign: 'right' }}
                >
                    {detail.extra.origin_country}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='DestinationCountry'
                    contentStyle={{ textAlign: 'right' }}
                >
                    {detail.extra.destination_country}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='Key'
                    contentStyle={{ textAlign: 'right' }}
                >
                    {detail.extra.key}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='PostalCode'
                    contentStyle={{ textAlign: 'right' }}
                >
                    {detail.extra.postal_code}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='ShipDate'
                    contentStyle={{ textAlign: 'right' }}
                >
                    {detail.extra.ship_date}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='State'
                    contentStyle={{ textAlign: 'right' }}
                >
                    {detail.extra.state}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='Extra'
                    contentStyle={{ textAlign: 'right' }}
                >
                    {detail.extra.extra}
                </ProDescriptions.Item>
            </ProDescriptions>
            }
            <ProDescriptions
                title='Shipment Notifies'
                column={1}
                layout='horizontal'
            >
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='Smses'
                    contentStyle={{ textAlign: 'right' }}
                >
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='Emails'
                    contentStyle={{ textAlign: 'right' }}
                >
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='text'
                    ellipsis
                    label='Accounts'
                    contentStyle={{ textAlign: 'right' }}
                >
                </ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions
                title='Shipment Orders'
                column={1}
                layout='horizontal'
            ></ProDescriptions>
            <ProDescriptions
                title='Shipment Log'
                column={1}
                layout='horizontal'
            >
                <ProDescriptions.Item
                    valueType='textarea'
                    label='Log'
                    contentStyle={{ textAlign: 'right', justifyContent: 'flex-end' }}
                >
                    {detail.log}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    valueType='jsonCode'
                    label='TrackRaw'
                >
                    {detail.track_raw}
                </ProDescriptions.Item>
            </ProDescriptions>
        </Drawer>
    );
}

export default Detail;