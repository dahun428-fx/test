import { OrderInfo } from '@/store/modules/pages/home';
import dayjs from 'dayjs';
import React from 'react';
import styles from './MyShipments.module.scss';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/pc/ui/links';
import { url } from '@/utils/url';
import { digit } from '@/utils/number';

type Props = {
	nextDay: number;
	currentDay: number;
	previousDay: number;
};

/*
            "nextDay": 0,
            "currentDay": 0,
            "previousDay": 0
 */
export const MyShipments: React.FC<Props> = ({
	nextDay,
	currentDay,
	previousDay,
}) => {
	const [t] = useTranslation();

	const lang = 'ko';

	const today = dayjs().format('YYYYMMDD');
	const tomorrow = dayjs().add(1, 'day').format('YYYYMMDD');
	const yesterday = dayjs().subtract(1, 'day').format('YYYYMMDD');

	const shipmentList = [
		{
			title: t(
				'components.ui.layouts.headers.header.orderStatusPanel.tomorrow'
			),
			count: nextDay,
			link: url.wos.shipment.historyByDate({ lang }, tomorrow),
		},
		{
			title: t('components.ui.layouts.headers.header.orderStatusPanel.today'),
			count: currentDay,
			link: url.wos.shipment.historyByDate({ lang }, today),
		},
		{
			title: t(
				'components.ui.layouts.headers.header.orderStatusPanel.yesterday'
			),
			count: previousDay,
			link: url.wos.shipment.historyByDate({ lang }, yesterday),
		},
	];

	return (
		<div className={styles.container}>
			<div className={styles.titleBox}>
				<div className={styles.title}>
					{t(
						'components.ui.layouts.headers.header.orderStatusPanel.shipmentsTitle'
					)}
				</div>
				<Link href={url.wos.order.history({ lang })} className={styles.link}>
					{t(
						'components.ui.layouts.headers.header.orderStatusPanel.orderSeeMore'
					)}
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
									<div>
										{t(
											'components.ui.layouts.headers.header.orderStatusPanel.count'
										)}
									</div>
								</Link>
							) : (
								<div className={styles.disabled}>
									<span className={styles.count}>{digit(shipment.count)}</span>
									<div>
										{t(
											'components.ui.layouts.headers.header.orderStatusPanel.count'
										)}
									</div>
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
