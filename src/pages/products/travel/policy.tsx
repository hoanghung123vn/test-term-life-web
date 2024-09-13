import React, { useMemo } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Message, Notice, Dialog, Grid, Table, Column, Input, DatePicker, Button, Space, Select, Card, Email, Box } from '@ebaoui/rainbowui-sugar-etmoui';
import { DateUtil } from '@ebaoui/rainbowui-sugar-tools';
import { UrlUtil } from '@ebaoui/rainbowui-sugar-tools';

import config from 'config';
import bgIcon from '@/images/Travel_bg_other.png';

//initialize Policy Info page data based on the store policy object
const initPolicyInfo = (policy) => {
    if (policy && policy.effectiveDate) {
        return {
            effectiveDate: policy.EffectiveDate,
            expiryDate: policy.ExpiryDate,
            destination: policy.Destination
        }
    }

    //default uses current data
    const now = new ServerDate();
    now.setHours('00');
    now.setMinutes('00');
    now.setSeconds('00');
    let nowPlusOneYear = DateUtil.add(now, 1, 'years', config.DEFAULT_DATETIME_SUBMIT_FORMATER);
    nowPlusOneYear = DateUtil.subtract(nowPlusOneYear, 1, 'days', config.DEFAULT_DATETIME_SUBMIT_FORMATER);

    return {
        effectiveDate: DateUtil.formatToSubmitFormater(now),
        expiryDate: DateUtil.formatToSubmitFormater(nowPlusOneYear)
        // destination: '11' //default to AU
    };
}

//initialize Policy Holder page data based on the store policy object
const initCustomer = (policy) => {
    if (policy && policy.PolicyCustomerList && policy.PolicyCustomerList.length > 0) {
        return policy.PolicyCustomerList[0];
    }
    return {
        // CustomerName: 'Tony',
        // IdType: '1',
        // IdNo: '3100000000',
        // DateOfBirth: '1990-01-01T00:00:00',
        // Mobile: '13800000000',
        // Email: 'tony.chen@ebaotech.com'
    }
}

//initialize Insured Person page data based on the store policy object
const initInsuredPerson = (policy) => {
    if (policy && policy.PolicyLobList[0].PolicyRiskList && policy.PolicyLobList[0].PolicyRiskList.length > 0
        && policy.PolicyLobList[0].PolicyRiskList[0].RiskName) {
        let id = 1;
        return policy.PolicyLobList[0].PolicyRiskList.map((risk) => {
            id = id + 1;
            return {
                id: id,
                Relation: risk.Relation,
                RiskName: risk.RiskName,
                IdType: risk.IdType,
                IdNo: risk.IdNo,
                DateOfBirth: risk.DateOfBirth,
                Mobile: risk.Mobile
            }
        })
    }

    return ([{
        id: 1,
        Relation: '',
        RiskName: '',
        IdType: '',
        IdNo: '',
        DateOfBirth: '',
        Mobile: ''
    }]);
}

