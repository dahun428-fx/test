import { OrderInfo } from '@/store/modules/pages/home';
import { url } from '@/utils/url';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RequestCount.module.scss';
import classNames from 'classnames';
import { digit } from '@/utils/number';
import { Link } from '@/components/pc/ui/links';

type Props = {
	unfitCount: OrderInfo['unfitCount'];
	approvalCount?: OrderInfo['approvalCount'];
};

export const RequestCount: React.FC<Props> = ({
	unfitCount,
	approvalCount,
}) => {
	const [t] = useTranslation();
	const lang = 'ko';

	const requestList = useMemo(() => {
		const unfitList = [
			{
				title: t('layouts.headers.orderStatusPanel.unfitQuote'),
				count: unfitCount.quote,
				link: url.wos.inquiry.quote({ lang }),
			},
			{
				title: t('layouts.headers.orderStatusPanel.unfitOrder'),
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
				title: t('layouts.headers.orderStatusPanel.approvalPending'),
				count: approvalCount.pending,
				link: url.wos.order.approvalHistory({ lang }),
			},
			{
				title: t('layouts.headers.orderStatusPanel.returned'),
				count: approvalCount.returned,
				link: url.wos.order.history({ lang }),
			},
			{
				title: t('layouts.headers.orderStatusPanel.rejected'),
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
