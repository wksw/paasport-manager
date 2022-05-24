import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Cascader, message, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { ProFormCaptcha, ProFormCheckbox, ProFormText, LoginForm, ProFormSelect } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, useModel } from 'umi';
import Footer from '@/components/Footer';
// import { login } from '@/services/ant-design-pro/api';
import { LoginWithPassword } from '@/services/paasport/login/login_umirequest';
import { Set as SetStorage, Get as GetStorage } from '@/storage/storage';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import styles from './index.less';
import { RegionTenantSelect } from '@/components/RightContent/RegionTenantSelect';
import { locale } from 'moment';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const endpoints = [{
    label: '本地开发环境',
    value: 'http://paasport.com:9091'
  }, {
    label: 'IDC开发环境',
    value: 'https://cn-shenzhen.passport.zieldev.com:7443'
  }, {
    label: 'IDC生产环境',
    value: 'https://cn-shenzhen.passport.ziel.cn:7443',
  }, {
    label: '香港生产环境',
    value: 'https://passport-gw.zielhome.com',
  }];

  const tenants = {
    'http://paasport.com:9091': [{
      label: '主租户',
      value: 'paasport'
    }],
    'https://cn-shenzhen.passport.zieldev.com:7443': [{
      label: '主租户',
      value: 'paasport'
    }, {
      label: '测试租户',
      value: 'test'
    }],
    'https://cn-shenzhen.passport.ziel.cn:7443': [{
      label: '主租户',
      value: 'paasport'
    }],
    'https://passport-gw.zielhome.com': [{
      label: '主租户',
      value: 'paasport'
    }, {
      label: '测试租户',
      value: 'test'
    }, {
      label: 'DE租户',
      value: 'de'
    }, {
      label: 'FR租户',
      value: 'fr'
    }, {
      label: 'GB租户',
      value: 'gb'
    }, {
      label: 'US租户',
      value: 'us'
    }]
  }

  let localEndpoint = GetStorage('PAASPORT-ENDPOINT')
  if (localEndpoint == null) {
    localEndpoint = endpoints[0].value
    SetStorage('PAASPORT-ENDPOINT', localEndpoint, -1)
  }

  const endpointTenants = tenants[localEndpoint]

  let localTenant = GetStorage('PAASPORT-CURRENT-TENANT')
  if (localTenant == null) {
    localTenant = tenants[localEndpoint][0].value
    SetStorage('PAASPORT-CURRENT-TENANT', localTenant, -1)
  }

  const [currentTenant, setCurrentTenant] = useState(localTenant)


  const handleSubmit = async (values: LOGIN.LoginWithPasswordReq) => {
    if (type === 'account') {
      // 账户密码登录
      try {
        const tokenDetail = await LoginWithPassword({ ...values });
        SetStorage('X-Auth-Token', tokenDetail, tokenDetail.expires_at);
        await fetchUserInfo();
        setUserLoginState({
          loginType: type,
          status: 'success',
        });
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      } catch (error) {
        setUserLoginState({
          loginType: type,
          status: 'error',
        });
      }
    }
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        <RegionTenantSelect />
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/paasport.svg" />}
          title="aasport"
          subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{
            autoLogin: true,
          }}
          actions={[
            <FormattedMessage
              key="loginWith"
              id="pages.login.loginWith"
              defaultMessage="其他登录方式"
            />,
            <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon} />,
            <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon} />,
            <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon} />,
          ]}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: '账户密码登录',
              })}
            />
            <Tabs.TabPane
              key="mobile"
              tab={intl.formatMessage({
                id: 'pages.login.phoneLogin.tab',
                defaultMessage: '手机号登录',
              })}
            />
          </Tabs>

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/ant.design)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormSelect
                request={async () => endpoints}
                name="endpoint"
                placeholder='请选择环境'
                fieldProps={{
                  defaultValue: localEndpoint,
                  onChange: (value) => {
                    console.log('------endpoint changed', value)
                    setCurrentTenant(tenants[value][0].value)
                    SetStorage('PAASPORT-ENDPOINT', value, -1);
                    SetStorage('PAASPORT-CURRENT-TENANT', tenants[value][0].value, -1);
                  }
                }}
              />
              <ProFormSelect
                request={async (param) => {
                  console.log("-----------param", param);
                  return param.endpoint ? tenants[param.endpoint] : endpointTenants
                }}
                name="tenant"
                dependencies={['endpoint']}
                fieldProps={{
                  value: currentTenant,
                  onChange: (value) => {
                    setCurrentTenant(value)
                    SetStorage('PAASPORT-CURRENT-TENANT', value, -1);
                  }
                }}
                placeholder='请选择租户'
              />
              <ProFormText
                name="account"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名: admin or user',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码: ant.design',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await getFakeCaptcha({
                    phone,
                  });
                  if (result === false) {
                    return;
                  }
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="remeber_me">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
