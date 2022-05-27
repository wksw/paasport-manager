import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { RequestConfig, ErrorShowType } from 'umi';
import { RequestOptionsInit, RequestInterceptor, ResponseInterceptor, Context } from 'umi-request';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
// import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { GetInfo as GetAccountInfo } from '@/services/paasport/account/account_umirequest';
import { GetResourceBindRoles as GetAccountRoles } from '@/services/paasport/auth/auth_umirequest';
// import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
// import defineConfig from '../config/config';
import { Get as GetStorage } from './storage/storage';
import { message } from 'antd';

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';
const trackV2Path = '/transport/v2/track'
// const { base_url, app_id } = defineConfig;

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: PAASPORT.AccountInfo;
  loading?: boolean;
  fetchUserInfo?: () => Promise<PAASPORT.AccountInfo | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const info = await GetAccountInfo();
      const roles = await GetAccountRoles({ resource: info.uid });
      return {
        info: info,
        roles: roles,
      };
    } catch (error) {
      history.push(loginPath + `?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
    return undefined;
  };
  // console.log('get init state', history.location.pathname)
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath && history.location.pathname != trackV2Path) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      // const { location } = history;
      // // 如果没有登录，重定向到 login
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.push(loginPath);
      // }
    },
    // links: isDev
    //   ? [
    //     <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
    //       <LinkOutlined />
    //       <span>OpenAPI 文档</span>
    //     </Link>,
    //     <Link to="/~docs" key="docs">
    //       <BookOutlined />
    //       <span>业务组件文档</span>
    //     </Link>,
    //   ]
    //   : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {/* {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState: any) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )} */}
        </>
      );
    },
    ...initialState?.settings,
  };
};

// 请求拦截器
const paasportRequestInterceptor: RequestInterceptor = (
  url: string,
  options: RequestOptionsInit,
) => {
  if (!url.startsWith('http')) {
    const base_url = GetStorage("PAASPORT-ENDPOINT")
    if (base_url == null) {
      history.push(loginPath);
      return {
        url: url,
        options,
      };
    }
    url = base_url + url;
  }

  options.headers = {
    ...options.headers,
    'Paasport-App-Id': process.env.app_id ?? '',
  };
  const token = GetStorage('X-Auth-Token');
  const tenant = GetStorage("PAASPORT-CURRENT-TENANT")
  // console.log('--------tenant', tenant);
  options.headers = {
    ...options.headers,
    'X-Auth-Token': token?.token,
    'paasport-tenant-name': tenant ? tenant : 'paasport'
  };
  return {
    url: url,
    options,
  };
};

// 返回拦截器
const paasportResponseInterceptor: ResponseInterceptor = (
  response: Response,
  options: RequestOptionsInit,
) => {
  // console.log('-----paasportResponseInterceptor: ', response);
  if (response.status == 401) {
    history.push(loginPath);
  }
  return response;
};

// 请求错误处理
// const paasportErrorHandler = (error: ResponseError) => {

// }

// 网络请求拦截器
export const request: RequestConfig = {
  errorConfig: {
    adaptor: (resData: any, ctx: Context) => {
      return {
        success: resData.code == 0 || resData.code == undefined,
        errorCode: resData.err_code,
        errorMessage: resData.error,
        // showType: ErrorShowType.ERROR_MESSAGE,
        // ...resData,
      };
    },
  },
  requestInterceptors: [paasportRequestInterceptor],
  responseInterceptors: [paasportResponseInterceptor],
};
