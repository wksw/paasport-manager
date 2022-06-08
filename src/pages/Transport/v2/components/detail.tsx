import { Drawer } from 'antd';
import React, { useState } from 'react';
import { TransportDetail } from '@/components/Transport/v2';

type DetailReq = {
    visible: boolean;
    detail: TRANSPORT_V2.TrackInfo;
}

const Detail: React.FC<DetailReq> = (props) => {
    const { visible, detail } = props;
    const [show, setShow] = useState(visible);
    return (
        <Drawer
            title="xxx"
            visible={show}
            onClose={() => setShow(!show)}
        >
            <TransportDetail detail={detail} />
        </Drawer>
    );
}

export default Detail;