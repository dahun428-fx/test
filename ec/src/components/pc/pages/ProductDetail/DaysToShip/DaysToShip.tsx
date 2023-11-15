import classNames from 'classnames';
import { VFC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './DaysToShip.module.scss';
import { url } from '@/utils/url';

type Props = {
	daysToShip?: number;
	isPurchaseLinkUser: boolean;
	theme?: 'normal' | 'boldNumber';
	mode?: 'simple' | 'default';
};

/**
 * Days to ship
 */
export const DaysToShip: VFC<Props> = ({
	daysToShip,
	isPurchaseLinkUser,
	theme = 'normal',
	mode = 'default',
}) => {
	const [t] = useTranslation();
	if (daysToShip === undefined) {
		return <span>---</span>;
	}

	if (daysToShip === 99) {
		return <span>{t('pages.productDetail.daysToShipUI.quote')}</span>;
	}

	if (daysToShip === 0 && !isPurchaseLinkUser) {
		if (mode === 'default') {
			return (
				<div className={styles.preWrap}>
					<Trans i18nKey="pages.productDetail.daysToShipUI.sameDayShipOutServiceMessage">
						<strong />
					</Trans>
				</div>
			);
		}

		if (mode === 'simple') {
			return (
				<div className={styles.preWrap}>
					<span className={styles.highlightSameDay}>
						{t('pages.productDetail.daysToShipUI.sameDay')}
					</span>
					<div className={styles.sameDayShipOrDeliver}>
						<Trans i18nKey="pages.productDetail.daysToShipUI.sameDayShipOutServiceMessage">
							<strong />
							<a
								href={url.sameDayService}
								target="_blank"
								rel="noreferrer"
								className={styles.sameDayShipOrDeliverAnchor}
							/>
						</Trans>
					</div>
				</div>
			);
		}
	}

	if (daysToShip === 0) {
		return <span>{t('pages.productDetail.daysToShipUI.sameDay')}</span>;
	}

	return (
		<Trans i18nKey="pages.productDetail.daysToShipUI.shipDaysUnit">
			<span
				className={classNames({
					[String(styles.textBold)]: theme === 'boldNumber',
				})}
			>
				{{ days: daysToShip }}
			</span>
		</Trans>
	);
};

DaysToShip.displayName = 'DaysToShip';
