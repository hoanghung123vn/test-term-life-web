import { useNavigate } from 'react-router-dom';
import { Button } from '@ebaoui/rainbowui-sugar-etmoui';
import bgIcon from '../../../../images/Life_bg_home.jpg';

const LifeIndex = () => {
    const navigate = useNavigate();

    return (
        <div className='travelPage homePage'>
            <div className='lifeHead'>
                <div className='lifeHead_box'>
                    <div className=''>
                        <img src={bgIcon} />
                    </div>

                    <div className='travel_head_content'>
                        <div className='lifeTitle' style={{ fontSize: '40px' }}>Term Life Product</div>
                        {/*<span className='travelTitle_sub'>{i18n.Covid}</span>*/}
                        {/*<div className='travelInfo'>{i18n.TravelIntroduce}</div>*/}
                        <div className='travelInfo' style={{ color: '#ffffff' }}>Regular Premium Term Product (6 years & above) with Death & TPD benefit.</div>
                        <div className='getQuoteBtn_box' direction='center'>
                            <div className='welcome' style={{ color: '#ffffff' }}>{i18n.Welcome}</div>
                            <Button value='GetQuote' className='getQuoteBtn' suffixIcon='rainbow DoubleArrowRight16-1' onClick={() => { navigate('/lifeCoverage') }} />
                        </div>
                    </div>
                </div>

            </div>
            <div className='lifeContent'>
                {/* <UIBox direction='left'> */}
                <div className="split_line" />
                <div className='travelItem'>
                    <span className="rainbow AccidentalInjurie"></span>
                    <div className="title">Total Payment Disability</div>
                </div>
                <div className="split_line" />
                <div className='travelItem'>
                    <span className="rainbow DiedOrDisabled"></span>
                    <div className="title">Death</div>
                </div>
                <div className="split_line" />

                {/* </UIBox> */}
            </div>
        </div>
    );
}

export default LifeIndex;
