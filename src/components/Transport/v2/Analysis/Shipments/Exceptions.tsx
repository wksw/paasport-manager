import ProCard from '@ant-design/pro-card';
import React from 'react';
import { ExceptionsByCarrier } from './ExceptionsByCarrier';
import { ExceptionsByReasons } from './ExceptionsByReasons';
import { AnalysisReq } from './typings.d';

export const Exceptions: React.FC<AnalysisReq> = (props) => {
    return (
        <ProCard ghost gutter={8} style={{ marginTop: 16 }}>
            <ProCard
                title='Exception shipments by reasons'
            >
                <ExceptionsByReasons />
            </ProCard>
            <ProCard
                title='Exception shipments by carrier'
            >
                <ExceptionsByCarrier {...props} />
            </ProCard>
        </ProCard>
    )
}