const PolicyInfo = () => {
    const navigate = useNavigate();

    //get policy from state
    const location = useLocation();
    const [storePolicy, setStorePolicy] = useState(location.state.policy);
    // eslint-disable-next-line no-console
    console.log(location)

    //prepare local state for page display. get default value from policy
    const [customer, setCustomer] = useState(initCustomer(storePolicy));
    const [insuredPerson, setInsuredPerson] = useState(initInsuredPerson(storePolicy));
    const [policyInfo, setPolicyInfo] = useState(initPolicyInfo(storePolicy));

    const [confirmBuyDialog, setConfirmBuyDialog] = useState(false);
    const [calculateFlag, setCalculateFlag] = useState(false);
    const [copySelf, setCopySelf] = useState(1);

    const addInsuredPerson = () => {
        setInsuredPerson(state => {
            const newId = Math.max(...state.map(person => person.id)) + 1;
            const newPerson = {
                id: newId,
                Relation: '',
                RiskName: '',
                IdType: '1',
                IdNo: '',
                DateOfBirth: '1998-01-01T00:00:00',
                Mobile: ''
            }
            return [...state, newPerson]
        });
    }

    const buildInsuredPersonFunction = () => {
        return (
            <Space direction="left">
                <Button value='Add' prevIcon="rainbow PlusCircle" onClick={addInsuredPerson} />
            </Space>
        );
    }

    const changeCustomerName = (value: any) => {
        if (value === 'Tony') {
            setCustomer(state => ({
                ...state,
                CustomerName: 'Tony',
                IdType: '1',
                IdNo: '3100000000',
                DateOfBirth: '1990-01-01T00:00:00',
                Mobile: '13800000000',
                Email: 'tony.chen@ebaotech.com'
            }))
        } else {
            setCustomer(state => ({ ...state, CustomerName: value }))
        }
    }

    //utility method to update the cell of a table. Can be reused without change.
    const changeInsurePersonValue = (value: any, index: number, property: string) => {
        setInsuredPerson(newData => {
            newData[index][property] = value;
            return [...newData]
        })
    }


    const deleteInsuredPerson = (dataItem, index) => {
        setInsuredPerson(state => {
            state.splice(index, 1);
            return [...state];
        })
    }

    const relationChange = (dataItem, index, relationValue) => {
        setInsuredPerson(state => {
            state[index].Relation = relationValue;
            return [...state];
        })

        //to trigger the copy customer to self effect
        if (relationValue == '1') {
            setCopySelf(state => state + 1);
        }
    }

    // copy customer value to self rows of insured person table
    useEffect(() => {
        setInsuredPerson(state => {
            state = state.map(e => {
                if (e.Relation == '1') {
                    e.RiskName = customer.CustomerName;
                    e.DateOfBirth = customer.DateOfBirth;
                    e.IdNo = customer.IdNo;
                    e.IdType = customer.IdType;
                    e.Mobile = customer.Mobile;
                }
                return e;
            });
            return [...state];
        })
    }, [copySelf]);


    const validateInsuredPerson = () => {
        //no person insured
        if (insuredPerson.length == 0) {
            Notice['danger']({
                title: 'Warning',
                content: i18n.NoRisk
            });
            return false;
        }

        //two or more self
        let selfCount = 0;
        insuredPerson.forEach(item => {
            if (item.Relation == '1') {
                selfCount++;
            }
        });
        if (selfCount > 1) {
            Notice['danger']({
                title: 'Warning',
                content: i18n.TwoOrMoreSelfInsured
            });
            return false
        }
        return true;
    }

    //Combine ui input and policy to create a new policy object
    const composePolicy = () => {
        const policy = JSON.parse(JSON.stringify(storePolicy));
        //Policy Info
        policy.EffectiveDate = DateUtil.formatToSubmitFormater(policyInfo.effectiveDate);
        policy.ExpiryDate = DateUtil.formatToSubmitFormater(policyInfo.expiryDate);
        policy.ProposalDate = policy.EffectiveDate;
        const userInfo = JSON.parse(sessionStorage.getItem('UserInfo'));
        policy.OrgCode = userInfo.OrgCode;
        
        policy.PolicyLobList[0].Destination = policyInfo.destination;

        //Policy Holder
        policy.PolicyCustomerList = [customer];

        //Insured Person
        let allCoverageList = policy.PolicyLobList[0].PolicyRiskList[0].PolicyCoverageList;
        //create a fresh new coverage list
        allCoverageList = allCoverageList.map(item => {
            return {
                ProductElementCode: item.ProductElementCode,
                SumInsured: item.SumInsured
            }
        })
        const productElementCode = policy.PolicyLobList[0].PolicyRiskList[0].ProductElementCode;
        policy.PolicyLobList[0].PolicyRiskList = [];
        insuredPerson.forEach(person => {
            delete person.id;
            const risk = {
                PolicyCoverageList: allCoverageList,
                ProductElementCode: productElementCode,
                ...person
            }
            policy.PolicyLobList[0].PolicyRiskList.push(risk);
        });
        return policy;
    }

    const calculate = async (e, pass) => {
        if (!pass) { return; }
        if (validateInsuredPerson() == false) {
            return
        }

        const policy = composePolicy();

        //call bff calculate api
        AjaxUtil.show();
        const url = UrlUtil.getConfigUrl('UI_API_GATEWAY_PROXY', 'EXTERNALBFF', 'PROPOSAL_CALCULATE');
        const result = await AjaxUtil.call(url, policy, { 'method': 'POST' });
        AjaxUtil.hide();

        setCalculateFlag(true);
        setStorePolicy(result);
    }

    const next = async (e, pass) => {
        if (!pass) { return; }
        if (validateInsuredPerson() == false) {
            return
        }

        const policy = composePolicy();

        //call bff confirm api
        AjaxUtil.show();
        const url = UrlUtil.getConfigUrl('UI_API_GATEWAY_PROXY', 'EXTERNALBFF', 'PROPOSAL_CONFIRM');
        const result = await AjaxUtil.call(url, policy, { 'method': 'POST' });
        AjaxUtil.hide();

        if (result.ValidationResult) {
            let validationResultMessage = '';
            for (let a = 0; a < result.ValidationResult.length; a++) {
                validationResultMessage = validationResultMessage + '<br/>' + result.ValidationResult[a];
            }
            Message.danger(validationResultMessage, 0, () => {
                //onclose call back
            })
        } else {
            setStorePolicy(result);
            navigate('/pay', { state: { policy: result } })
        }
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
                <Card outline="none" title='PolicyInfo' >
                    <Grid column="4">
                        <DatePicker label="EffectiveDate" required={true} showTime="true"
                            value={policyInfo.effectiveDate} requireName="baseInfo"
                            onChange={(value) => { setPolicyInfo(state => ({ ...state, effectiveDate: value })) }} />
                        <DatePicker label="ExpiryDate" required={true} showTime="true" requireName="baseInfo"
                            value={policyInfo.expiryDate}
                            onChange={(value) => { setPolicyInfo(state => ({ ...state, expiryDate: value })) }} />
                        <Select label="Destination" codeTableName='AUTravelCountry' required={true} requireName="baseInfo"
                            value={policyInfo.destination}
                            onChange={(value) => { setPolicyInfo(state => ({ ...state, destination: value })) }} />
                    </Grid>
                </Card>
                <Card outline="none" title='PolicyHolder'>
                    <Grid>
                        <Input label="CustomerName" requireName="baseInfo"
                            value={customer.CustomerName}
                            onChange={(value) => { changeCustomerName(value) }} />
                        <Select label="IdType" codeTableName='ExternalIDType' requireName="baseInfo"
                            value={customer.IdType}
                            onChange={(value) => { setCustomer(state => ({ ...state, IdType: value })) }} />
                        <Input label="IDNumber" requireName="baseInfo"
                            value={customer.IdNo}
                            onChange={(value) => { setCustomer(state => ({ ...state, IdNo: value })) }} />
                        <DatePicker label="DateOfBirth" requireName="baseInfo"
                            value={customer.DateOfBirth}
                            onChange={(value) => { setCustomer(state => ({ ...state, DateOfBirth: value })) }} />
                        <Email label="Email" requireName="baseInfo" colSpan={{ start: 1, end: 3 }}
                            value={customer.Email}
                            onChange={(value) => { setCustomer(state => ({ ...state, Email: value })) }} />
                        <Input label="MobilePhone" requireName="baseInfo" allowchars="0123456789"
                            value={customer.Mobile}
                            onChange={(value) => { setCustomer(state => ({ ...state, Mobile: value })) }} />
                    </Grid>
                </Card>
                <Card outline="none" title="InsuredPerson">
                    <Table id='insuredPersonDataTable' dataSource={insuredPerson} functions={buildInsuredPersonFunction} pageable='true' showImage='true' >
                        <Column title='Relation' dataIndex='Relation' required={true} width="150px" render={(data, index) => {
                            return (
                                <Select codeTableName='TravelRelation'
                                    value={data.Relation} requireName="baseInfo"
                                    onChange={(value) => { relationChange(data, index, value) }} />
                            );
                        }} />
                        <Column title='InsuredName' dataIndex='RiskName' width="150px" render={(data, index) => {
                            return (
                                <Input value={data.RiskName}
                                    onChange={(value) => changeInsurePersonValue(value, index, 'RiskName')} />
                            );
                        }} />
                        <Column title='IdType' dataIndex='IdType' width="150px" render={(data, index) => {
                            return (
                                <Select io='in' codeTableName='ExternalIDType'
                                    value={data.IdType}
                                    onChange={(value) => changeInsurePersonValue(value, index, 'IdType')} />
                            );
                        }} />
                        <Column title='IdNo' dataIndex='IdNo' width="150px" render={(data, index) => {
                            return (
                                <Input value={data.IdNo}
                                    onChange={(value) => changeInsurePersonValue(value, index, 'IdNo')} />
                            );
                        }} />
                        <Column title='DateOfBirth' dataIndex='DateOfBirth' render={(data, index) => {
                            return (
                                <DatePicker timeFormat="YYYY-MM-DDTHH:mm:ss"
                                    value={data.DateOfBirth}
                                    onChange={(value) => changeInsurePersonValue(
                                        DateUtil.formatToSubmitFormater(value), index, 'DateOfBirth')} />
                            );
                        }} />
                        <Column title='MobilePhone' dataIndex='Mobile' width="150px" render={(data, index) => {
                            return (
                                <Input value={data.Mobile}
                                    onChange={(value) => changeInsurePersonValue(value, index, 'Mobile')} />
                            );
                        }} />
                        <Column title='Action' value='Action' render={(data, index) => {
                            return (
                                <Space direction='left'>
                                    <span className='rainbow Trash' onClick={() => { deleteInsuredPerson(data, index) }} ></span>
                                </Space>
                            );
                        }
                        } />
                    </Table>
                </Card>
            </Card.Group>
            <Box mode="footer">
                <Space direction="right" className='policyFooter' style={{ justifyContent: 'flex-end' }}>
                    <Input io="out" label="DuePremium" layout='horizontal' value={storePolicy.DuePremium} style={{ maxWidth: '200px' }} />
                    <Button value="Back" className='btn' onClick={() => navigate('/coverage')} />
                    <Button value="Calculate" className='btn' requireName="baseInfo" onClick={calculate.bind(this)} />
                    <Button value="Next" type='primary' className='btn' requireName="baseInfo" onClick={next.bind(this)} />
                </Space>
            </Box>
            <Dialog id='confirmBuy' title='Confirm' message='differentPremium' onConfirm='' visible={confirmBuyDialog} />
        </>
    );
}

export default PolicyInfo;
