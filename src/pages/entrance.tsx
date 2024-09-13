import React, {useEffect} from 'react'; import { useNavigate } from 'react-router-dom';

const Entrance = () => {
    const navigate = useNavigate();

    const jumpToWhere = (page) => {
        switch (page) {
        case 'travel':
            navigate('/travel');
            break;
        case 'life':
            navigate('/lifeCycle?productCode=1YearRenewabTerm');
            break;
        case 'lifeIlp':
            navigate('/lifeIlpHomePage');
            break;
        case 'lifePolicy':
            navigate('/lifePoliciesTable');
            break;

        }

    }

    useEffect(() => {
        const url = new URL(window.location);
        if (url.searchParams.has('exchange_code')) {
            // 移除特定的查询参数
            url.searchParams.delete('exchange_code');

            // 使用 history.pushState 更新 URL
            window.history.pushState({}, '', url);

            // 刷新页面以应用新的 URL
            window.location.reload();
        }
    }, []);


    return (
        <>
            <div className="entrance">
                {/*<div className="entrance-travel-item entrance-item" onClick={() => jumpToWhere('travel')}>*/}
                {/*    <div className='travelBg'></div>*/}
                {/*    <div className="entrance-travel-item-desc">This is a travel insurance <b>application</b> only for <b>demonstration</b>.</div>*/}
                {/*</div>*/}
                <div className="entrance-life-item entrance-item" onClick={() => jumpToWhere('life')}>
                    <div className='lifeBg'></div>
                    <div className="entrance-travel-item-desc">This is a one year renewable life insurance <b>application</b> only for <b>demonstration</b>.</div>
                </div>
                {/*<div className="entrance-life-item entrance-item" onClick={() => jumpToWhere('lifeIlp')}>*/}
                {/*    <div className='lifeIlpBg'></div>*/}
                {/*    <div className="entrance-travel-item-desc">This is a investment Ilp insurance <b>application</b> only for <b>demonstration</b>.</div>*/}
                {/*</div>*/}
                {/*<div className="entrance-life-item entrance-item" onClick={() => jumpToWhere('lifePolicy')}>*/}
                {/*    <div className='lifePoliciesBg'></div>*/}
                {/*    <div className="entrance-travel-item-desc">This is a term life Ilp insurance <b>application</b> only for <b>demonstration</b>.</div>*/}
                {/*</div>*/}
            </div>

        </>
    );
}

export default Entrance;
