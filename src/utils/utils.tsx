import carriers from '@/services/17track_carriers';
import countries from '@/services/17track_countries';
import {
  BugTwoTone,
  CheckCircleTwoTone,
  CloseSquareTwoTone,
  ExclamationCircleTwoTone,
  FrownTwoTone,
  WarningTwoTone,
} from '@ant-design/icons';
import { Space, Tooltip } from 'antd';
// import { Col, Row } from 'antd';

export function getCarrier(detail: TRANSPORT.TrackInfo) {
  // console.log('--getcarrier', carrier);
  var carrier;
  var final_carrier;
  for (const v of carriers) {
    if (v.key == detail.carrier) {
      carrier = (
        <Space>
          {getCarrierStatus(detail.track.is1)}
          <a href={v._url} target="view_window">
            {' '}
            {v._name}{' '}
          </a>
        </Space>
      );
    }
    if (v.key == detail.final_carrier) {
      final_carrier = (
        <Space>
          {getCarrierStatus(detail.track.is2)}
          <a href={v._url} target="view_window">
            {' '}
            {v._name}{' '}
          </a>
        </Space>
      );
    }
  }
  if (carrier) {
    if (final_carrier) {
      return (
        <div>
          {carrier} <span>{'->'}</span> {final_carrier}
        </div>
      );
    }
    return carrier;
  }
  return <p>-</p>;
}

export function getCarrierV2(detail: TRANSPORT_V2.TrackInfo) {
  var carrier;
  var final_carrier;
  for (const v of carriers) {
    if (v.key == detail.carrier) {
      carrier = (
        <a href={v._url} target="view_window">
          {' '}
          {v._name}{' '}
        </a>
      );
    }
    if (v.key == detail.final_carrier) {
      final_carrier = (
        <a href={v._url} target="view_window">
          {' '}
          {v._name}{' '}
        </a>
      );
    }
  }
  if (carrier) {
    if (final_carrier) {
      return (
        <div>
          {carrier} <span>{'->'}</span> {final_carrier}
        </div>
      );
    }
    return carrier;
  }
  return <p>-</p>;
}

export function getCarrierText(carrier: any) {
  for (const v of carriers) {
    if (v.key == carrier) {
      carrier = v._name
    }
  }
  return carrier;
}

function getCarrierStatus(status: number) {
  switch (status) {
    case 0:
      // 无法识别
      return (
        <Tooltip title="无法识别">
          <ExclamationCircleTwoTone twoToneColor="red" />
        </Tooltip>
      );
    case 1:
      // 正常
      return (
        <Tooltip title="正常">
          <CheckCircleTwoTone />
        </Tooltip>
      );
    case 2:
      // 尚无信息
      return (
        <Tooltip title="尚无信息">
          <CloseSquareTwoTone twoToneColor="red" />
        </Tooltip>
      );
    case 10:
      // 网站错误
      return (
        <Tooltip title="网站错误">
          <WarningTwoTone twoToneColor="red" />
        </Tooltip>
      );
    case 11:
      // 处理错误
      return (
        <Tooltip title="处理错误">
          <BugTwoTone twoToneColor="red" />
        </Tooltip>
      );
    case 12:
      // 查询错误
      return (
        <Tooltip title="查询错误">
          <FrownTwoTone twoToneColor="red" />
        </Tooltip>
      );
    case 20:
      // 网站错误,使用缓存
      return (
        <Tooltip title="网站错误,使用缓存">
          <WarningTwoTone twoToneColor="red" rotate={180} />
        </Tooltip>
      );
    case 21:
      // 处理错误，使用缓存
      return (
        <Tooltip title="处理错误，使用缓存">
          <BugTwoTone twoToneColor="red" rotate={180} />
        </Tooltip>
      );
    case 22:
      // 查询错误，使用缓存
      return (
        <Tooltip title="查询错误，使用缓存">
          <FrownTwoTone twoToneColor="red" rotate={180} />
        </Tooltip>
      );
    default:
      return (
        <Tooltip title="未知错误">
          <ExclamationCircleTwoTone twoToneColor="red" />
        </Tooltip>
      );
  }
}

export function getCountry(country: number | undefined) {
  // console.log('---getcountry', country)
  for (const v of countries) {
    if (v.key == country) {
      // return (<a href={v._url} target='view_window' > {v._name} </a>);
      console.log('get country', v);
      return v._name;
    }
  }
  return '未知';
}