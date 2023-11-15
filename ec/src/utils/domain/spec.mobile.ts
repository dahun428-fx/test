/**
 * @fileOverview NEW_FE-3402でspec.tsの修正が必要になったが、PCにも影響があるため影響範囲をモバイルに限定するためにこのファイルを作成
 */

import { TFunction } from 'react-i18next';
import { Flag } from '@/models/api/Flag';
import { DaysToShip } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { getDaysToShipMessageSpecFilter } from '@/utils/domain/daysToShip';
import { notHidden, selected } from '@/utils/domain/spec';

/**
 * Create days to ship value list
 * @param {DaysToShip[]} daysToShipListSpec
 * @param {TFunction} t
 */
export const createDaysToShipValueList = (
	daysToShipListSpec: DaysToShip[],
	t: TFunction
) => {
	/** 引数で受け取ったdaysToShipListSpecのうち、何件まで選択肢として表示するか */
	const NUMBER_OF_DISPLAY = 5;

	const notHiddenDaysToShipList = daysToShipListSpec
		.filter(daysToShipItem => notHidden(daysToShipItem))
		.map(daysToShipItem => {
			return {
				...daysToShipItem,
				textLabel: getDaysToShipMessageSpecFilter(daysToShipItem.daysToShip, t),
			};
		});

	if (!notHiddenDaysToShipList.length) {
		return [];
	}

	/** 'All' as default then empty selected item */
	const allValue = {
		daysToShip: undefined,
		hiddenFlag: Flag.FALSE,
		selectedFlag: daysToShipListSpec.some(selected) ? Flag.FALSE : Flag.TRUE,
		textLabel: t('utils.domain.daysToShip.all'),
	};

	/** daysToShipListSpecの一番最後を「Others」として表示（現行仕様） */
	const others =
		notHiddenDaysToShipList.length > NUMBER_OF_DISPLAY
			? [
					{
						...notHiddenDaysToShipList.slice(-1)[0],
						textLabel: t('utils.domain.daysToShip.others'),
					},
			  ]
			: [];

	return [
		allValue,
		...notHiddenDaysToShipList.slice(0, NUMBER_OF_DISPLAY),
		...others,
	];
};
