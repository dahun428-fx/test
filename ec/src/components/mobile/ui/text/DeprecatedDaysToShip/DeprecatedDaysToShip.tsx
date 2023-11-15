import classNames from 'classnames';
import { VFC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './DeprecatedDaysToShip.module.scss';
import { url } from '@/utils/url';

type Props = {
	daysToShip?: number;
	isPurchaseLinkUser?: boolean;
	theme?: 'normal' | 'boldNumber';
	mode?: 'simple' | 'default';
};

/**
 * Days to ship
 * TODO: this component used on search box of common header
 * 		 For convenience , temporarily renamed 'Deprecated~'
 * 		 However, this functionality will eventually need to be added to the ui/text component.
 */
export const DeprecatedDaysToShip: VFC<Props> = ({
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
		return (
			<span>{t('mobile.components.ui.text.deprecatedDaysToShip.quote')}</span>
		);
	}

	if (daysToShip === 0 && !isPurchaseLinkUser) {
		if (mode === 'default') {
			return (
				<div className={styles.preWrap}>
					<Trans i18nKey="mobile.components.ui.text.deprecatedDaysToShip.sameDayShipOutServiceMessage">
						<strong />
					</Trans>
				</div>
			);
		}

		if (mode === 'simple') {
			return (
				<div className={styles.preWrap}>
					<span className={styles.highlightSameDay}>
						{t('mobile.components.ui.text.deprecatedDaysToShip.sameDay')}
					</span>
					<div className={styles.sameDayShipOrDeliver}>
						<Trans i18nKey="mobile.components.ui.text.deprecatedDaysToShip.sameDayShipOutServiceMessage">
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
		return (
			<span>{t('mobile.components.ui.text.deprecatedDaysToShip.sameDay')}</span>
		);
	}

	return (
		<Trans i18nKey="mobile.components.ui.text.deprecatedDaysToShip.shipDaysUnit">
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

DeprecatedDaysToShip.displayName = 'DeprecatedDaysToShip';
