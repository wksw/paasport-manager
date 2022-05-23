// @ts-nocheck
import React, { useContext, useState } from 'react';
import { Cascader, ConfigProvider } from 'antd';

export const RegionTenantSelect: React.FC = () => {
  const { direction } = useContext(ConfigProvider.ConfigContext);
  const [options, setOptions] = useState([
    {
      value: 'local-alpha',
      label: '本地开发环境',
      endpoint: 'http://paasport.com:9091',
      children: [
        {
          value: 'paasport',
          label: 'paasport',
        },
      ],
    },
    {
      value: 'shenzhen-alpha',
      label: 'IDC开发环境',
      endpoint: 'https://cn-shenzhen.passport.zieldev.com:7443',
      children: [
        {
          value: 'paasport',
          label: 'paasport',
        },
      ],
    },
    {
      value: 'shenzhen-pro',
      label: 'IDC生产环境',
      endpoint: 'https://cn-shenzhen.passport.ziel.cn:7443',
      children: [
        {
          value: 'paasport',
          label: 'paasport',
        },
      ],
    },
    {
      value: 'hongkong-pro',
      label: '香港生产环境',
      endpoint: 'https://passport-gw.zielhome.com',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing',
        },
      ],
    },
  ]);
  return (
    <Cascader
      options={options}
      bordered={false}
      onChange={() => {}}
      placement={direction !== 'rtl' ? 'bottomRight' : 'bottomLeft'}
      value={options[0].name}
      clearIcon={null}
      removeIcon={null}
      loadData={(options) => {
        console.log('----option', options);
      }}
    />
  );
};
