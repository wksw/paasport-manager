import ProCard from '@ant-design/pro-card';
import React, { useState } from 'react'
import ApiAnalysis from './Dashboard/Apianalysis';
import DeviceAnalysis from './Dashboard/DeviceAnalysis';
import ErrAnalysis from './Dashboard/ErrAnalysis';
import RegionAnalysis from './Dashboard/RegionAnalysis';

const Dashboard: React.FC = () => {
    const [totalViews, setTotalViews] = useState(0);
    return (
        <ProCard split="vertical" bodyStyle={{ backgroundColor: '#0b0e15' }}>
            <ProCard title="" colSpan="70%" ghost>
                <RegionAnalysis />
            </ProCard>
            <ProCard title="" split='horizontal' bodyStyle={{ backgroundColor: '#0b0e15' }}>
                <ProCard split='vertical' ghost>
                    <ProCard title={<h4 style={{ color: 'gray' }}>Total Views Today</h4>} ghost>
                        <h2 style={{ color: 'white' }}>{totalViews}</h2>
                    </ProCard>
                    <ProCard title={<h4 style={{ color: 'gray' }}>New Accounts Today</h4>} ghost>
                        <h2 style={{ color: 'white' }}>123456</h2>
                    </ProCard>
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