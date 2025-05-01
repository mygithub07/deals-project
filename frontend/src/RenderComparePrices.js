import React from 'react';
import { ComparePrices } from './pages/ComparePrices';
import { useLocation } from 'react-router-dom';

export const RenderComparePrices = () => {
    const location = useLocation();

    return <ComparePrices reRenderstate={location.state} />;
};
