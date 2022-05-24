import { Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { useModel, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
// import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
// import { RegionTenantSelect } from './RegionTenantSelect';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <span
        className={styles.action}
        onClick={() => {
          window.open('https://passport-doc.zieldev.com');
        }}
      >
        <QuestionCircleOutlined />
      </span>
      <Avatar menu={true} />
      {/* <SelectLang className={styles.action} /> */}
      {/* <RegionTenantSelect /> */}
    </Space>
  );
};
export default GlobalHeaderRight;
