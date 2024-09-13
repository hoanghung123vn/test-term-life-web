import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Column, Input, Box, Button, Space, Card, Number } from '@ebaoui/rainbowui-sugar-etmoui';


const LifePolicyDetail = () => {
    const navigate = useNavigate();
    const [lifePolicy, setLifePolicy] = useState({});
    const [policy, setPolicy] = useState({});
    const [sa, setSa] = useState(100000);

    const queryPolicy = async () => {
        const i = 9;
    }

    useEffect(() => {
        const j = 10;
    }, []);

    return (
        <>
            <div className='top_box'>
            </div>
        </>
    );
}

export default LifePolicyDetail;
