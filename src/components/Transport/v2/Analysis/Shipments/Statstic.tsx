// import ProCard from '@ant-design/pro-card';
// import React, { useEffect, useState } from 'react';
// import { Space, Typography } from 'antd';
// import { RightOutlined } from '@ant-design/icons';
// import { AnalysisReq } from './typings.d';
// import { TransportStatusAnalysis } from '@/services/paasport/transport/v2/transport_v2_umirequest';

// const { Text } = Typography;

// export const Statstic: React.FC<AnalysisReq> = (props) => {
//     const format = "YYYY-MM-DDTHH:mm:ssZ";
//     const { start_at, end_at, app_id, carrier } = props;
//     console.log("-start-at=", start_at, 'end_at=', end_at);
//     const [statstic, setStatstic] = useState({
//         total: 0,
//         exceptions: {
//             total: 0,
//             percent: 0.00
//         },
//         returnToSender: {
//             total: 0,
//             percent: 0.00
//         },
//         delivered: {
//             total: 0,
//             percent: 0.00
//         }
//     });
//     useEffect(() => {
//         const getTransportStatusAnalysis = async () => {
//             const resp = await TransportStatusAnalysis({
//                 begin_date: start_at?.format(format),
//                 end_date: end_at?.format(format),
//                 app_id: app_id,
//                 carrier: carrier,
//             })
//             let exceptionTotal = 0;
//             let delivered = 0;
//             if (resp.data) {
//                 resp.data.forEach((element: any) => {
//                     if (element.package_status == "DELIVERED") {
//                         delivered = element.total;
//                     }
//                     if (element.package_status == "EXCEPTION") {
//                         exceptionTotal = element.total;
//                     }
//                 });
//             }
//             setStatstic({
//                 ...statstic,
//                 total: resp.total,
//                 exceptions: {
//                     total: exceptionTotal,
//                     percent: exceptionTotal / resp.total * 100
//                 },
//                 delivered: {
//                     total: delivered,
//                     percent: delivered / resp.total * 100
//                 }
//             })
//         }
//         getTransportStatusAnalysis();
//     }, [start_at, end_at, app_id, carrier])
//     return (
//         <ProCard ghost gutter={8} style={{ marginTop: 16 }}>
//             <ProCard
//                 title={<Text type="secondary">Total</Text>}
//                 extra={<RightOutlined
//                     onClick={() => {
//                     }}
//                 />}
//             >
//                 <Space direction='vertical'>
//                     <Text style={{ fontSize: 20 }}>{statstic.total}</Text>
//                     <Text type="secondary" style={{ visibility: 'hidden' }}> empty</Text>
//                 </Space>
//             </ProCard>
//             <ProCard
//                 title={<Text type="secondary">EXCEPTION</Text>}
//                 extra={<RightOutlined
//                     onClick={() => {
//                     }}
//                 />}
//             >
//                 <Space direction='vertical'>
//                     <Text style={{ fontSize: 20 }}>{statstic.exceptions.total}</Text>
//                     <Text type="secondary">{statstic.exceptions.percent}% of total shipments</Text>
//                 </Space>
//             </ProCard>
//             <ProCard
//                 title={<Text type="secondary">RETURNED TO SENDER</Text>}
//                 extra={<RightOutlined
//                     onClick={() => {
//                     }}
//                 />}
//             >
//                 <Space direction='vertical'>
//                     <Text style={{ fontSize: 20 }}>{statstic.returnToSender.total}</Text>
//                     <Text type="secondary">{statstic.returnToSender.percent}% of total shipments</Text>
//                 </Space>
//             </ProCard>
//             <ProCard
//                 title={<Text type="secondary">DELIVERED</Text>}
//                 extra={<RightOutlined
//                     onClick={() => {
//                     }}
//                 />}
//             >
//                 <Space direction='vertical'>
//                     <Text style={{ fontSize: 20 }}>{statstic.delivered.total}</Text>
//                     <Text type="secondary">{statstic.delivered.percent}% of total shipments</Text>
//                 </Space>
//             </ProCard>
//         </ProCard>
//     )
// }