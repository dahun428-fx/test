import React from 'react';
import { OrderStatusPanel as Presenter } from './OrderStatusPanel';
import { useSelector } from '@/store/hooks';
import { selectOrderInfo } from '@/store/modules/pages/home';

type Props = {
	onClickClose: () => void;
};

/**
 * 注文ステータスパネル
 */
export const OrderStatusPanel: React.VFC<Props> = ({ onClickClose }) => {
	const orderInfo = useSelector(selectOrderInfo);

	if (orderInfo === null) {
		return null;
	}

	return <Presenter {...{ ...orderInfo, onClickClose }} />;
};
OrderStatusPanel.displayName = 'OrderStatusPanel';
