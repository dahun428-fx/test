import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RequestCount.module.scss';
import type { OrderInfo } from '@/components/mobile/pages/Home/PersonalContents/PersonalContents.hooks';
import { NagiLink } from '@/components/mobile/ui/links';
import { url } from '@/utils/url';

type Props = Pick<OrderInfo, 'unfitCount' | 'approvalCount'>;

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
				title: t('mobile.pages.home.orderStatusPanel.unfitQuote'),
				count: unfitCount.quote,
				link: url.wos.inquiry.quote({ lang }),
			},
			{
				title: t('mobile.pages.home.orderStatusPanel.unfitOrder'),
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
				title: t('mobile.pages.home.orderStatusPanel.approvalPending'),
				count: approvalCount.pending,
				link: url.wos.order.approvalHistory({ lang }),
			},
			{
				title: t('mobile.pages.home.orderStatusPanel.returned'),
				count: approvalCount.returned,
				link: url.wos.order.history({ lang }),
			},
			{
				title: t('mobile.pages.home.orderStatusPanel.rejected'),
				count: approvalCount.rejected,
				link: url.wos.order.history({ lang }),
			},
		];
	}, [approvalCount, t, unfitCount.order, unfitCount.quote]);

	return (
		<div className={styles.announceBox}>
			<ul className={styles.announce}>
				{requestList.map((request, index) => (
					<li key={`${request.title}-${index}`} className={styles.announceList}>
						<div
							className={classNames(styles.requestCountWrapper, {
								[String(styles.highlightCount)]: request.count >= 1,
							})}
						>
							<NagiLink href={request.link} disabled={request.count === 0}>
								<div
									className={classNames(styles.requestCount, {
										[String(styles.noRequest)]: request.count === 0,
									})}
								>
									{request.count}
								</div>

								<span
									className={classNames(styles.title, {
										[String(styles.hasRequestTitle)]: request.count >= 1,
									})}
								>
									{request.title}
								</span>
							</NagiLink>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};
RequestCount.displayName = 'RequestCount';
