import { useCallback, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ExpressServiceTable.module.scss';
import { Express } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { url } from '@/utils/url';

export type Props = {
	expressList: Express[];
};

const EXPRESS_DEADLINE = '12:00';

/**
 * Express service table
 */
export const ExpressServiceTable: VFC<Props> = ({ expressList }) => {
	const { t } = useTranslation();

	const handleOpenStorkGuide = () => {
		window.open(url.storkGuide, 'guide', 'width=990,height=800');
	};

	const formatTime = useCallback(
		(expressDeadline: string) => {
			if (expressDeadline === EXPRESS_DEADLINE) {
				return t(
					'pages.productDetail.actionsPanel.expressServiceTable.easternTime'
				);
			}

			const timeArr = expressDeadline.split(':');
			if (timeArr.length !== 2) {
				return expressDeadline;
			}

			const hour = Number(timeArr[0]) % 12;
			const minute = timeArr[1];
			const amPm = Number(timeArr[0]) >= 12 ? 'PM' : 'AM';

			return t(
				'pages.productDetail.actionsPanel.expressServiceTable.orderDeadline',
				{
					time: `${hour}:${minute} ${amPm}`,
				}
			);
		},
		[t]
	);

	return (
		<div>
			<table className={styles.table}>
				<tbody>
					<tr>
						<th className={styles.tableCellHeader}>
							<div className={styles.tableCellHeadWrapper}>
								{t('pages.productDetail.expressDelivery')}
								<div
									className={styles.buttonHelpIcon}
									onClick={handleOpenStorkGuide}
								>
									<span className={styles.helpIcon}>?</span>
								</div>
							</div>
						</th>
						{expressList.map((express, index) => (
							<td key={index} className={styles.tableCell}>
								{express.expressTypeDisp}
							</td>
						))}
					</tr>
					<tr className={styles.tableLastRow}>
						<th className={styles.tableCellHeader}>
							{t(
								'pages.productDetail.actionsPanel.expressServiceTable.orderDeadlineHead'
							)}
						</th>
						{expressList.map((express, index) => (
							<td key={index} className={styles.tableCell}>
								{express.expressDeadline && formatTime(express.expressDeadline)}
							</td>
						))}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

ExpressServiceTable.displayName = 'ExpressServiceTable';
