import React, { useEffect, useState } from 'react';
import { UrlUtil } from '@ebaoui/rainbowui-sugar-tools';
import './style/productDetail.css';
import { Button, Card, Collapse } from '@ebaoui/rainbowui-sugar-etmoui';
import { AGE_UNIT, chargePeriodDis } from './const';
import {categorizeConsecutiveNumbers, FilterMapping, findArrByKey} from './utils';
import { useNavigate } from 'react-router-dom';
const { Panel } = Collapse;

const ProductDetail = () => {
    const win: any = window;
    const navigate = useNavigate();
    const [productCode, setProductCode] = useState('')
    const [product, setProduct] = useState<any>({})
    const [productAgeLimit, setProductAgeLimit] = useState<any>({})
    const [coverageTermData, setCoverageTermData] = useState<Map<any, any>>(new Map());
    const [chargePeriodData, setChargePeriodData] = useState<Map<any, any>>(new Map());
    const [liabs, setLiabs] = useState<any[]>([])

    const handleMapData = (mapObject) => {
        mapObject.forEach(function (value, key) {
            mapObject.set(key, categorizeConsecutiveNumbers(value))
        })
        return mapObject;
    }

    const handleDataBySameField = (arr: [], field: string, valueField: string, valueField2?: string, keyArr?: FilterMapping[], keyArr2?: FilterMapping[]) => {
        // premSequen
        const obj = new Map();
        for (const item of arr) {
            if (obj.get(item[`${field}`]) !== undefined) {
                let fieldArr = obj.get(item[`${field}`]);
                fieldArr.push(valueField2 ? findArrByKey(keyArr, item[`${valueField}`])?.name + '-' + findArrByKey(keyArr2, item[`${valueField2}`])?.name : item[`${valueField}`])
                if (['coveragePeriod', 'chargePeriod'].includes(field)) {
                    fieldArr = Array.from(new Set(fieldArr))
                }
                obj.set(item[`${field}`], fieldArr)
            } else {
                obj.set(item[`${field}`], [valueField2 ? findArrByKey(keyArr, item[`${valueField}`])?.name + '-' + findArrByKey(keyArr2, item[`${valueField2}`])?.name : item[`${valueField}`]])
            }
        }
        return obj;
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
        setProduct(result)
        setLiabs(result.liabInfos)
        setCoverageTermData(handleMapData(handleDataBySameField(result.product.lifeBasics, 'coveragePeriod', 'coverageYear')))
        setChargePeriodData(handleMapData(handleDataBySameField(result.product.lifeBasics, 'chargePeriod', 'chargeYear')))
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
        setProductAgeLimit(result)
    };

    const jumpToProposal = () => {
        navigate(`/lifeCycle?productCode=${productCode}`)
    }

    useEffect(() => {
        const uri = UrlUtil.parseURL(window.location.href);
        if (uri.params.productCode) {
            setProductCode(uri.params.productCode)
            queryProductDetail(uri.params.productCode);
            queryProductAgeLimit(uri.params.productCode);
        }
    }, []);

    return (
        <>
            {/*<div className="banner">*/}
            {/*    <div className="banner_content">Product Detail</div>*/}
            {/*</div>*/}
            <div className="page-content    ">
                <div className="content-product-title">
                    <div>{'Product Name: '} {product?.product?.productName}</div>
                </div>
                <Card.Group>
                    <Collapse defaultActiveId={['1']}>
                        <Panel header="Insurance Conditions" id="1">
                            <div>
                                {'Age: '} {productAgeLimit?.productAge?.insuredAge[0]?.minAge}{AGE_UNIT[productAgeLimit?.productAge?.insuredAge[0]?.minAgeUnit]}-{productAgeLimit?.productAge?.insuredAge[0]?.maxAge}{AGE_UNIT[productAgeLimit?.productAge?.insuredAge[0]?.maxAgeUnit]}
                            </div>
                            <div>
                                {'Charge Period: '}
                                {Array.from(chargePeriodData, ([key, value]) => (
                                    <span key={key}>
                                        {key == '1' || key == '4' ? '' : value.join(',')} {findArrByKey(chargePeriodDis, key).name} ;
                                    </span>
                                ))}

                            </div>
                            <div>
                                {'Coverage Period: '}
                                {Array.from(coverageTermData, ([key, value]) => (
                                    // console.log(item)
                                    <span key={key}>
                                        {key == '1' ? '' : value.join(',')} {findArrByKey(chargePeriodDis, key).name} ;
                                    </span>
                                ))}
                            </div>
                        </Panel>
                        <Panel header="Liability" id="2">
                            <div>
                                {liabs.map((liab, index) => <div key={liab.liabilityId}>{index+1} {'. '}{liab.liabilityName}</div>)}
                            </div>
                        </Panel>
                    </Collapse>
                </Card.Group>
            </div>
            {/*<div className="footer">*/}
            {/*    <Button noI18n value="Proposal" type="primary" onClick={() => {jumpToProposal()}}/>*/}
            {/*</div>*/}
        </>
    );
};

export default ProductDetail;
