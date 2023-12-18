import React from 'react';
import { useSelector } from 'react-redux';
import { OrderStatusPanel as Presenter } from './OrderStatusPanel';
import { selectOrderInfo } from '@/store/modules/pages/home';

export const OrderStatusPanel: React.FC = () => {
	const orderInfo = useSelector(selectOrderInfo);
	if (orderInfo === null) return null;

	return <Presenter {...{ ...orderInfo }} />;
};
OrderStatusPanel.displayName = 'OrderStatusPanel';
