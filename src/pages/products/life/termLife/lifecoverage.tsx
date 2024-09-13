import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import bgIcon from '../../../../images/Life_bg_other.png';
import { Table, Column, Input, Box, Button, Space, Card, Number } from '@ebaoui/rainbowui-sugar-etmoui';


const LifeCoverage = () => {
    const navigate = useNavigate();
    const [lifePolicy, setLifePolicy] = useState({});
    const [policy, setPolicy] = useState({});
    const [sa, setSa] = useState(100000);


    const displayCoverageList = [
        {
            id: 1,
            name: 'Coverage Term',
            detail: '40 Years'
        },
        {
            id: 2,
            name: 'Charge Period',
            detail: '40 Years'
        },
        {
            id: 3,
            name: 'Premium Frequency',
            detail: 'Yearly'
        },
        {
            id: 4,
            name: 'Sum Assured',
            detail: '100000'
        }
    ];

    useEffect(() => {
        import('./index.json').then((policyInfo) => {
            setLifePolicy(policyInfo.default);
            setSa(policyInfo.policy.coverages[0].currentPremium.sumAssured);
        })
    }, []);


    const nextPage = () => {
        //make a copy
        // const newPolicy = JSON.parse(JSON.stringify(lifePolicy));
        // const coverageList = newPolicy.PolicyLobList[0].PolicyRiskList[0].PolicyCoverageList;
        // newPolicy.PolicyLobList[0].PolicyRiskList[0].PolicyCoverageList = coverageList;
        //store selected sumInsured to policy and save to redux store
        // dispatch(setPolicy(newPolicy));
        const newPolicy = JSON.parse(JSON.stringify(lifePolicy)).policy;
        newPolicy.coverages[0].currentPremium.sumAssured = sa;
        let tenantCode;
        if (sessionStorage.getItem('x-mo-response-tenant-id')) {
            tenantCode = sessionStorage.getItem('x-mo-response-tenant-id');
        }
        if (!tenantCode) {
            tenantCode = 'chaos';
        }
        newPolicy.quotationCode = tenantCode.toUpperCase() + '01Q';
        newPolicy.serviceAgentCode = tenantCode.toUpperCase() + '-CHL';
        newPolicy.salesChannelCode = tenantCode.toUpperCase() + '-CHL';
        newPolicy.insurerCode = tenantCode;
        const newLifePolicy = { ...lifePolicy, policy: newPolicy }
        setLifePolicy(newLifePolicy);
        navigate('/lifePolicyInfo', { state: { lifePolicy: newLifePolicy } });
    }
    return (
        <>
            <div className='top_box'>
                {/* <img src={bgIcon} className='topHeadImg' style={{ width: '100vw' }} /> */}
                <div className='top_box_content'>
                    <div className='travelTitle'>Term Life Product</div>
                    <span className='travelTitle_sub'>Term Life</span>
                </div>
            </div>
            <Card.Group>
                <Card title='Coverage' expand={true}>
                    <Table dataSource={displayCoverageList} id="Travel_coverageDataTable" pageable="false" indexable="false">
                        <Column noI18n title='Item' dataIndex='name' width={'50%'}>
                            <Input io="out" />
                        </Column>
                        <Column noI18n title='Value' dataIndex='detail' width={'50%'} render={data => data.id === 4 ?
                            <Number type="integer" value={sa} onChange={value => setSa(value)} /> : <div>{data.detail}</div>
                        } />
                    </Table>
                </Card>
            </Card.Group >
            <Box mode="footer">
                <Space className='policyFooter' style={{ justifyContent: 'flex-end' }}>
                    <Button value="Next" className='btn' onClick={nextPage} />
                </Space>
            </Box>
        </>
    );
}

export default LifeCoverage;
