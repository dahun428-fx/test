import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';

export type Props = {
	/** 最小通常出荷日数 */
	minDaysToShip?: number;
	/** 最大通常出荷日数 */
	maxDaysToShip?: number;
	className?: string;
};

/** 別途調整、都度見積が必要な場合の日数 */
const REQUIRED_QUOTE_DAYS = 99;
// TODO: Set these constants to config
const DAYS_TO_SHIP_TODAY = 0;

/**
 * 出荷日数表示文言
 */
export const DaysToShip: VFC<Props> = ({
	minDaysToShip,
	// 最大通常出荷日数が存在しなかった場合は最小通常出荷日数で埋める (2022/2 現在の現行実装を踏襲)
	maxDaysToShip = minDaysToShip,
	className,
}) => {
	const [t] = useTranslation();

	/**
	 * @returns 出荷日数表示文言
	 * - 最小日数に値が設定されていない場合は '-' と表示
	 * - 最小日数は EACH_TIME_QUOTE_DAYS(99) の場合は 'Quote' と表示
	 * - 最小日数が 0 の場合は 'Same day'、1~98 の場合は 'N Day(s)' と表示
	 * - 最小日数と最大日数が異なる場合のみ 'or more' と追記
	 */
	const text = useMemo(() => {
		// 最大日数が undefined になりうるのは、最小日数が undefined の場合のみなので、最小日数のみ判定
		if (
			minDaysToShip === undefined ||
			maxDaysToShip === undefined ||
			minDaysToShip < DAYS_TO_SHIP_TODAY ||
			maxDaysToShip > REQUIRED_QUOTE_DAYS
		) {
			return t('components.ui.text.daysToShip.void');
		}

		if (minDaysToShip === REQUIRED_QUOTE_DAYS) {
			return t('components.ui.text.daysToShip.quote');
		}

		const daysToShip =
			minDaysToShip === 0
				? t('components.ui.text.daysToShip.sameDay')
				: t('components.ui.text.daysToShip.someDays', { days: minDaysToShip });

		// 最小日数と最大日数が異なる場合のみ 'or more' と追記
		// 最小日数より最大日数が小さい場合は API の不具合として考慮しない
		if (minDaysToShip !== maxDaysToShip) {
			return t('components.ui.text.daysToShip.minDaysOrMore', {
				minDays: daysToShip,
			});
		}

		return daysToShip;
	}, [maxDaysToShip, minDaysToShip, t]);

	return <span className={className}>{text}</span>;
};
DaysToShip.displayName = 'DaysToShip';
