# This is a no redux project based react.

## Background

This project is developed using InsureMO RainbowUI 5.0 framework.

Before getting started, please visit [rainbow5.0] to learn more about Rainbow UI framework.

## Prerequisite
Installed [nodejs](https://nodejs.org/en/) 14+ ~18.13​   (npm<=8)

Unserstand the basic idea of following UI technology

[reactjs](https://reactjs.org/) RainbowUI 5.0 is based on React v18+

[reactjshooks](https://reactjs.org/docs/hooks-intro.html) While RainbowUI can work with both React class component and function component, this example is written using function component and hooks.

### Setup
Modify project files as follows:
- Modify **tenant code**. Replace all the **ebaogi** words with your own tenant code. Files to be changed are:
  - src/config/config.json
  - webpack.dev.js  
- Modify **backend application name**. Replace all the **appframework-bff-app** words with your own backend CICD job name. Files to be changed are:
  - src/config/config.js
  - webpack.dev.js
- Modify **frontend application name**. You need to set name in the **package.json** file by your own frontend CICD job name.

You will get a new and runnable code after finishing the above steps.

## Local Development

### Config local npm environment parameter

Config npm registry
```
npm config set registry https://registry.npmjs.org/
npm config set @ebaoui:registry=https://public.ebaotech.com/artifactory/api/npm/npm/
npm config set always-auth false
```
You may use a mirror site to speedup package install. for example, npmnirror.com 
```
npm config set registry https://registry.npmmirror.com/
npm config set @ebaoui:registry=https://public.ebaotech.com/artifactory/api/npm/npm/
npm config set always-auth false
```

Please check the content of your local .npmrc file(file path:C:\Users\username\) to verify the above config is correctly set. 

If there is an error when executing npm command, please check whether your npm version meets the requirement.


### Install and run local project

Locate your UI project then execute below statement in command line.

```
npm install
npm run dev
```

> If you're facing issue while execute npm install, please check your .npmrc settings, and **delete the package-lock.json and try npm install again**.

## Build and deploy to InsureMO

> You need to push your local commit to origin repository first.
> Please refer to this [Fork Code](https://docs.insuremo.com/overview/stepbystep/Fork_Code) guide to create your own repository.

Please refer to this [Build&Deploy Guide](https://docs.insuremo.com/overview/stepbystep/Build&Deploy).


## How to develop

### How to access the page locally

Once project is running, you can open your browser and access the index.tsx page with url as below:

```
http://localhost:8999/#/
```

or access the index.tsx page with url

```
http://localhost:8999/#/home
```


### How to config page route in index.tsx(src\index.tsx)

This example uses React Router to manage page routing. Following is an example:

```
        <Router>
            <RequireAuth>
                <Routes>
                    <Route path='/' element={<App />}>
                        <Route index              element={<Index />}/>
                        <Route path='/home'       element={<Index />}/>
                        <Route path='/login'      element={<Login />}/>
                        <Route path='/coverage'   element={<Coverage />}/>
                        <Route path='/policy'     element={<Policy />}/>   
                        <Route path='/pay'        element={<Pay />}/>   
                    </Route>
                </Routes>
            </RequireAuth>
        </Router>

```

### How to develop UI page

include static resource and Rainbow UI components as below:

```
import { Grid, Table, Column, Input, DatePicker, Button, Space, Select, Card, Email} from "@ebaoui/rainbowui-sugar-etmoui";
import { UrlUtil, DateUtil} from "rainbowui-sugar-tools";
import bgIcon from '@/images/Travel_bg_other.png'; // @ is alias of src
import config from 'config';
```

### Define global parameters in 'src/global.d.ts'

```
declare const AjaxUtil: any;
declare const ServerDate: function;
declare const GetUrlParam: function;
declare const setSkin: function;
declare const i18n: function;
declare const config: function;

// declare images as module
declare module '*.jpg';
declare module '*.png';
declare module '*.svg';
```

Develop and render your page like below. Make sure you place content inside Rainbow layout components such as Space, Grid, Tab, Card, Card.Group.

```
    return (
        <div className='travelPage homePage'>
            <div className='travelHead'>
                <div className='travelHead_box'>
                    <div className='travelHeadImg'>
                        <img src={bgIcon} />
                    </div>

                    <div className='travel_head_content'>
                        <div className='travelTitle'>{i18n.GlobalTitle}</div>
                        <span className='travelTitle_sub'>{i18n.Covid}</span>
                        <div className='travelInfo'>{i18n.TravelIntroduce}</div>
                        <div className='getQuoteBtn_box'>
                            {/* <div className='welcome'>{i18n.Welcome}</div> */}
                            <Button value='GetQuote' className='getQuoteBtn' onClick={() => { navigate('/coverage') }} />
                        </div>
                    </div>
                </div>

            </div>
            <div className='travelContent'>
                {/* <UIBox direction='left'> */}
                <div className='travelItem'>
                    <span className="rainbow AccidentalInjurie"></span>
                    <div className="title">Accident Medical Treatment</div>
                </div>
                <div className="split_line" />
                <div className='travelItem'>
                    <span className="rainbow DiedOrDisabled"></span>
                    <div className="title">Hospital Benefit</div>
                </div>
                <div className="split_line" />
                <div className='travelItem'>
                    <span className="rainbow PropertyLoss"></span>
                    <div className="title">Lost Personal Money</div>
                </div>
                <div className="split_line" />
                <div className='travelItem'>
                    <span className="rainbow FlightDelay"></span>
                    <div className="title">Flight Delay</div>
                </div>
                <div className="split_line" />
                <div className='travelItem'>
                    <span className="rainbow IntelligentHelp"></span>
                    <div className="title">24-hrs Hotline Assistance Services</div>
                </div>
                {/* </UIBox> */}
            </div>
            <div className='travelContent_bg'></div>
        </div>
    );
```

### How to set local develop information to connect remote server

config remote server parameters in config.json(src\config\config.json)

1. Set remote server

```
"UI_API_GATEWAY_PROXY": "https://${tenantCode}-sandbox-2-sg.insuremo.com/"
```

2. Set remote api gateway server

```
"UI_API_GATEWAY_PROXY": "https://sandbox-2-sg-gw.insuremo.com/"
```
If you want to debug UI app and service app locally together, you can set like this. 
```
"LOCAL_PROXY_PATHS": [
    "/appframework-bff-app"
]
```

3. Config proxy:
Config proxy in config.js(src\config\config.js) as below:
```
proxy: {
    '/appframework-bff-app': {
        target: 'http://localhost:80',
        changeOrigin: true,
        pathRewrite: { '^/appframework-bff-app': '' }
    }
}
```

### How to config request api

Config external-bff api in webpack.dev.js as below:

```
let BFF_APP_NAME = 'appframework-bff-app';

EXTERNALBFF: {
    PROPOSAL_SAVE: `${BFF_APP_NAME}/proposal/v1/save`,
    PROPOSAL_CALCULATE: `${BFF_APP_NAME}/proposal/v1/calculate`,
    PROPOSAL_CONFIRM: `${BFF_APP_NAME}/proposal/v1/proposalConfirm`,
    PROPOSAL_ISSUE: `${BFF_APP_NAME}/proposal/v1/issue`
}
```

> The appframework-bff-app is backend service name

### How to use ajax request remote api

Such as request external bff api PROPOSAL_CONFIRM in policy.tsx(src\pages\products\travel\policy.tsx)


```
AjaxUtil.show();
let url = UrlUtil.getConfigUrl('UI_API_GATEWAY_PROXY', 'EXTERNALBFF', 'PROPOSAL_CALCULATE');
let result = await AjaxUtil.call(url, policy, { 'method': 'POST' });
AjaxUtil.hide();
```

## How to get the URL that config to URP

1. Login in portal with your account: https://visitor.insuremo.com/#/.
2. Switch to your tenant account on top right.
3. First CI/CD your web project.
4. Click 'My Console' on top right after deployed your project.
5. Click 'Runtime' on left menu.
6. Find your web project and click 'Launch'.
7. It will jump to a new page in another tab.
8. Login and you will get the URL such as: <https://freshman-sandbox-2-sg.insuremo.com/ui/admin/#/?homepage=ui/web/>.
9. You need to config URL:'ui/web/' after homepage into URP.


## FAQ

- [nodejs](https://nodejs.org/en/)
- [reactjs](https://reactjs.org/)
- [reactjshooks](https://reactjs.org/docs/hooks-intro.html)
- [redux](https://redux.js.org/)
- [rainbow5.0](https://rainbow-doc.insuremo.com/ui/sugar-doc/#/)
- [insuremo](https://portal.insuremo.com/)
- [Github template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)
- [template-sync git action](https://github.com/marketplace/actions/actions-template-sync)
