import { useMemo, VFC } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export type Props = {
	/** 最小通常出荷日数 */
	minDaysToShip?: number;
	/** 最大通常出荷日数 */
	maxDaysToShip?: number;
	fallback?: string;
	className?: string;
	/** 数字だけスタイル付与する場合 */
	numberClassName?: string;
};

/** 別途調整、都度見積が必要な場合の日数 */
const REQUIRED_QUOTE_DAYS = 99;

/**
 * 出荷日数表示文言
 */
export const DaysToShip: VFC<Props> = ({
	minDaysToShip,
	// 最大通常出荷日数が存在しなかった場合は最小通常出荷日数で埋める (2022/2 現在の現行実装を踏襲)
	maxDaysToShip = minDaysToShip,
	fallback,
	className,
	numberClassName,
}) => {
	const [t] = useTranslation();

	/**
	 * @returns 出荷日数表示文言
	 * - 最小日数に値が設定されていない場合は '---' と表示
	 * - 最小日数は EACH_TIME_QUOTE_DAYS(99) の場合は 'Quote' と表示
	 * - 最小日数が 0 の場合は 'Same day'、1~98 の場合は 'N Day(s)' と表示
	 * - 最小日数と最大日数が異なる場合のみ 'or more' と追記
	 */
	const text = useMemo(() => {
		// 最大日数が undefined になりうるのは、最小日数が undefined の場合のみなので、最小日数のみ判定
		if (minDaysToShip === undefined) {
			return fallback ?? t('mobile.components.ui.text.daysToShip.void');
		}

		if (minDaysToShip === REQUIRED_QUOTE_DAYS) {
			return t('mobile.components.ui.text.daysToShip.quote');
		}

		if (minDaysToShip !== 0) {
			// 最小日数と最大日数が異なる場合のみ 'or more' と追記
			// 最小日数より最大日数が小さい場合は API の不具合として考慮しない
			return minDaysToShip === maxDaysToShip ? (
				<Trans
					i18nKey="mobile.components.ui.text.daysToShip.days"
					values={{ days: minDaysToShip }}
				>
					<span className={numberClassName} />
				</Trans>
			) : (
				<Trans
					i18nKey="mobile.components.ui.text.daysToShip.daysOrMore"
					values={{ days: minDaysToShip }}
				>
					<span className={numberClassName} />
				</Trans>
			);
		}

		return minDaysToShip === maxDaysToShip
			? t('mobile.components.ui.text.daysToShip.sameDay')
			: t('mobile.components.ui.text.daysToShip.sameDayOrMore');
	}, [fallback, maxDaysToShip, minDaysToShip, numberClassName, t]);

	return <span className={className}>{text}</span>;
};
DaysToShip.displayName = 'DaysToShip';
