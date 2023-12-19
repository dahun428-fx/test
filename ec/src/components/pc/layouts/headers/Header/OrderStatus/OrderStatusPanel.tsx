import { OrderInfo } from '@/store/modules/pages/home';
import React from 'react';
import styles from './OrderStatusPanel.module.scss';
import { RequestCount } from './RequestCount';
import { MyShipments } from './MyShipments';
import { QuoteHistory } from './QuoteHistory';
import { useTranslation } from 'react-i18next';
import { useOrderStatusPanel } from './OrderStatusPanel.hooks';

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
	const [t] = useTranslation();

	const { setShowsStatus, showsStatus } = useOrderStatusPanel();

	const onClickClose = () => {
		setShowsStatus(false);
	};

	return (
		<>
			{showsStatus && (
				<div className={styles.orderPopup}>
					<div className={styles.panel}>
						<div className={styles.titleBox}>
							<h2 className={styles.title}>
								{t(
									'components.ui.layouts.headers.header.orderStatusPanel.title'
								)}
							</h2>
							<a className={styles.closeButton} onClick={onClickClose}>
								{t(
									'components.ui.layouts.headers.header.orderStatusPanel.close'
								)}
							</a>
						</div>
						<div className={styles.contents}>
							<RequestCount
								unfitCount={unfitCount}
								approvalCount={approvalCount}
							/>
							<div className={styles.statusBox}>
								<MyShipments {...deliveryCount} />
								<QuoteHistory
									/* 見積履歴の表示は最大8件 */
									quoteList={quoteList.slice(0, 8)}
									currencyCode={currencyCode}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
OrderStatusPanel.displayName = 'OrderStatusPanel';
