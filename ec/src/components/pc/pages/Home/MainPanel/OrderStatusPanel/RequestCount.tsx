import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RequestCount.module.scss';
import { Link } from '@/components/pc/ui/links';
import { OrderInfo } from '@/store/modules/pages/home';
import { digit } from '@/utils/number';
import { url } from '@/utils/url';

type Props = {
	/** アンフィット件数 */
	unfitCount: OrderInfo['unfitCount'];
	/** 承認件数 */
	approvalCount?: OrderInfo['approvalCount'];
};

/**
 * リクエスト件数表示
 */
export const RequestCount: React.VFC<Props> = ({
	unfitCount,
	approvalCount,
}) => {
	/** translator */
	const [t] = useTranslation();
	// TODO: wos パラメータ lang を、ヘッダーで指定した言語にする (en)
	const lang = 'en';

	const requestList = useMemo(() => {
		const unfitList = [
			{
				title: t('pages.home.orderStatusPanel.unfitQuote'),
				count: unfitCount.quote,
				link: url.wos.inquiry.quote({ lang }),
			},
			{
				title: t('pages.home.orderStatusPanel.unfitOrder'),
				count: unfitCount.order,
				link: url.wos.inquiry.order({ lang }),
			},
		];
		if (!approvalCount) {
			return unfitList;
		}
		return [
			...unfitList,
			{
				title: t('pages.home.orderStatusPanel.approvalPending'),
				count: approvalCount.pending,
				link: url.wos.order.approvalHistory({ lang }),
			},
			{
				title: t('pages.home.orderStatusPanel.returned'),
				count: approvalCount.returned,
				link: url.wos.order.history({ lang }),
			},
			{
				title: t('pages.home.orderStatusPanel.rejected'),
				count: approvalCount.rejected,
				link: url.wos.order.history({ lang }),
			},
		];
	}, [approvalCount, t, unfitCount.order, unfitCount.quote]);

	return (
		<ul className={styles.main}>
			{requestList.map((request, index) => (
				<li key={index} className={styles.item}>
					{request.count === 0 ? (
						<div className={classNames(styles.box, styles.disabled)}>
							<div className={styles.title}>{request.title}</div>
							<div className={styles.count}>{digit(request.count)}</div>
						</div>
					) : (
						<Link
							href={request.link}
							className={classNames(styles.box, styles.link)}
						>
							<div>
								<div className={styles.title}>{request.title}</div>
								<div className={styles.count}>{digit(request.count)}</div>
							</div>
						</Link>
					)}
				</li>
			))}
		</ul>
	);
};
RequestCount.displayName = 'RequestCount';
