import React from 'react';
import { Outlet } from 'react-router-dom';
import { Page } from '@ebaoui/rainbowui-sugar-etmoui';
import { ThemeProvider } from '@ebaoui/rainbowui-sugar-common-ui';
import { useLocation } from 'react-router-dom';

const AppRoot: React.FC = (props) => {
    const location: any = useLocation() || {};

    return (
        //Do not use react-redux without adding <Provider>
        //不使用react-redux不用加<Provider>
        <Page pathname={location.pathname}>
            <ThemeProvider />
            <Outlet />
        </Page>
    );
}

export default AppRoot;