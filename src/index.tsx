import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import App from './App';
import Login from './pages/login';
import Index from './pages/products/travel/index';
import Coverage from './pages/products/travel/coverage';
import Pay from './pages/products/travel/pay';
import Policy from './pages/products/travel/policy';
import Entrance from './pages/entrance';
import LifeIndex from './pages/products/life/termLife';
import LifeCoverage from './pages/products/life/termLife/lifecoverage';
import LifePolicyInfo from './pages/products/life/termLife/lifepolicy';
import LifePay from './pages/products/life/termLife/lifepay';
import { UrlUtil } from '@ebaoui/rainbowui-sugar-tools';
import './styles/App.css';
import LifePoliciesTable from '@/pages/products/life/policy/lifePoliciesTable';
import LifePolicyDetail from '@/pages/products/life/policy/lifePolicyDetail';
import LifeIlpPolicy from '@/pages/products/life/termLifeIlp/lifeIlpPolicy';
import LifeIlpCoverage from '@/pages/products/life/termLifeIlp/lifeIlpCoverage';
import LifeIlpPay from '@/pages/products/life/termLifeIlp/lifeIlpPay';
import LifeIlpIndex from '@/pages/products/life/termLifeIlp';
import ProductDetail from './pages/products/life/termLife/productDetail';
import Proposal from './pages/products/life/termLife/proposal';
import LifeCycle from './pages/products/life/termLife/lifeCycle';

declare module '*.png';
declare module '*.jpg';

const config: any = sessionStorage.getItem('project_config') ? JSON.parse(sessionStorage.getItem('project_config') || '{}') : null;
let isGetUser = false;

const getUserInfo = async () => {
    const getUserInfoUrl = UrlUtil.getConfigUrl(config.UI_API_GATEWAY_PROXY + 'urp/public/users/v1/current/info');
    const userInfo = await AjaxUtil.call(UrlUtil.getConfigUrl(getUserInfoUrl), null, { 'method': 'GET' });
    const getUserImageUrl = UrlUtil.getConfigUrl(config.UI_API_GATEWAY_PROXY + 'urp/public/users/v1/getCurrentUserImage');
    const userImage = await AjaxUtil.call(UrlUtil.getConfigUrl(getUserImageUrl), null, { 'method': 'GET' });
    sessionStorage.setItem('UserImage', userImage);
    sessionStorage.setItem('UserInfo', JSON.stringify(userInfo));
};

function RequireAuth({ children }: { children: JSX.Element }) {
    if (!sessionStorage.getItem('Authorization')) {
        sessionStorage.setItem('Authorization', 'access_token=MOAToqGVUBuIAXwbQv_xD-hAc8duVKrS');
    }
    const location = useLocation();
    if (location && location.pathname == '/login') {
        return children;
    }
    const config: any = sessionStorage.getItem('project_config');
    const token: any = sessionStorage.getItem('Authorization');
    const userInfo: any = sessionStorage.getItem('UserInfo');
    if (config && token) {
        sessionStorage.setItem('goInAdmin', 'true');
        if (!userInfo && !isGetUser) {
            isGetUser = true;
            getUserInfo();
        }
        return children;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
}

const container = document.getElementById('app');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <Router>
            <RequireAuth>
                <Routes>
                    <Route path='/' element={<App />}>
                        <Route path='/login' element={<Login />} />
                        <Route index element={<Entrance />} />
                        {/*<Route path='/home' element={<Entrance />} />*/}
                        {/*<Route path='/travel' element={<Index />} />*/}
                        {/*<Route path='/coverage' element={<Coverage />} />*/}
                        {/*<Route path='/policy' element={<Policy />} />*/}
                        {/*<Route path='/pay' element={<Pay />} />*/}

                        {/*<Route path='/lifeHomePage' element={<LifeIndex />} />*/}
                        {/*<Route path='/lifeCoverage' element={<LifeCoverage />} />*/}
                        {/*<Route path='/lifePolicyInfo' element={<LifePolicyInfo />} />*/}
                        {/*<Route path='/lifePay' element={<LifePay />} />*/}

                        {/*<Route path='/lifePoliciesTable' element={<LifePoliciesTable />} />*/}
                        {/*<Route path='/lifePolicyDetail' element={<LifePolicyDetail />} />*/}

                        {/*<Route path='/lifeIlpHomePage' element={<LifeIlpIndex />} />*/}
                        {/*<Route path='/lifeIlpCoverage' element={<LifeIlpCoverage />} />*/}
                        {/*<Route path='/lifeIlpPolicyInfo' element={<LifeIlpPolicy />} />*/}
                        {/*<Route path='/lifeIlpPay' element={<LifeIlpPay />} />*/}

                        <Route path='/lifeProductDetail' element={<ProductDetail />} />
                        <Route path='/lifeCycle' element={<LifeCycle />} />
                        {/* <Route path="*" element={<Navigate to="/home" />} /> */}
                    </Route>
                </Routes>
            </RequireAuth>
        </Router>
    </React.StrictMode>);
