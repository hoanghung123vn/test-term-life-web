import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Table, Column, Input, Box, Button, Space, Select, Card } from '@ebaoui/rainbowui-sugar-etmoui';

import bgIcon from '@/images/Travel_bg_other.png';

const Coverage = () => {
    // const dispatch = useDispatch();
    const navigate = useNavigate();

    const [policy, setPolicy] = useState({});

    //prepare local state for displaying coverage table
    const [displayCoverageList, setDisplayCoverageList] = useState([]);
    const optionC30001 = [{ id: 100000, text: '100000' }, { id: 200000, text: '200000' }];
    const optionC30002 = [{ id: 200000, text: '200000' }, { id: 350000, text: '350000' }];
    const [sumInsured1, setSumInsured1] = useState(optionC30001[0].id);
    const [sumInsured2, setSumInsured2] = useState(optionC30002[0].id);


    useEffect(() => {
        import('./index.js').then((policyInfo) => {
            setPolicy(policyInfo.default);
            const allCoverageList = policyInfo?.default?.PolicyLobList[0].PolicyRiskList[0].PolicyCoverageList;
            const displayCt = [];
            allCoverageList.forEach(item => {
                const newItem = { ...item };
                if (newItem.ProductElementCode == 'C30001') {
                    newItem.sort = 1;
                    newItem.Text = 'Accidental Death and Permanent Disablement';
                    displayCt.push(newItem);
                    setSumInsured1(item.SumInsured);
                }
                if (newItem.ProductElementCode == 'C30002') {
                    newItem.sort = 2;
                    newItem.Text = 'Accident and Sickness injury medical treatment';
                    displayCt.push(newItem);
                    setSumInsured2(item.SumInsured);

                }
                if (newItem.ProductElementCode == 'C30003') {
                    newItem.sort = 3;
                    newItem.Text = 'Accident and Sickness Hospital Benefit';
                    newItem.Value = '200 per day(max 10000)';
                    displayCt.push(newItem);
                }
                if (newItem.ProductElementCode == 'C30004') {
                    newItem.sort = 4;
                    newItem.Text = 'Personal Money';
                    newItem.Value = '250';
                    displayCt.push(newItem);
                }
                if (newItem.ProductElementCode == 'C30005') {
                    newItem.sort = 5;
                    newItem.Text = 'Loss of Travel Documents and Passport';
                    newItem.Value = '1500';
                    displayCt.push(newItem);
                }
                if (newItem.ProductElementCode == 'C30006') {
                    newItem.sort = 6;
                    newItem.Text = 'Flight Delay (every 6 hours delay)';
                    newItem.Value = '150(max 500)';
                    displayCt.push(newItem);
                }
            });
            setDisplayCoverageList(displayCt);
        })
    }, [])


    const nextPage = () => {
        //make a copy
        const newPolicy = JSON.parse(JSON.stringify(policy));
        const coverageList = newPolicy.PolicyLobList[0].PolicyRiskList[0].PolicyCoverageList;
        coverageList.forEach(item => {
            delete item.Text;
            delete item.Value;
            if (item.ProductElementCode == 'C30001') {
                item.SumInsured = Number(sumInsured1);
            }
            if (item.ProductElementCode == 'C30002') {
                item.SumInsured = Number(sumInsured2);
            }
        });
        newPolicy.PolicyLobList[0].PolicyRiskList[0].PolicyCoverageList = coverageList;
        //store selected sumInsured to policy and save to redux store
        navigate('/policy', { state: { policy: newPolicy } });
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
                <Card title='Coverage' expand={true}>
                    <Table dataSource={displayCoverageList} id="Travel_coverageDataTable" pageable="false" indexable="false">
                        <Column title='CoverageName' dataIndex='Text'>
                            <Input io="out" />
                        </Column>
                        <Column title='SumInsured' dataIndex='SumInsured' render={(data) => {
                            if (data.ProductElementCode == 'C30001') {
                                return (<Select codeTable={optionC30001}
                                    value={sumInsured1}
                                    onChange={(value) => setSumInsured1(value)}
                                />);
                            } else if (data.ProductElementCode == 'C30002') {
                                return (<Select codeTable={optionC30002}
                                    value={sumInsured2}
                                    onChange={(value) => setSumInsured2(value)}
                                />);
                            }
                            return (<Input value={data.Value} io="out" />);

                        }} />
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

export default Coverage;