import classnames from 'classnames';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DaysToShipListSpec.module.scss';
import { SpecFrame } from '@/components/pc/ui/specs/SpecFrame';
import { Flag } from '@/models/api/Flag';
import { DaysToShip } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { createDaysToShipValueList, selected } from '@/utils/domain/spec';
import { SendLogPayload } from '@/utils/domain/spec/types';
import { notNull } from '@/utils/predicate';

type DaysToShipValue = number;
type SpecCode = string;
type SpecValues = string[] | number | undefined;

export type Props = {
	daysToShipList: DaysToShip[];
	onChange: (spec: Record<SpecCode, SpecValues>, isClear?: boolean) => void;
	sendLog?: (payload: SendLogPayload) => void;
};

/**
 * DaysToShip spec radio button list
 */
export const DaysToShipListSpec: React.VFC<Props> = ({
	daysToShipList,
	onChange,
	sendLog,
}) => {
	const { t } = useTranslation();

	const [checkedDaysToShipValue, setCheckedDaysToShipValue] =
		useState<DaysToShipValue>();

	/**  TODO: DEV MODE: if we are using DEV mode (not implemented in Malaysia Mirai PJ yet), then always display everything. 
		(if the hidden flag is "1", then show the item as greyed out and do not let the user select it)	
	*/
	const daysToShipValueList = useMemo(
		() => createDaysToShipValueList(daysToShipList, t),
		[daysToShipList, t]
	);

	useEffect(() => {
		const itemsWithSelectedFlag = daysToShipList.filter(daysToShipItem => {
			return (
				selected(daysToShipItem) && Flag.isFalse(daysToShipItem.hiddenFlag)
			);
		});
		if (notNull(itemsWithSelectedFlag[0])) {
			setCheckedDaysToShipValue(itemsWithSelectedFlag[0].daysToShip);
		} else {
			setCheckedDaysToShipValue(undefined);
		}
	}, [daysToShipList]);

	const handleClick = useCallback(
		(clickedSpecValue?: number) => {
			if (clickedSpecValue === checkedDaysToShipValue) {
				return;
			}

			const foundDaysToShip = daysToShipValueList.find(
				daysToShipValue => daysToShipValue.daysToShip === clickedSpecValue
			);

			if (foundDaysToShip) {
				sendLog?.({
					specName: t(
						'components.ui.specs.daysToShipListSpec.dayToShipSpecName'
					),
					specValueDisp: foundDaysToShip.textLabel,
					selected: true,
				});
			}

			setCheckedDaysToShipValue(clickedSpecValue);
			onChange({ daysToShip: clickedSpecValue });
		},
		[checkedDaysToShipValue, daysToShipValueList, onChange, sendLog, t]
	);
	const handleClear = useCallback(() => {
		setCheckedDaysToShipValue(undefined);
		onChange({ daysToShip: undefined }, true);
	}, [onChange, setCheckedDaysToShipValue]);

	if (!daysToShipList.length || !daysToShipValueList.length) {
		return null;
	}

	return (
		<SpecFrame
			specName={t('components.ui.specs.daysToShipListSpec.dayToShipSpecName')}
			selectedFlag={Flag.toFlag(daysToShipList.filter(selected).length)}
			onClear={handleClear}
		>
			<div className={styles.container}>
				<ul>
					{daysToShipValueList.map((daysToShipItem, index) => (
						<li
							key={index}
							className={classnames(
								styles.listDefault,
								checkedDaysToShipValue === daysToShipItem.daysToShip
									? styles.checked
									: styles.noCheck
							)}
							onClick={() => handleClick(daysToShipItem.daysToShip)}
						>
							{daysToShipItem.textLabel}
						</li>
					))}
				</ul>
			</div>
		</SpecFrame>
	);
};

DaysToShipListSpec.displayName = 'DaysToShipListSpec';
