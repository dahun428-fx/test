import React from 'react';
import { useTranslation } from 'react-i18next';
import { MyShipments } from './MyShipments';
import styles from './OrderStatusPanel.module.scss';
import { QuoteHistory } from './QuoteHistory';
import { RequestCount } from './RequestCount';
import { OrderInfo, Quote } from '@/store/modules/pages/home';

type Props = {
	/** アンフィット件数 */
	unfitCount: OrderInfo['unfitCount'];
	/** 承認件数 */
	approvalCount?: OrderInfo['approvalCount'];
	/** 配送情報 */
	deliveryCount: OrderInfo['deliveryCount'];
	/** 見積履歴リスト */
	quoteList: Quote[];
	/** 通貨コード */
	currencyCode?: string;
	/** 閉じるボタン押下 */
	onClickClose: () => void;
};

/**
 * お取り引きステータス表示（ログイン後）
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

	return (
		<div className={styles.panel}>
			<div className={styles.titleBox}>
				<h2 className={styles.title}>
					{t('pages.home.orderStatusPanel.title')}
				</h2>
				<a className={styles.closeButton} onClick={onClickClose}>
					{t('pages.home.orderStatusPanel.close')}
				</a>
			</div>
			<div className={styles.contents}>
				<RequestCount unfitCount={unfitCount} approvalCount={approvalCount} />
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
	);
};
OrderStatusPanel.displayName = 'OrderStatusPanel';
