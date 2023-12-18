import { OrderInfo } from '@/store/modules/pages/home';
import React from 'react';
import { RequestCount } from './RequestCount';
import { MyShipments } from './MyShipments';

type Props = {
	unfitCount: OrderInfo['unfitCount'];
	approvalCount?: OrderInfo['approvalCount'];
	deliveryCount: OrderInfo['deliveryCount'];
	quoteList: OrderInfo['quoteList'];
	currencyCode?: string;
};

export const OrderStatusPanel: React.FC<Props> = ({
	unfitCount,
	approvalCount,
	deliveryCount,
	quoteList,
	currencyCode,
}) => {
	return (
		<div>
			<h1>hello</h1>
			<RequestCount unfitCount={unfitCount} approvalCount={approvalCount} />
			<MyShipments {...deliveryCount} />
		</div>
	);
};
OrderStatusPanel.displayName = 'OrderStatusPanel';
