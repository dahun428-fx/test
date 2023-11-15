import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MyShipments.module.scss';
import { Link } from '@/components/pc/ui/links';
import { digit } from '@/utils/number';
import { url } from '@/utils/url';

type Props = {
	/** 翌日に配送する件数 */
	nextDay: number;
	/** 当日に配送する件数 */
	currentDay: number;
	/** 前日に配送した件数 */
	previousDay: number;
};

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

	const today = dayjs().format('YYYYMMDD');
	const tomorrow = dayjs().add(1, 'day').format('YYYYMMDD');
	const yesterday = dayjs().subtract(1, 'day').format('YYYYMMDD');

	const shipmentList = [
		{
			title: t('pages.home.orderStatusPanel.tomorrow'),
			count: nextDay,
			link: url.wos.shipment.historyByDate({ lang }, tomorrow),
		},
		{
			title: t('pages.home.orderStatusPanel.today'),
			count: currentDay,
			link: url.wos.shipment.historyByDate({ lang }, today),
		},
		{
			title: t('pages.home.orderStatusPanel.yesterday'),
			count: previousDay,
			link: url.wos.shipment.historyByDate({ lang }, yesterday),
		},
	];

	return (
		<div className={styles.container}>
			<div className={styles.titleBox}>
				<div className={styles.title}>
					{t('pages.home.orderStatusPanel.shipmentsTitle')}
				</div>
				<Link href={url.wos.order.history({ lang })} className={styles.link}>
					{t('pages.home.orderStatusPanel.seeMore')}
				</Link>
			</div>
			<div className={styles.main}>
				<ul>
					{shipmentList.map((shipment, index) => (
						<li key={index} className={styles.item}>
							<div>{shipment.title}</div>
							{shipment.count > 0 ? (
								<Link href={shipment.link} className={styles.link}>
									<span className={styles.count}>{digit(shipment.count)}</span>
									<div>{t('pages.home.orderStatusPanel.count')}</div>
								</Link>
							) : (
								<div className={styles.disabled}>
									<span className={styles.count}>{digit(shipment.count)}</span>
									<div>{t('pages.home.orderStatusPanel.count')}</div>
								</div>
							)}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
MyShipments.displayName = 'MyShipments';
