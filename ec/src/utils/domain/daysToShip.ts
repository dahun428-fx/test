import { TFunction } from 'i18next';

type SeriesParams = {
	minStandardDaysToShip?: number;
	minShortestDaysToShip?: number;
	maxStandardDaysToShip?: number;
};

/**
 * Get Text for display day to ship
 */
export function getDaysToShipMessage(params: SeriesParams, t: TFunction) {
	if (
		params.minStandardDaysToShip !== 0 &&
		params.minShortestDaysToShip !== 0
	) {
		return '';
	}

	if (params.minStandardDaysToShip == 0 && params.maxStandardDaysToShip == 0) {
		return t('utils.domain.daysToShip.shippedSameDay');
	} else {
		return '';
	}
}

/**
 * Get Text for display day to ship in filter list spec
 */
export function getDaysToShipMessageSpecFilter(
	daysToShip: number,
	t: TFunction
) {
	switch (daysToShip) {
		case 0:
			return t('utils.domain.daysToShip.shipToday');
		case 99:
			return t('utils.domain.daysToShip.needsEstimate');
		default:
			return t('utils.domain.daysToShip.withInDays', { days: daysToShip });
	}
}
