// import { useIntl } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

const Footer: React.FC = () => {
  // const intl = useIntl();
  const defaultMessage = 'Platform As A Service Port';

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'Paasport',
          title: 'Paasport',
          href: '#',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: '#',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
