import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';

export type Props = {
	minDaysToShip?: number;
	maxDaysToShip?: number;
	className?: string;
};

const REQUIRED_QUOTE_DAYS = 99;
const DAYS_TO_SHIP_TODAY = 0;
const SAME_DAYS = -1;

/** Day to ship for recommend CRM */
export const CrmDaysToShip: VFC<Props> = ({
	minDaysToShip,
	maxDaysToShip,
	className,
}) => {
	const [t] = useTranslation();

	const text = useMemo(() => {
		if (minDaysToShip === undefined) {
			return t('components.ui.text.daysToShip.quote');
		}

		if (minDaysToShip > 0 && minDaysToShip !== REQUIRED_QUOTE_DAYS) {
			if (minDaysToShip === maxDaysToShip) {
				return t('components.ui.text.daysToShip.someDays', {
					days: minDaysToShip,
				});
			} else {
				return t('components.ui.text.daysToShip.fromDaysOrMore', {
					fromDays: minDaysToShip,
				});
			}
		}

		if (
			minDaysToShip === SAME_DAYS &&
			!(
				maxDaysToShip !== undefined &&
				maxDaysToShip <= DAYS_TO_SHIP_TODAY &&
				maxDaysToShip !== SAME_DAYS
			)
		) {
			return t('components.ui.text.daysToShip.sameDayOrMore');
		}

		return t('components.ui.text.daysToShip.quote');
	}, [maxDaysToShip, minDaysToShip, t]);

	return <span className={className}>{text}</span>;
};
CrmDaysToShip.displayName = 'CrmDaysToShip';
