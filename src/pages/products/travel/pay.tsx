import React from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Space, Dialog, Card, Box, Divider } from '@ebaoui/rainbowui-sugar-etmoui';
import { SessionContext } from '@ebaoui/rainbowui-sugar-tools';
import { UrlUtil } from '@ebaoui/rainbowui-sugar-tools';
import bgIcon from '@/images/Travel_bg_other.png';

const Pay = () => {
    const navigate = useNavigate();

    //get policy and payMethod from redux store

    const lacation = useLocation();
    const [policy, setPolicy] = useState(lacation.state.policy);
    const [payMethod, setPayMethod] = useState('WeChat');

    //prepare local state
    const [dialogVisible, setDialogVisible] = useState(false);

    const clickIssue = async () => {
        AjaxUtil.show();
        const userInfo = SessionContext.get('UserInfo');
        const data = JSON.parse(JSON.stringify(policy));

        const url = UrlUtil.getConfigUrl('UI_API_GATEWAY_PROXY', 'EXTERNALBFF', 'PROPOSAL_ISSUE');
        if (data && data.PolicyLobList && data.PolicyLobList.length > 0 && data.PolicyLobList[0].PolicyRiskList && data.PolicyLobList[0].PolicyRiskList.length > 0 && data.PolicyLobList[0].PolicyRiskList[0].PolicyCoverageList && data.PolicyLobList[0].PolicyRiskList[0].PolicyCoverageList.length > 0) {
            data.PolicyLobList[0].PolicyRiskList[0].PolicyCoverageList.forEach(element => {
                element.PolicyStatus = 2;
            });
        }
        const result = await AjaxUtil.call(url, data, { 'method': 'POST' });
        setPolicy(result);
        AjaxUtil.hide();
        setDialogVisible(true);
    }

    const clickBack = () => {
        navigate('/policy', { state: { policy: policy } });
    }
    const clickDialogOK = () => {
        setDialogVisible(false);
        navigate('/home');
    }

    return (
        <>
            <div className='top_box'>
                <img src={bgIcon} className='topHeadImg' />
                <div className='top_box_content'>
                    <div className='travelTitle'>{i18n.GlobalTitle}</div>
                    <span className='travelTitle_sub'>{i18n.Covid}</span>
                </div>
            </div>
            <Card.Group>
                <Card showExpandIcon={false}>
                    <div className='pageContent payContent'>
                        <div className='payCurrencyInfo'>Need to pay AUD <span>{policy.DuePremium}</span></div>
                        <Divider dashed='true' />
                        <div>{i18n.ChoosePayment} : {payMethod}</div>
                        <div className="payAll">
                            <div className="payItem">
                                <div className="content">
                                    <div className="mod10-0 flex-col"></div>
                                    <span className="title">WeChat</span>
                                </div>
                                <label className='radioContent' onClick={() => setPayMethod('WeChat')}>
                                    <input className="radio" name="PayMethod" type="radio"
                                        defaultChecked={payMethod === 'WeChat' ? true : false} />
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
                                        defaultChecked={payMethod === 'Bank' ? true : false} />
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
                                        defaultChecked={payMethod === 'AliPay' ? true : false} />
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
                                        defaultChecked={payMethod === 'YiPay' ? true : false} />
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
                                        defaultChecked={payMethod === 'Baidu' ? true : false} />
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
                                        defaultChecked={payMethod === 'QQ' ? true : false} />
                                    <span className='radioBtn'></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </Card>
            </Card.Group>
            <Box mode="footer">
                <Space className='policyFooter' direction="right" style={{ justifyContent: 'flex-end' }}>
                    <Button value="Back" className='btn' onClick={clickBack} />
                    <Button value="Issue" className='btn' type='primary' onClick={clickIssue} />
                </Space>
            </Box>
            <Dialog id='InsureSuccess' visible={dialogVisible} closable={false}
                style={{ width: '600px' }}
                footer={
                    <Space style={{ justifyContent: 'right' }}>
                        <Button value='ReturnToHomePage' onClick={clickDialogOK} className='btn' />
                    </Space>
                }>
                <div>{i18n.PurchasePolicy}</div>
                <div>{i18n.PolicyNo + ' ' + policy.PolicyNo + '.'}</div>
                <div>{i18n.SendPolicyEmail}</div>
            </Dialog>
        </>
    );
}

export default Pay;