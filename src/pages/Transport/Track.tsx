import { TransportDetail } from '@/components/Transport';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { GetByTransportNumberWithoutApp } from '@/services/paasport/transport/transport_umirequest';
import { Col, Empty, Input, Modal, Row } from 'antd';
// import { ProFormText, QueryFilter } from '@ant-design/pro-form';

const Track: React.FC = (props) => {
  const [tracks, setTracks] = useState<TRANSPORT.TrackInfo[]>([]);
  const [trackNumber, setTrackNumber] = useState<string>(props.location.query.number);
  const [searchText, setSearchText] = useState<string>('');
  const [searchLoading, setSearchLoading] = useState(true);
  useEffect(() => {
    const getTransport = async () => {
      const resp = await GetByTransportNumberWithoutApp({
        number: trackNumber,
      });
      setTracks(resp.data);
    };
    getTransport();
    setSearchText(trackNumber);
    setSearchLoading(false);
  }, [trackNumber]);
  return (
    <Modal
      centered
      visible={true}
      closable={false}
      footer={null}
      width={750}
      style={{ height: 800 }}
      mask={false}
    >
      <Row justify="center">
        <Input.Search
          placeholder="请输入需要查询的物流单号"
          enterButton="查询"
          size="large"
          value={searchText}
          loading={searchLoading}
          onChange={(e: any) => {
            setSearchText(e.target.value);
          }}
          onSearch={(val: string) => {
            setTrackNumber(val);
            if (trackNumber !== searchText) {
              setSearchLoading(true);
            }
          }}
          style={{ width: 450, marginTop: '10px', marginBottom: '10px' }}
        />
      </Row>
      <Row justify="center">
        {tracks ? (
          tracks.map((item) => <TransportDetail detail={item}></TransportDetail>)
        ) : (
          <Empty />
        )}
      </Row>
    </Modal>
  );
};

export default Track;
