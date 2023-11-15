import React from 'react';
import { useTranslation } from 'react-i18next';
import { MyShipments } from './MyShipments';
import styles from './OrderStatusPanel.module.scss';
import { QuoteHistory } from './QuoteHistory';
import { RequestCount } from './RequestCount';
import type {
	OrderInfo,
	Quote,
} from '@/components/mobile/pages/Home/PersonalContents/PersonalContents.hooks';

type Props = {
	/** Unfit Count */
	unfitCount: OrderInfo['unfitCount'];
	/** Approval Count */
	approvalCount?: OrderInfo['approvalCount'];
	/** Delivery Count */
	deliveryCount: OrderInfo['deliveryCount'];
	/** Quote History List */
	quoteList: Quote[];
	/** Currency Code */
	currencyCode?: string;
	/** Close event callback */
	onClickClose: () => void;
};

/**
 * Order Status panel ( After Login )
 */
export const OrderStatusPanel: React.VFC<Props> = ({
	unfitCount,
	approvalCount,
	deliveryCount,
	quoteList,
	currencyCode,
	onClickClose,
}) => {
	/** translator */
	const [t] = useTranslation();

	/** handle click close */
	const handleClickClose = (event: React.MouseEvent) => {
		event.preventDefault();
		onClickClose();
	};

	return (
		<div className={styles.container}>
			<div className={styles.titleBox}>
				<h2 className={styles.title}>
					{t('mobile.pages.home.orderStatusPanel.title')}
				</h2>
				<div className={styles.closeButtonBox}>
					<a
						href=""
						className={styles.closeButton}
						onClick={handleClickClose}
					/>
				</div>
			</div>
			<div className={styles.contents}>
				<RequestCount {...{ unfitCount, approvalCount }} />
				<div className={styles.statusBox}>
					<MyShipments {...deliveryCount} />
					<QuoteHistory
						/* Maximum of Quote History list is 8 */
						quoteList={quoteList.slice(0, 8)}
						currencyCode={currencyCode}
					/>
				</div>
			</div>
		</div>
	);
};
OrderStatusPanel.displayName = 'OrderStatusPanel';
