import React, { useEffect, useState } from 'react';
import { UrlUtil } from '@ebaoui/rainbowui-sugar-tools';
import {
    Button,
    Card,
    Collapse,
    DatePicker,
    Grid,
    Input,
    Select,
    Steps,
    TextArea,
    Number,
    Switch, Email
} from '@ebaoui/rainbowui-sugar-etmoui';
import {AGE_UNIT, chargePeriod, chargePeriodDis, coveragePeriod, idType, paymentFreq} from './const';
import { categorizeConsecutiveNumbers, findArrByKey } from './utils';
const { Panel } = Collapse;
import './style/lifeCycle.css'
import ProductDetail from '@/pages/products/life/termLife/productDetail';

const LifeCycle = () => {
    const { Step } = Steps;
    const [stepIndex, setStepIndex] = useState(0)
    const [payMethod, setPayMethod] = useState('WeChat');
    const [productCode, setProductCode] = useState('')
    const [mainInsuredData, setMainInsuredData] = useState<any>({})
    const [policyHolderData, setPolicyHolderData] = useState<any>({})
    const [mainBenefitData, setMainBenefitData] = useState<any>({coverageYear: 1, coveragePeriod: '2'})
    const [proposalRequest, setProposalRequest] = useState<any>({})
    const [installPremium, setInstallPremium] = useState()
    const [prodPremiumFreq, setProdPremiumFreq] = useState<any[]>([])
    const [prodChargePeriod, setProdChargePeriod] = useState<any[]>([])
    const [prodCoveragePeriod, setProdCoveragePeriod] = useState<any[]>([])
    const [proposalNumber, setProposalNumber] = useState()
    const [policyNumber, setPolicyNumber] = useState()

    const relaWithPhDatasource = [
        { id: 1, text: 'Self' }
    ]

    const genderDataSource = [
        { id: 'F', text: 'Female' },
        { id: 'M', text: 'Male' },
        { id: 'N', text: 'Unknown' }
    ]

    const onMainInsuredInfoChange = (label, value) => {
        if (mainInsuredData.relation === 1 || label == 'relation' && value === '1') {
            // setPolicyHolderData({ name: mainInsuredData.name, birthDate: mainInsuredData.birthDate, gender: mainInsuredData.gender })
            setPolicyHolderData(prevState => ({
                ...prevState,
                [label]: value
            }))
        } else if (mainInsuredData.relation === 1 || label === 'relation' && value === '7') {
            setPolicyHolderData({})
        }
        setMainInsuredData(prevState => ({
            ...prevState,
            [label]: value
        }))
    }

    const onPolicyHolderChange = (label, value) => {
        setPolicyHolderData(prevState => ({
            ...prevState,
            [label]: value
        }))
    }

    const onMainBenefitChange = (label, value) => {
        setMainBenefitData(prevState => ({
            ...prevState,

            [label]: value
        }))
    }

    useEffect(() => {
        if (mainBenefitData.chargePeriod === '1') {
            setMainBenefitData(prevState => ({
                ...prevState,
                paymentFreq: '5',
                chargeYear: 0
            }))
        }
    }, [mainBenefitData.chargePeriod]);

    useEffect(() => {
        if (mainBenefitData.paymentFreq === '5') {
            setMainBenefitData(prevState => ({
                ...prevState,
                chargePeriod: '1',
                chargeYear: 0
            }))
        }
    }, [mainBenefitData.paymentFreq]);


    const premium = async () => {
        const customers: any = [];
        let partySerialId = 1;
        customers.push({
            partySerialId: partySerialId,
            person: {
                gender: mainInsuredData.gender,
                birthdate: mainInsuredData.birthDate
            }
        })
        if (mainInsuredData.relation != 1) {
            customers.push({
                partySerialId: ++partySerialId,
                person: {
                    gender: policyHolderData.gender,
                    birthdate: policyHolderData.birthDate
                }
            })
        }

        const coverages: any = [];
        coverages.push({

            'coverageSerialId': 1,
            'chargePeriod': mainBenefitData.chargePeriod,
            'chargeYear': mainBenefitData.chargeYear,
            'coveragePeriod': mainBenefitData.coveragePeriod,
            'coverageYear': mainBenefitData.coverageYear,
            'productCode': '1YearRenewabTerm',
            'currentPremium': {
                'paymentFreq': mainBenefitData.paymentFreq,
                'sumAssured': mainBenefitData.sumAssured
            },
            'insureds': [
                {
                    'partySerialId': 1
                }
            ]

        })

        const request = {
            policy: {
                applyDate: '2023-06-17T11:19:42.286+0800',
                currency: 4,
                quotationCode: 'XXXXXXXX',
                inceptionDate: mainBenefitData.startDate,
                customers,
                coverages
            }
        }
        setProposalRequest(request)
        AjaxUtil.show();
        const url = UrlUtil.getConfigUrl(
            'UI_API_GATEWAY_PROXY',
            'EXTERNALBFF',
            'LIFE_PROPOSAL_CALCULATE'
        );
        const result = await AjaxUtil.call(url, request, {
            method: 'POST'
        });
        AjaxUtil.hide();
        if (result.policy && result.result != -1) {
            setInstallPremium(result.policy.installPrem)
        }
    }

    const application = async() => {

        let partySerialId = 1;

        const customers: any[] = []

        customers.push({
            partySerialId,
            partyType: 1,
            person: {
                gender: policyHolderData.gender,
                birthdate: policyHolderData.birthDate,
                certiType: policyHolderData.certiType,
                certiCode: policyHolderData.certiCode,
                firstName: policyHolderData.name,
                lastName: policyHolderData.name,
                preferredLifeIndi: '0',
                smoking: policyHolderData.smoking,
                height: policyHolderData.height,
                weight: policyHolderData.weight
            },
            partyContact: {
                mobileTel: policyHolderData.mobileTel,
                email: policyHolderData.email
            },
            address: {
                address1: policyHolderData.address1,
                address2: policyHolderData.address2,
                address3: policyHolderData.address3,
                postCode: policyHolderData.postCode
            }
        })
        if (mainInsuredData.relation === '7') {
            customers.push({
                partySerialId: ++partySerialId,
                partyType: 1,
                person: {
                    gender: mainInsuredData.gender,
                    birthdate: mainInsuredData.birthDate,
                    certiType: mainInsuredData.certiType,
                    certiCode: mainInsuredData.certiCode,
                    firstName: mainInsuredData.name,
                    lastName: mainInsuredData.name,
                    preferredLifeIndi: '0',
                    smoking: mainInsuredData.smoking,
                    height: mainInsuredData.height,
                    weight: mainInsuredData.weight
                },
                partyContact: {
                    mobileTel: mainInsuredData.mobileTel,
                    email: mainInsuredData.email
                },
                address: {
                    address1: mainInsuredData.address1,
                    address2: mainInsuredData.address2,
                    address3: mainInsuredData.address3,
                    postCode: mainInsuredData.postCode
                }
            })
        }
        onMainInsuredInfoChange('gender', policyHolderData.gender)
        onMainInsuredInfoChange('birthDate', policyHolderData.birthDate)
        onMainInsuredInfoChange('certiType', policyHolderData.certiType)
        onMainInsuredInfoChange('certiCode', policyHolderData.certiCode)
        onMainInsuredInfoChange('gender', policyHolderData.gender)
        onMainInsuredInfoChange('mobileTel', policyHolderData.mobileTel)
        onMainInsuredInfoChange('email', policyHolderData.email)

        const policy = {...proposalRequest.policy, 'policyHolder': {
            'partySerialId': 1
        },
        'insureds': [
            {
                'partySerialId': 1,
                'relationToPH': 1
            }
        ],
        'payers': [
            {
                'partySerialId': 1,
                'relationToPH': 1
            }
        ],
        'payerAccounts': [
            {
                'paymentMethod': 1,
                'paymentMethodNext': 1
            }
        ],
        customers}

        const request = {policy}
        AjaxUtil.show();
        const url = UrlUtil.getConfigUrl(
            'UI_API_GATEWAY_PROXY',
            'EXTERNALBFF',
            'LIFE_APPLICATION'
        );
        const result = await AjaxUtil.call(url, request, {
            method: 'POST'
        });
        AjaxUtil.hide();

        setProposalNumber(result.policy.proposalNumber)
        setInstallPremium(result.policy.installPrem)
    }

    const issurance = async () => {
        const request = {
            'policy': {
                'proposalNumber': proposalNumber,
                'payerAccount': {
                    'paymentMethod': 1
                }
            },
            'collection': {
                'collectionDate': mainBenefitData.startDate,
                'feeAmount': installPremium,
                'payMode': 1,
                'currency': proposalRequest.policy.currency
            }
        }

        AjaxUtil.show();
        const url = UrlUtil.getConfigUrl(
            'UI_API_GATEWAY_PROXY',
            'EXTERNALBFF',
            'LIFE_ISSURANCE'
        );
        const result = await AjaxUtil.call(url, request, {
            method: 'POST'
        });
        AjaxUtil.hide();
        setPolicyNumber(result.policy.policyNumber)
    }

    const onBack = () => {
        if (stepIndex != 0 && stepIndex != 4) {
            setStepIndex(stepIndex-1)
        }
    }

    const onNext = () => {
        switch (stepIndex) {
        case 0:
            setStepIndex(stepIndex + 1)
            break;
        case 1:
            premium()
            setStepIndex(stepIndex + 1)
            break;
        case 2:
            setStepIndex(stepIndex + 1)
            break;
        case 3:
            application()
            setStepIndex(stepIndex + 1)
            break;
        case 4:
            issurance()
            setStepIndex(stepIndex + 1)
            break;
        case 5:

            setStepIndex(stepIndex + 1)
            break;
        default:
            break;
        }
    }

    const queryProductDetail = async (productCode) => {
        AjaxUtil.show();
        const url = UrlUtil.getConfigUrl(
            'UI_API_GATEWAY_PROXY',
            'EXTERNALBFF',
            'LIFE_PD_PRODUCT_DETAIL'
        );
        const result = await AjaxUtil.call(url + productCode, null, {
            method: 'GET'
        });
        AjaxUtil.hide();
        setProdPremiumFreq(result.premiumFrequencys)
        const uniqueChargePeriod = new Set();
        const uniqueCoveragePeriod = new Set();
        for (const item of result.product.lifeBasics) {
            uniqueChargePeriod.add(item.chargePeriod)
            uniqueCoveragePeriod.add(item.coveragePeriod)
        }
        setProdCoveragePeriod(Array.from(uniqueCoveragePeriod))
        setProdChargePeriod(Array.from(uniqueChargePeriod))
    };

    const queryProductAgeLimit = async (productCode) => {
        AjaxUtil.show();
        const url = UrlUtil.getConfigUrl(
            'UI_API_GATEWAY_PROXY',
            'EXTERNALBFF',
            'LIFE_PD_PRODUCT_AGE_LIMIT'
        );
        const result = await AjaxUtil.call(
            url,
            { productCode: productCode },
            { method: 'POST' }
        );
        AjaxUtil.hide();
    };

    const filterCodetable = (codetable, filterList) => {
        return codetable.filter(item => filterList.includes(item.id));
    }

    useEffect(() => {
        const uri = UrlUtil.parseURL(window.location.href);
        if (uri.params.productCode) {
            setProductCode(uri.params.productCode)
            queryProductDetail(uri.params.productCode);
            queryProductAgeLimit(uri.params.productCode);
        }
        onMainBenefitChange('startDate', new Date().toISOString())

    }, [])


    return (
        <>
            {/*<div className='banner'>*/}
            {/*    <div className="banner_content">Proposal</div>*/}
            {/*</div>*/}
            <div className='page-content'>
                <div className='content_step'>
                    <Steps current={stepIndex}>
                        <Step
                            title="Product Detail"
                            index={0}
                        />
                        <Step title="Quota Premium" index={1} />
                        <Step title="Entry Order Info" index={2} />
                        <Step title="Submit Order" index={3} />
                        <Step title="Pay Order" index={4} />
                        <Step title="Order Auto Confirm" index={4} />
                    </Steps>
                </div>
                {proposalNumber && stepIndex != 5 && <div className='policy_number'>
                    <span>{'Proposal Number: '}</span>
                    <span>{proposalNumber}</span>
                </div>}

                {policyNumber && <div className='policy_number'>
                    <span>{'Policy Number: '}</span>
                    <span>{policyNumber}</span>
                </div>}
                {
                    stepIndex === 0 && <ProductDetail/>
                }
                {
                    stepIndex === 1 && <div>
                        <Card title='Notice' noI18n expand={true}>
                            <div className='life-notice'>
                                <ul>
                                    <li>Please pay attention to the "birthdate" of the insured, as the age of the insured should be between 18 and 55 according to the product's age limit.</li>
                                    <li>When choosing "certain months" for the charging period, please pay attention to the charging year, as the allowed periods should be 4, 9, or 12 months according to the product's term limitations and please choose "monthly" in payment frequence.</li>
                                    <li>Please pay attention to the sum assured, as its value should be greater than 10,000 according to the product's sum assured limit.</li>
                                </ul>
                            </div>
                        </Card>
                        <Card title='Insured Info' noI18n>
                            <Grid cols={3}>
                                <Select label='Relation with Policyholder' noI18n codeTable={relaWithPhDatasource} value={mainInsuredData.relation} onChange={(value) => onMainInsuredInfoChange('relation', value)} />
                                <Input label='Name' noI18n value={mainInsuredData.name} onChange={(value) => onMainInsuredInfoChange('name', value)} />
                                <DatePicker format="YYYY-MM-DD" saveFormat="YYYY-MM-DD" label='Birth Date' noI18n value={mainInsuredData.birthDate} onChange={(value) => onMainInsuredInfoChange('birthDate', value)} />
                                <Select label='Gender' noI18n codeTable={genderDataSource} value={mainInsuredData.gender} onChange={(value) => onMainInsuredInfoChange('gender', value)} />
                            </Grid>
                        </Card>
                        <Card title='Policyholder Info' noI18n>
                            <Grid cols={3}>
                                <Input label='Name' noI18n disabled={mainInsuredData.relation === 1} value={policyHolderData.name} onChange={(value) => onPolicyHolderChange('name', value)} />
                                <DatePicker label='Birth Date' format="YYYY-MM-DD" saveFormat="YYYY-MM-DD" noI18n disabled={mainInsuredData.relation === 1} value={policyHolderData.birthDate} onChange={(value) => onPolicyHolderChange('birthDate', value)} />
                                <Select label='Gender' noI18n disabled={mainInsuredData.relation === 1} value={policyHolderData.gender} codeTable={genderDataSource} onChange={(value) => onPolicyHolderChange('gender', value)} />
                            </Grid>
                        </Card>

                        <Card title='Main Benefit' noI18n>
                            <Grid cols={3}>
                                <DatePicker label='Start Date' disabled format="YYYY-MM-DD" saveFormat="YYYY-MM-DD" noI18n value={mainBenefitData.startDate} onChange={(value) => onMainBenefitChange('startDate', value)} />
                                <Select label='Charge Period' codeTable={filterCodetable(chargePeriod, prodChargePeriod)} noI18n value={mainBenefitData.chargePeriod} onChange={(value) => onMainBenefitChange('chargePeriod', value)} />
                                <Number label='Charge Year' disabled={mainBenefitData.chargePeriod === '1'} noI18n value={mainBenefitData.chargeYear} onChange={(value) => onMainBenefitChange('chargeYear', value)} />
                                <Select label='Coverage Period' disabled codeTable={filterCodetable(coveragePeriod, prodCoveragePeriod)} noI18n value={mainBenefitData.coveragePeriod} onChange={(value) => onMainBenefitChange('coveragePeriod', value)} />
                                <Number label='Coverage Year' disabled noI18n value={mainBenefitData.coverageYear} onChange={(value) => onMainBenefitChange('coverageYear', value)} />
                                <Select label='Payment Frequency' codeTable={filterCodetable(paymentFreq, prodPremiumFreq)} noI18n value={mainBenefitData.paymentFreq} onChange={(value) => onMainBenefitChange('paymentFreq', value)} />
                                <Number label='Sum Assured' noI18n value={mainBenefitData.sumAssured} onChange={(value) => onMainBenefitChange('sumAssured', value)} />
                            </Grid>
                        </Card>
                        <Card title="Premium" noI18n>
                            <div>
                                <Button value='Calculate' prevIcon="CalculateEngine" type='primary' title='title' noI18n onClick={() => premium()} />
                                {installPremium && <div>
                                    <span>{'Install Premium: '}</span>
                                    <span>{installPremium}</span>
                                </div>}
                            </div>

                        </Card>
                    </div>
                }
                {
                    stepIndex === 2 && <div>
                        <Card title='Notice' noI18n expand={true}>
                            <div className='life-notice'>
                                <ul>
                                    <li>Please input reasonable values for "height" and "weight." Please input a reasonable email address and postcode.</li>
                                </ul>
                            </div>
                        </Card>
                        <Card title='Insured Info' noI18n>
                            <Grid cols={3}>
                                <Input label='Name' noI18n value={policyHolderData.name} onChange={(value) => onPolicyHolderChange('name', value)} />
                                <DatePicker label='Birth Date' format="YYYY-MM-DD" saveFormat="YYYY-MM-DD" noI18n value={policyHolderData.birthDate} onChange={(value) => onPolicyHolderChange('birthDate', value)} />
                                <Select label='Gender' noI18n codeTable={genderDataSource} value={policyHolderData.gender} onChange={(value) => onPolicyHolderChange('gender', value)} />
                                <Input label='Height' noI18n value={policyHolderData.height} onChange={(value) => onPolicyHolderChange('height', value)} />
                                <Input label='Weight' noI18n value={policyHolderData.weight} onChange={(value) => onPolicyHolderChange('weight', value)} />
                                <Switch label='Smoke' noI18n value={policyHolderData.smoking} booleanValue={{TRUE: 'Y', FALSE: 'N'}} onChange={(value) => onPolicyHolderChange('smoking', value)} />
                                <Select label='ID Type' noI18n value={policyHolderData.certiType} codeTable={idType} onChange={(value) => onPolicyHolderChange('certiType', value)} />
                                <Input label='ID NO' noI18n value={policyHolderData.certiCode} onChange={(value) => onPolicyHolderChange('certiCode', value)} />
                                <Input label='Mobile No' allowChars="0123456789" noI18n value={policyHolderData.mobileTel} onChange={(value) => onPolicyHolderChange('mobileTel', value)} />
                                <Email label='Email' noI18n value={policyHolderData.email} onChange={(value) => onPolicyHolderChange('email', value)} />
                            </Grid>
                        </Card>
                        <Card title='Contact Address' noI18n>
                            <Grid cols={3}>
                                <Input label='State/Province' noI18n value={policyHolderData.address1} onChange={(value) => onPolicyHolderChange('address1', value)} />
                                <Input label='City/Town' noI18n value={policyHolderData.address2} onChange={(value) => onPolicyHolderChange('address2', value)} />
                                <Input label='Region/District' noI18n value={policyHolderData.address3} onChange={(value) => onPolicyHolderChange('address3', value)} />
                                {/* <TextArea label='Detail Address' noI18n value={policyHolderData.address3} onChange={(value) => onPolicyHolderChange('address3', value)}/> */}
                                <Number label='Post Code' noI18n value={policyHolderData.postCode} onChange={(value) => onPolicyHolderChange('postCode', value)} />
                            </Grid>
                        </Card>

                        {/*<Card title='Main Insured' noI18n>*/}
                        {/*    <Grid cols={3}>*/}
                        {/*        <Select label='Relation to Insured' codeTable={relaWithPhDatasource} noI18n value={mainInsuredData.relationToLA} onChange={(value) => onMainInsuredInfoChange('relationToLA', value)} />*/}
                        {/*        <Input label='Name' disabled={mainInsuredData.relationToLA === 1} noI18n value={mainInsuredData.name} onChange={(value) => onMainInsuredInfoChange('name', value)} />*/}
                        {/*    </Grid>*/}
                        {/*</Card>*/}
                    </div>
                }
                {
                    // display the input and premium
                    stepIndex === 3 && <div>
                        <Card title='Main Benefit' noI18n>
                            <Grid cols={3}>
                                <DatePicker label='Start Date' disabled format="YYYY-MM-DD" saveFormat="YYYY-MM-DD" noI18n value={mainBenefitData.startDate} onChange={(value) => onMainBenefitChange('startDate', value)} io={'out'}/>
                                <Select label='Charge Period' disabled codeTable={filterCodetable(chargePeriod, prodChargePeriod)} noI18n value={mainBenefitData.chargePeriod} onChange={(value) => onMainBenefitChange('chargePeriod', value)} io={'out'}/>
                                <Number innerStyle={{textAlign: 'left'}} label='Charge Year' disabled noI18n value={mainBenefitData.chargeYear} onChange={(value) => onMainBenefitChange('chargeYear', value)} io={'out'}/>
                                <Select label='Coverage Period' disabled codeTable={filterCodetable(coveragePeriod, prodCoveragePeriod)} noI18n value={mainBenefitData.coveragePeriod} onChange={(value) => onMainBenefitChange('coveragePeriod', value)} io={'out'}/>
                                <Number innerStyle={{textAlign: 'left'}} label='Coverage Year' disabled noI18n value={mainBenefitData.coverageYear} onChange={(value) => onMainBenefitChange('coverageYear', value)} io={'out'}/>
                                <Select label='Payment Frequency' disabled codeTable={filterCodetable(paymentFreq, prodPremiumFreq)} noI18n value={mainBenefitData.paymentFreq} onChange={(value) => onMainBenefitChange('paymentFreq', value)} io={'out'}/>
                                <Number innerStyle={{textAlign: 'left'}} label='Sum Assured' disabled noI18n value={mainBenefitData.sumAssured} onChange={(value) => onMainBenefitChange('sumAssured', value)} io={'out'}/>
                                <Number innerStyle={{textAlign: 'left'}} label='Install Premium' disabled noI18n value={installPremium} io={'out'}/>
                            </Grid>
                        </Card>
                        <Card title='Insured Info' noI18n>
                            <Grid cols={3}>
                                <Input label='Name' noI18n value={policyHolderData.name} onChange={(value) => onPolicyHolderChange('name', value)} io={'out'}/>
                                <DatePicker label='Birth Date' format="YYYY-MM-DD" saveFormat="YYYY-MM-DD" noI18n value={policyHolderData.birthDate} onChange={(value) => onPolicyHolderChange('birthDate', value)} io={'out'}/>
                                <Select label='Gender' noI18n codeTable={genderDataSource} value={policyHolderData.gender} onChange={(value) => onPolicyHolderChange('gender', value)} io={'out'}/>
                                <Input label='Height' noI18n value={policyHolderData.height} onChange={(value) => onPolicyHolderChange('height', value)} io={'out'}/>
                                <Input label='Weight' noI18n value={policyHolderData.weight} onChange={(value) => onPolicyHolderChange('weight', value)} io={'out'}/>
                                <Input label='ID Type' noI18n value={policyHolderData.certiType} onChange={(value) => onPolicyHolderChange('certiType', value)} io={'out'}/>
                                <Input label='ID NO' noI18n value={policyHolderData.certiCode} onChange={(value) => onPolicyHolderChange('certiCode', value)} io={'out'}/>
                                <Input label='Mobile No' allowChars="0123456789" noI18n value={policyHolderData.mobileTel} onChange={(value) => onPolicyHolderChange('mobileTel', value)} io={'out'}/>
                                <Email label='Email' noI18n value={policyHolderData.email} onChange={(value) => onPolicyHolderChange('email', value)} io={'out'}/>
                            </Grid>
                        </Card>
                        <Card title='Contact Address' noI18n>
                            <Grid cols={3}>
                                <Input label='State/Province' noI18n value={policyHolderData.address1} onChange={(value) => onPolicyHolderChange('address1', value)} io={'out'}/>
                                <Input label='City/Town' noI18n value={policyHolderData.address2} onChange={(value) => onPolicyHolderChange('address2', value)} io={'out'}/>
                                <Input label='Region/District' noI18n value={policyHolderData.address3} onChange={(value) => onPolicyHolderChange('address3', value)} io={'out'}/>
                                {/* <TextArea label='Detail Address' noI18n value={policyHolderData.address3} onChange={(value) => onPolicyHolderChange('address3', value)}/> */}
                                <Number innerStyle={{textAlign: 'left'}} label='Post Code' noI18n value={policyHolderData.postCode} onChange={(value) => onPolicyHolderChange('postCode', value)} io={'out'}/>
                            </Grid>
                        </Card>

                        {/*<Card title='Main Insured' noI18n>*/}
                        {/*    <Grid cols={3}>*/}
                        {/*        <Input label='Name' noI18n value={mainInsuredData.name} onChange={(value) => onPolicyHolderChange('name', value)} io={'out'}/>*/}
                        {/*        <DatePicker label='Birth Date' format="YYYY-MM-DD" saveFormat="YYYY-MM-DD" noI18n value={mainInsuredData.birthDate} onChange={(value) => onPolicyHolderChange('birthDate', value)} io={'out'}/>*/}
                        {/*        <Select label='Gender' noI18n codeTable={genderDataSource} value={mainInsuredData.gender} onChange={(value) => onPolicyHolderChange('gender', value)} io={'out'}/>*/}
                        {/*        <Input label='Height' noI18n value={mainInsuredData.height} onChange={(value) => onPolicyHolderChange('height', value)} io={'out'}/>*/}
                        {/*        <Input label='Weight' noI18n value={mainInsuredData.weight} onChange={(value) => onPolicyHolderChange('weight', value)} io={'out'}/>*/}
                        {/*        <Input label='ID Type' noI18n value={mainInsuredData.certiType} onChange={(value) => onPolicyHolderChange('certiType', value)} io={'out'}/>*/}
                        {/*        <Input label='ID NO' noI18n value={mainInsuredData.certiCode} onChange={(value) => onPolicyHolderChange('certiCode', value)} io={'out'}/>*/}
                        {/*        <Input label='Mobile No' noI18n value={mainInsuredData.mobileTel} onChange={(value) => onPolicyHolderChange('mobileTel', value)} io={'out'}/>*/}
                        {/*        <Input label='Email' noI18n value={mainInsuredData.email} onChange={(value) => onPolicyHolderChange('email', value)} io={'out'}/>*/}
                        {/*    </Grid>*/}
                        {/*</Card>*/}
                    </div>
                }
                {
                    // choose payment method

                    stepIndex === 4 && <div>
                        <Card title='Notice' noI18n expand={true}>
                            <div className='life-notice'>
                                <ul>
                                    <li>The payment in this step is simulated for the template app, NO REAL PAYMENT OCCURED HERE.</li>
                                </ul>
                            </div>
                        </Card>
                        <div className='pageContent payContent'>
                            <div className='payCurrencyInfo'>Need to pay</div>
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
                    </div>
                }
                {
                    //return the policy status
                    stepIndex === 5 && <div className='final_step_icon'>
                        <span className="rainbow Success success_icon">
                            <div className="title">Success</div>
                        </span>
                    </div>
                }
            </div>

            <div className='footer'>
                {stepIndex != 5 && <Button noI18n value="Back" type="primary" onClick={() => onBack()} style={{marginRight: '10px'}}/>}
                {stepIndex != 5 && <Button noI18n value="Next" type="primary" onClick={() => onNext()} />}
            </div>

        </>
    );
};

export default LifeCycle;
