import React from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Space, Dialog } from '@ebaoui/rainbowui-sugar-etmoui';

import bgIcon from '../../../../images/Life_Ilp_bg.jpg';
import { UrlUtil } from '@ebaoui/rainbowui-sugar-tools';

const LifeIlpPay = () => {
    const navigate = useNavigate();
    const win: any = window;

    //get policy and payMethod from redux store
    const location = useLocation();
    // const policy = useSelector(state => state.policy.lifePolicy.policy);
    const [lifePolicy, setLifePolicy] = useState(location.state.lifeIlpPolicy);
    const collection = useState(location.state.lifeIlpPolicy.collection);
    // const collection = useSelector(state => state.lifePolicy.collection);
    const [payMethod, setPayMethod] = useState('WeChat');

    //prepare local state
    const [dialogVisible, setDialogVisible] = useState(false);
    const [policyNo, setPolicyNo] = useState('');

    const clickIssue = async () => {
        // const userInfo = SessionContext.get('UserInfo');
        // const data = JSON.parse(JSON.stringify(policy));


        AjaxUtil.show();
        const url = UrlUtil.getConfigUrl('UI_API_GATEWAY_PROXY', 'EXTERNALBFF', 'LIFE_PROPOSAL');
        const result = await AjaxUtil.call(url, lifePolicy, { 'method': 'POST' });
        AjaxUtil.hide();

        // const url = UrlUtil.getConfigUrl('UI_API_GATEWAY_PROXY', 'EXTERNALBFF', 'PROPOSAL_ISSUE');
        // if (data && data.PolicyLobList && data.PolicyLobList.length > 0 && data.PolicyLobList[0].PolicyRiskList && data.PolicyLobList[0].PolicyRiskList.length > 0 && data.PolicyLobList[0].PolicyRiskList[0].PolicyCoverageList && data.PolicyLobList[0].PolicyRiskList[0].PolicyCoverageList.length > 0) {
        //     data.PolicyLobList[0].PolicyRiskList[0].PolicyCoverageList.forEach(element => {
        //         element.PolicyStatus = 2;
        //     });
        // }
        // const result = await AjaxUtil.call(url, data, { 'method': 'POST' });
        //     //save policy in redux store
        // setPolicy(result));
        // AjaxUtil.hide();
        setLifePolicy({ ...lifePolicy, policy: result.policy });
        setDialogVisible(true);
        setPolicyNo(result.policy.policyNumber)
    }

    const clickBack = () => {
        navigate('/lifeIlpPolicyInfo', { state: { lifeIlpPolicy: lifePolicy } });
    }
    const clickDialogOK = () => {
        //reset policy in redux store so we can start a new one
        // resetLifePolicy();
        setDialogVisible(false);
        navigate('/lifeIlpHomePage');
    }
    const clickDialogCancel = () => {
        setDialogVisible(false);
    }

    return (
        <>
            <Space>
                <img src={bgIcon} className='topHeadImg' />
                <div className='top_box_content'>
                    <div className='lifeTitle'>Main Life Product</div>
                    <span className='lifeTitle_sub'>ILP</span>
                </div>
            </Space>
            <div className='pageContent payContent'>
                <div className='payCurrencyInfo'>Need to pay CNY <span>{collection.feeAmount}</span></div>
                {/*<div>{i18n.ChoosePayment} : {payMethod}</div>*/}
                <div className="payAll">
                    <div className="payItem">
                        <div className="content">
                            <div className="mod10-0 flex-col"></div>
                            <span className="title">WeChat</span>
                        </div>
                        <label className='radioContent' onClick={() => setPayMethod('WeChat')}>
                            <input className="radio" name="PayMethod" type="radio"
                                checked={payMethod === 'WeChat' ? true : false} />
                            <span className='radioBtn'></span>
                        </label>
                    </div>
                    <div className="payItem">
                        <div className="content">
                            <div className="mod10-1 flex-col"></div>
                            <span className="title">Bank Card</span>
                        </div>
                        <label className='radioContent' onClick={() => setPayMethod('Bank')}>
                            <input className="radio" name="PayMethod" type="radio"
                                checked={payMethod === 'Bank' ? true : false} />
                            <span className='radioBtn'></span>
                        </label>
                    </div>
                    <div className="payItem">
                        <div className="content">
                            <div className="mod10-2 flex-col"></div>
                            <span className="title">AliPay</span>
                        </div>
                        <label className='radioContent' onClick={() => setPayMethod('AliPay')}>
                            <input className="radio" name="PayMethod" type="radio"
                                checked={payMethod === 'AliPay' ? true : false} />
                            <span className='radioBtn'></span>
                        </label>
                    </div>
                    <div className="payItem">
                        <div className="content">
                            <div className="mod10-3 flex-col"></div>
                            <span className="title">YiPay</span>
                        </div>
                        <label className='radioContent' onClick={() => setPayMethod('YiPay')}>
                            <input className="radio" name="PayMethod" type="radio"
                                checked={payMethod === 'YiPay' ? true : false} />
                            <span className='radioBtn'></span>
                        </label>
                    </div>
                    <div className="payItem">
                        <div className="content">
                            <div className="mod10-4 flex-col"></div>
                            <span className="title">Baidu Wallet</span>
                        </div>
                        <label className='radioContent' onClick={() => setPayMethod('Baidu')}>
                            <input className="radio" name="PayMethod" type="radio"
                                checked={payMethod === 'Baidu' ? true : false} />
                            <span className='radioBtn'></span>
                        </label>
                    </div>
                    <div className="payItem">
                        <div className="content">
                            <div className="mod10-5 flex-col"></div>
                            <span className="title">QQ</span>
                        </div>
                        <label className='radioContent' onClick={() => setPayMethod('QQ')}>
                            <input className="radio" name="PayMethod" type="radio"
                                checked={payMethod === 'QQ' ? true : false} />
                            <span className='radioBtn'></span>
                        </label>
                    </div>
                </div>
            </div>
            <Space className='policyFooter' direction="right" style={{ justifyContent: 'flex-end' }}>
                <Button value="Issue" className='btn' onClick={clickIssue} />
                <Button value="Back" className='btn' onClick={clickBack} />
            </Space>
            <Dialog id='InsureSuccess' visible={dialogVisible}
                onCancel={clickDialogCancel}
                onClose={clickDialogCancel}
                onConfirm={clickDialogOK}
                style={{ width: '500px' }}
                footer={
                    <Space style={{ justifyContent: 'right' }}>
                        <Button value='ReturnToHomePage' onClick={clickDialogOK} className='btn' />
                    </Space>
                }>
                <div>{i18n.PurchasePolicy}</div>
                <div>{i18n.PolicyNo + ' ' + policyNo + '.'}</div>
                {/* <div>{i18n.SendPolicyEmail}</div> */}
            </Dialog>
        </>
    );
}

export default LifeIlpPay;
