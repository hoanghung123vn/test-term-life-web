import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import bgIcon from '../../../images/Life_bg_other.png';
import { Table, Column, Input, Box, Button, Space, Card, Number, DatePicker } from '@ebaoui/rainbowui-sugar-etmoui';
import { UrlUtil } from '@ebaoui/rainbowui-sugar-tools';


const LifePoliciesTable = () => {


    const [policyDataSource, setPolicyDataSource] = useState<any>([])
    const queryPolicy = async () => {
        AjaxUtil.show();
        const url = UrlUtil.getConfigUrl('UI_API_GATEWAY_PROXY', 'EXTERNALBFF', 'LIFE_POLICY_SEARCH');
        const result = await AjaxUtil.call(url,
            {
                'criteria': {
                    'page': 0,
                    'size': 1000
                }
            }, { 'method': 'POST' });
        AjaxUtil.hide();
        setPolicyDataSource(result.policySummaryInfos)
    }


    useEffect(() => {
        queryPolicy()
    }, []);

    return (
        <>
            <div className='top_box'>
                <Table dataSource={policyDataSource} idField='policyNumber'>
                    <Column noI18n title="Policy No" dataIndex="policyNumber" />
                    <Column noI18n title="Policy Holder Name" dataIndex="policyHolderName"/>
                    <Column noI18n title="Main Insured Name" dataIndex="mainInsuredName"/>
                    <Column noI18n title="Product" dataIndex="masterProductCode"/>
                    <Column noI18n title="Apply Date" dataIndex="applyDate"
                        render={data => <DatePicker noI18n
                            format='YYYY-MM-DD'
                            saveFormat='YYYY-MM-DD'
                            value={data.applyDate}
                            io='out'/>}/>
                    <Column noI18n title="Inception Date" dataIndex="inceptionDate"
                        render={data => <DatePicker noI18n
                            format='YYYY-MM-DD'
                            saveFormat='YYYY-MM-DD'
                            value={data.inceptionDate}
                            io='out'/>}/>
                    <Column noI18n title="Expiry Date" dataIndex="expiryDate"
                        render={data => <DatePicker noI18n
                            format='YYYY-MM-DD'
                            saveFormat='YYYY-MM-DD'
                            value={data.expiryDate}
                            io='out'/>}/>
                    <Column noI18n title="Install Premium" dataIndex="installPrem"/>
                    <Column title='Action' render={(record, row) => {
                        return (
                            <Space>
                            </Space>
                        )
                    }}/>
                </Table>
            </div>
        </>
    );
}

export default LifePoliciesTable;
