import React, { useMemo } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Dialog, Grid, Table, Column, Input, DatePicker, Button, Space, Select, Card, Email } from '@ebaoui/rainbowui-sugar-etmoui';
import { DateUtil } from '@ebaoui/rainbowui-sugar-tools';
import config from 'config';
import bgIcon from '../../../../images/Life_bg_other.png';
import { UrlUtil } from '@ebaoui/rainbowui-sugar-tools';
import {
    employedIndiCodetables,
    genderCodetables,
    idTypeCodetables, relationToPHCodetables,
    yesNoCodetables
} from '../codetable';

const LifePolicyInfo = () => {
    const navigate = useNavigate();

    //get policy from state
    const location = useLocation();
    const [storeLifePolicy, setLifePolicy] = useState(location.state.lifePolicy);

    const [premium, setPremium] = useState('');
    const [calculateFlag, setCalculateFlag] = useState(false);
    const [collection, setCollection] = useState<any>({});
    const [policyInfo, setPolicyInfo] = useState<any>({
        'applyDate': null,
        'currency': 1,
        'quotationCode': 'CHAOS01Q',
        'serviceAgentCode': 'CHAOS-CHL',
        'salesChannelCode': ' CHAOS-CHL',
        'insurerCode': 'CHAOS',
        'inceptionDate': null,
        'coverages': [
            {
                'coverageSerialId': 1,
                'chargePeriod': '2',
                'chargeYear': 40,
                'coveragePeriod': '2',
                'coverageYear': 40,
                'deferPeriod': 0,
                'productCode': 'RegularPrem_LongTerm',
                'currentPremium': {
                    'paymentFreq': '1',
                    'sumAssured': 100000
                },
                'insureds': [
                    {
                        'orderId': 1,
                        'partySerialId': 1
                    }
                ]
            }
        ],
        'payerAccounts': [
            {
                'paymentMethod': 1,
                'paymentMethodNext': 1
            }
        ],
        'policyHolder': {
            'partySerialId': 1,
            'relationToLA': 1
        },
        'insureds': [
            {
                'partySerialId': 1,
                'relationToPH': 1
            }
        ]
    });
    const [customer, setCustomer] = useState<any>({
        occupationCode: '2',
        marriageStatus: '6',
        employedIndi: '2',
        nationality: '99',
        preferredLifeIndi: '2'
    });
    const [otherCustomer, setOtherCustomer] = useState<any>({});
    const [insureds, setInsureds] = useState<any>([{}]);

    const [confirmBuyDialog, setConfirmBuyDialog] = useState(false);
    const [copySelf, setCopySelf] = useState(1);


    // utility method to update the cell of a table. Canbe reused without change.
    const changeInsurePersonValue = (value: any, index: number, property: string) => {
        setInsureds(newData => {
            newData[index][property] = value;
            return [...newData]
        })
    }

    const relationChange = (dataItem, index, relationValue) => {
        setInsureds(state => {
            state[index].relationToPH = relationValue;
            return [...state];
        })

        //to trigger the copy customer to self effect
        if (relationValue == '1') {
            setCopySelf(state => state + 1);
        }
    }

    // copy customer value to self rows of insured person table
    useEffect(() => {
        setInsureds(state => {
            state = state.map(e => {
                if (e.relationToPH == '1') {
                    e.firstName = customer.firstName;
                    e.birthdate = customer.birthdate;
                    e.certiCode = customer.certiCode;
                    e.certiType = customer.certiType;
                    e.mobileTel = customer.mobileTel;
                    e.email = customer.email;
                }
                return e;
            });
            return [...state];
        })
    }, [copySelf]);

    //Combine ui input and policy to create a new policy object
    const composeQuotationRequest = () => {
        const newPolicyRequest = policyInfo;
        const now = new Date();
        newPolicyRequest.applyDate = DateUtil.formatToSubmitFormater(now);
        // newPolicyRequest.submissionDate = DateUtil.formatToSubmitFormater(now);

        newPolicyRequest.customers = [
            {
                'partySerialId': 1,
                'partyType': 1,
                person: {},
                partyContact: {},
                'address': {
                    'address1': 'Shanghai',
                    'address2': '',
                    'address3': '',
                    'address4': 'eBao',
                    'postCode': '222222'
                }
            }
        ]
        newPolicyRequest.customers.map(cus => {
            cus.person.gender = customer.gender;
            cus.person.birthdate = customer.birthdate;
            cus.person.certiType = customer.certiType;
            cus.person.certiCode = customer.certiCode;
            cus.person.firstName = customer.firstName;
            cus.person.lastName = customer.lastName;
            cus.person.nationality = customer.nationality;
            cus.person.preferredLifeIndi = customer.preferredLifeIndi;
            cus.person.smoking = customer.smoking;
            cus.person.occupationCode = customer.occupationCode;
            cus.person.marriageStatus = customer.marriageStatus;
            cus.person.employedIndi = customer.occupationCode;
            cus.partyContact.mobileTel = customer.mobileTel;
            cus.partyContact.email = customer.email;
        })
        return newPolicyRequest;
    }

    const calculate = async () => {
        const policy = composeQuotationRequest();
        AjaxUtil.show();
        const url = UrlUtil.getConfigUrl('UI_API_GATEWAY_PROXY', 'EXTERNALBFF', 'LIFE_PROPOSAL_CALCULATE');
        const result = await AjaxUtil.call(url, { policy: policy }, { 'method': 'POST' });
        AjaxUtil.hide();
        setPremium(result.policy.installPrem)
        // const newPolicy = policyInfo
        const newCollection = {
            'payMode': 1,
            'currency': 1,
            'feeAmount': result.policy.installPrem
        }
        setCalculateFlag(true)
        setPolicyInfo(policy)
        setCollection(newCollection)
    }

    const next = async () => {
        const newPolicy = policyInfo;
        newPolicy.coverages.map(coverage => {
            delete (coverage.deferPeriod)
        })
        newPolicy.customers.map(cus => {
            cus.person.gender = customer.gender;
            cus.person.birthdate = customer.birthdate;
            cus.person.certiType = customer.certiType;
            cus.person.certiCode = customer.certiCode;
            cus.person.firstName = customer.firstName;
            cus.person.lastName = customer.lastName;
            cus.person.nationality = customer.nationality;
            cus.person.preferredLifeIndi = customer.preferredLifeIndi;
            cus.person.smoking = customer.smoking;
            cus.person.occupationCode = customer.occupationCode;
            cus.person.marriageStatus = customer.marriageStatus;
            cus.person.employedIndi = customer.occupationCode;
            cus.partyContact.mobileTel = customer.mobileTel;
            cus.partyContact.email = customer.email;
        })
        const newLifePolicy = { ...storeLifePolicy, policy: newPolicy, collection: collection };
        setLifePolicy(newLifePolicy);
        navigate('/lifePay', { state: { lifePolicy: newLifePolicy } });
    }

    const changeCustomerFirstName = (firstName: any) => {
        if(firstName === 'Tony'){
            setCustomer(state => ({ ...state,
                'gender': 'M',
                'birthdate': '1993-01-09T00:00:00',
                'certiType': 1,
                'certiCode': '1238512845',
                'firstName': 'Tony',
                'lastName': 'Chen',
                'nationality': '99',
                'preferredLifeIndi': '2',
                'smoking': 'N',
                'occupationCode': '2',
                'marriageStatus': '6',
                'employedIndi': '2',
                'mobileTel': '18888888888',
                'email': 'tony.chen@ebaotech.com'
            }))
        }else{
            setCustomer({ ...customer, firstName })
        }
    }

    useEffect(() => {
        const now = new Date();
        const newPolicy = JSON.parse(JSON.stringify(storeLifePolicy)).policy;
        newPolicy.inceptionDate = now;
        setPolicyInfo(newPolicy);
    }, []);


    return (
        <>
            <div className='top_box'>
                <img src={bgIcon} className='topHeadImg' style={{ width: '100vw' }} />
                <div className='top_box_content'>
                    <div className='travelTitle'>Term Life Product</div>
                    <span className='travelTitle_sub'>Term Life</span>
                </div>
            </div>
            <Card.Group>
                <Card outline="none" title='PolicyInfo' >
                    <Grid column="4">
                        <DatePicker label="EffectiveDate" required={true} showTime="true"
                            disabled={true}
                            timeFormat="YYYY-MM-DD"
                            value={policyInfo.inceptionDate}
                            onChange={(value) => { setPolicyInfo(state => ({ ...state, inceptionDate: value })) }} />
                        {/*<DatePicker label="ExpiryDate" required={true} showTime="true" timeFormat="YYYY-MM-DDTHH:mm:ss"*/}
                        {/*    value={policyInfo.expiryDate}*/}
                        {/*    onChange={(value) => { setPolicyInfo(state => ({ ...state, expiryDate: value })) }} />*/}
                    </Grid>
                </Card>
                <Card outline="none" title='PolicyHolder'>
                    <Grid>
                        <Input label="First Name" requireName='union' noI18n
                            value={customer.firstName}
                            onChange={firstName => changeCustomerFirstName(firstName)} />
                        <Input label="Last Name" requireName='union' noI18n
                            value={customer.lastName}
                            onChange={lastName => setCustomer({ ...customer, lastName })} />
                        <Select label="Gender" codeTable={genderCodetables} requireName='union'
                            noI18n value={customer.gender}
                            onChange={gender => setCustomer({ ...customer, gender })} />
                        <Select label="Certificate Type" codeTable={idTypeCodetables} requireName='union'
                            noI18n value={customer.certiType}
                            onChange={certiType => setCustomer({ ...customer, certiType })} />
                        <Input label="IDNumber" requireName='union' noI18n
                            value={customer.certiCode}
                            onChange={certiCode => setCustomer({ ...customer, certiCode })} />
                        <DatePicker label="Date Of Birth" requireName='union' noI18n
                            value={customer.birthdate}
                            onChange={birthdate => setCustomer({ ...customer, birthdate })} />
                        <Select label="Smoking" codeTable={yesNoCodetables} requireName='union'
                            noI18n value={customer.smoking}
                            onChange={smoking => setCustomer({ ...customer, smoking })} />
                        {/*<Select label="Employed Indicator" codeTable={employedIndiCodetables} requireName='union'*/}
                        {/*    noI18n value={customer.employedIndi}*/}
                        {/*    onChange={employedIndi => setCustomer({...customer, employedIndi})} />*/}
                        <Email label="Email" noI18n requireName='union'
                            value={customer.email}
                            onChange={email => setCustomer({ ...customer, email })} />
                        <Input label="MobilePhone" requireName='union' allowChars="0123456789" noI18n
                            value={customer.mobileTel}
                            onChange={mobileTel => setCustomer({ ...customer, mobileTel })} />
                    </Grid>
                </Card>
                <Card outline="none" title="InsuredPerson">
                    <Table id='insuredPersonDataTable' dataSource={insureds} pageable='true' showImage='true' >
                        <Column noI18n title='Relation' dataIndex='Relation' required="true" width="150px" render={(data, index) => {
                            return (
                                <Select codeTable={relationToPHCodetables}
                                    requireName='union' autoSelectFirst={false}
                                    value={data.relationToPH}
                                    onChange={(value) => { relationChange(data, index, value) }} />
                            );
                        }} />
                        <Column noI18n title='InsuredName' dataIndex='RiskName' width="150px" render={(data, index) => {
                            return (
                                <Input value={data.firstName}
                                    onChange={(value) => changeInsurePersonValue(value, index, 'firstName')} />
                            );
                        }} />
                        <Column noI18n title='Certificate Type' dataIndex='certiType' width="150px" render={(data, index) => {
                            return (
                                <Select io='in' codeTable={idTypeCodetables}
                                    value={data.certiType}
                                    onChange={(value) => changeInsurePersonValue(value, index, 'certiType')} />
                            );
                        }} />
                        <Column noI18n title='ID Number' dataIndex='certiCode' width="150px" render={(data, index) => {
                            return (
                                <Input value={data.certiCode}
                                    onChange={(value) => changeInsurePersonValue(value, index, 'certiCode')} />
                            );
                        }} />
                        <Column noI18n title='Date Of Birth' dataIndex='birthdate' render={(data, index) => {
                            return (
                                <DatePicker timeFormat="YYYY-MM-DDTHH:mm:ss"
                                    value={data.birthdate}
                                    onChange={(value) => changeInsurePersonValue(
                                        DateUtil.formatToSubmitFormater(value), index, 'birthdate')} />
                            );
                        }} />
                        <Column noI18n title='MobilePhone' dataIndex='Mobile' width="150px" render={(data, index) => {
                            return (
                                <Input value={data.mobileTel}
                                    onChange={(value) => changeInsurePersonValue(value, index, 'mobileTel')} />
                            );
                        }} />
                    </Table>
                </Card>
            </Card.Group>
            <Box mode="footer">
                <Space direction="right" className='policyFooter' style={{ justifyContent: 'flex-end' }}>
                    <Input io="out" label="DuePremium" layout='horizontal' value={premium} style={{ maxWidth: '200px' }} />
                    <Button value="Calculate" requireName='union' className='btn' causeValidation='true' onClick={(e, pass) => pass && calculate()} />
                    <Button value="Next" disabled={!calculateFlag} className={calculateFlag ? 'btn' : 'no-calc-btn'} causeValidation='true' onClick={() => { next() }} />
                    <Button value="Back" className='btn' onClick={() => navigate('/lifeCoverage')} />
                </Space>
            </Box>
            <Dialog id='confirmBuy' title='Confirm' message='differentPremium' onConfirm='' visible={confirmBuyDialog} />
        </>
    );
}

export default LifePolicyInfo;
