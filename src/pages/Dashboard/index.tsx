import ProCard, { Statistic } from '@ant-design/pro-card';
import React, { useEffect, useState } from 'react'
import ApiAnalysis from './Apianalysis';
import DeviceAnalysis from './DeviceAnalysis';
import ErrAnalysis from './ErrAnalysis';
import RegionAnalysis from './RegionAnalysis';
import { TransportDeliveredAndNoDeliveredAnalysis } from '@/services/paasport/transport/v2/transport_v2_umirequest';
import LocationAnalysis from './LocationAnalysis';
import { GetRegisteCountAnalysis } from '@/services/paasport/audit/v2/audit_v2_umirequest';
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
    const [totalViews, setTotalViews] = useState(0);
    const [totalShipments, setTotalShipments] = useState(0);
    const [topLocations, setTopLocations] = useState<AUDIT_V2.RegionAnalysisData[]>([]);
    const [registeCount, setRegisteCount] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const fullscreen = () => {
        if (document.fullscreenEnabled) {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
                setIsFullscreen(true)
            } else {
                document.exitFullscreen()
                setIsFullscreen(false)
            }
        }
    }
    useEffect(() => {
        const getTotalShipments = async () => {
            const resp = await TransportDeliveredAndNoDeliveredAnalysis({})
            var total = 0
            for (var v of resp.data) {
                total += v.total
            }
            setTotalShipments(total)
        }
        const getRegisteCount = async () => {
            const resp = await GetRegisteCountAnalysis({})
            var total = 0
            for (var v of resp.data[0].data) {
                total += v.total_counts
            }
            setRegisteCount(total)
        }
        getTotalShipments();
        getRegisteCount();
    }, [])
    return (
        <ProCard split="vertical" bodyStyle={{ backgroundColor: '#0b0e15' }}>
            <ProCard title="" colSpan="5%" ghost bodyStyle={{ marginLeft: 10, marginTop: 10 }}>
                <a onClick={() => fullscreen()}>{isFullscreen ? <ShrinkOutlined style={{ fontSize: 20, color: 'white' }} /> : <ArrowsAltOutlined style={{ fontSize: 20, color: 'white' }} />}</a>
            </ProCard>
            <ProCard title="" colSpan="70%" ghost>
                <RegionAnalysis setLocations={(locations: AUDIT_V2.RegionAnalysisData[]) => setTopLocations(locations)} />
            </ProCard>
            <ProCard title="" split='horizontal' bodyStyle={{ backgroundColor: '#0b0e15' }}>
                <ProCard split='vertical' ghost>
                    <ProCard title={<h4 style={{ color: 'gray' }}>Total Views Today</h4>} ghost>
                        <Statistic valueStyle={{ color: 'white', fontSize: 20 }} value={totalViews} />
                    </ProCard>
                    <ProCard title={<h4 style={{ color: 'gray' }}>New Accounts Today</h4>} ghost>
                        <Statistic valueStyle={{ color: 'white', fontSize: 20 }} value={registeCount} />
                    </ProCard>
                </ProCard>
                <ProCard split='vertical' ghost>
                    <ProCard title={<h4 style={{ color: 'gray' }}>Total Shipments Today</h4>} ghost>
                        <Statistic valueStyle={{ color: 'white', fontSize: 20 }} value={totalShipments} />
                    </ProCard>
                    {/* <ProCard title={<h4 style={{ color: 'gray' }}>New Accounts Today</h4>} ghost>
                        <Statistic valueStyle={{ color: 'white', fontSize: 20 }} value={123456} />
                    </ProCard> */}
                </ProCard>
                <ProCard title={<h4 style={{ color: 'gray' }}>Top Locations Today</h4>} ghost >
                    <LocationAnalysis locations={topLocations} />
                </ProCard>
                <ProCard title={<h4 style={{ color: 'gray' }}>Top Api Today</h4>} ghost >
                    <ApiAnalysis setViews={(views: number) => { setTotalViews(views) }} />
                </ProCard>
                <ProCard title={<h4 style={{ color: 'gray' }}>Top devices Today</h4>} ghost>
                    <DeviceAnalysis />
                </ProCard>
                <ProCard title={<h4 style={{ color: 'gray' }}>Top Errors Today</h4>} ghost>
                    <ErrAnalysis />
                </ProCard>
            </ProCard >
        </ProCard >
    );
}

export default Dashboard;
