import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MyShipments.module.scss';
import { NagiLink } from '@/components/mobile/ui/links';
import { url } from '@/utils/url';

type Props = {
	/** 翌日に配送する件数 */
	nextDay: number;
	/** 当日に配送する件数 */
	currentDay: number;
	/** 前日に配送した件数 */
	previousDay: number;
};

const formatDate = 'YYYYMMDD';

/**
 * 出荷状況
 */
export const MyShipments: React.VFC<Props> = ({
	nextDay,
	currentDay,
	previousDay,
}) => {
	/** translator */
	const [t] = useTranslation();
	// TODO: wos パラメータ lang を、ヘッダーで指定した言語にする (en)
	const lang = 'en';

	const today = dayjs().format(formatDate);
	const tomorrow = dayjs().add(1, 'day').format(formatDate);
	const yesterday = dayjs().subtract(1, 'day').format(formatDate);

	const shipmentList = [
		{
			title: t('mobile.pages.home.orderStatusPanel.tomorrow'),
			count: nextDay,
			link: url.wos.shipment.historyByDate({ lang }, tomorrow),
		},
		{
			title: t('mobile.pages.home.orderStatusPanel.today'),
			count: currentDay,
			link: url.wos.shipment.historyByDate({ lang }, today),
		},
		{
			title: t('mobile.pages.home.orderStatusPanel.yesterday'),
			count: previousDay,
			link: url.wos.shipment.historyByDate({ lang }, yesterday),
		},
	];

	return (
		<div className={styles.shipmentsBox}>
			<div className={styles.shipments}>
				<div className={styles.shipmentsTitle}>
					{t('mobile.pages.home.orderStatusPanel.shipmentsTitle')}
				</div>
				<div className={styles.shipmentsTitleAside}>
					<NagiLink href={url.wos.order.history({ lang })}>
						{t('mobile.pages.home.orderStatusPanel.seeMore')}
					</NagiLink>
				</div>
			</div>
			<div className={styles.shipmentsMain}>
				<ul className={styles.shipmentsList}>
					{shipmentList.map((shipment, index) => (
						<li key={index} className={styles.shipmentsItem}>
							<div className={styles.shipmentsSubTitle}>{shipment.title}</div>
							<NagiLink href={shipment.link} disabled={shipment.count === 0}>
								<span
									className={classNames(styles.shipmentsCount, {
										[String(styles.hasShipmentsCount)]: shipment.count >= 1,
									})}
								>
									{shipment.count}
								</span>
								<div>{t('mobile.pages.home.orderStatusPanel.count')}</div>
							</NagiLink>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
MyShipments.displayName = 'MyShipments';
