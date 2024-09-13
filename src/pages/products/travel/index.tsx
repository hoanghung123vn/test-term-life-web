import { useNavigate } from 'react-router-dom';
import { Button } from '@ebaoui/rainbowui-sugar-etmoui';
import bgIcon from '@/images/Travel_bg_home.jpg'; // @ is alias of src
import React from 'react';

const Index = () => {
    const navigate = useNavigate();

    return (
        <div className='travelPage homePage'>
            <div className='travelHead'>
                <div className='travelHead_box'>
                    <div className='travelHeadImg'>
                        <img src={bgIcon} />
                    </div>

                    <div className='travel_head_content'>
                        <div className='travelTitle'>{i18n.GlobalTitle}</div>
                        <span className='travelTitle_sub'>{i18n.Covid}</span>
                        <div className='travelInfo'>{i18n.TravelIntroduce}</div>
                        <div className='getQuoteBtn_box'>
                            {/* <div className='welcome'>{i18n.Welcome}</div> */}
                            <Button value='GetQuote' className='getQuoteBtn' onClick={() => { navigate('/coverage') }} />
                        </div>
                    </div>
                </div>

            </div>
            <div className='travelContent'>
                {/* <UIBox direction='left'> */}
                <div className='travelItem'>
                    <span className="rainbow AccidentalInjurie"></span>
                    <div className="title">Accident Medical Treatment</div>
                </div>
                <div className="split_line" />
                <div className='travelItem'>
                    <span className="rainbow DiedOrDisabled"></span>
                    <div className="title">Hospital Benefit</div>
                </div>
                <div className="split_line" />
                <div className='travelItem'>
                    <span className="rainbow PropertyLoss"></span>
                    <div className="title">Lost Personal Money</div>
                </div>
                <div className="split_line" />
                <div className='travelItem'>
                    <span className="rainbow FlightDelay"></span>
                    <div className="title">Flight Delay</div>
                </div>
                <div className="split_line" />
                <div className='travelItem'>
                    <span className="rainbow IntelligentHelp"></span>
                    <div className="title">24-hrs Hotline Assistance Services</div>
                </div>
                {/* </UIBox> */}
            </div>
            <div className='travelContent_bg'></div>
        </div>
    );
}

export default Index;