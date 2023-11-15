import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DaysToShipListSpec.module.scss';
import { Checkbox } from '@/components/mobile/domain/specs/checkboxes/';
import { CommonListSpec } from '@/components/mobile/domain/specs/series/CommonListSpec';
import { DaysToShip } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { selected } from '@/utils/domain/spec';
import { createDaysToShipValueList } from '@/utils/domain/spec.mobile';
import { notNull } from '@/utils/predicate';

type DaysToShipValue = number;

type Props = {
	daysToShipListSpec: DaysToShip[];
	onChange: (spec: Record<string, number | undefined>) => void;
};

/**
 * Days to ship list spec component
 */
export const DaysToShipListSpec: React.FC<Props> = ({
	daysToShipListSpec,
	onChange,
}) => {
	const [t] = useTranslation();
	const [checkedSpec, setCheckedSpec] = useState<DaysToShipValue>();
	const daysToShipValueList = useMemo(
		() => createDaysToShipValueList(daysToShipListSpec, t),
		[daysToShipListSpec, t]
	);

	useEffect(() => {
		const itemsWithSelectedFlag = daysToShipListSpec.filter(daysToShipItem => {
			return selected(daysToShipItem);
		});

		if (
			notNull(itemsWithSelectedFlag[0]) &&
			itemsWithSelectedFlag[0] !== undefined
		) {
			setCheckedSpec(itemsWithSelectedFlag[0].daysToShip);
		} else {
			setCheckedSpec(undefined);
		}
	}, [daysToShipListSpec]);

	const handleClick = (daysToShip?: number) => {
		if (daysToShip === checkedSpec) {
			return;
		}

		setCheckedSpec(daysToShip);
		onChange({ daysToShip });
	};

	return daysToShipValueList.length ? (
		<CommonListSpec
			title={t('mobile.components.domain.specs.series.daysToShip.daysToShip')}
		>
			<div className={styles.container}>
				{daysToShipValueList.map((daysToShip, index) => {
					return (
						<Checkbox
							className={styles.item}
							checked={checkedSpec === daysToShip.daysToShip}
							theme="sub"
							key={index}
							onClick={() => {
								handleClick(daysToShip.daysToShip);
							}}
						>
							{daysToShip.textLabel}
						</Checkbox>
					);
				})}
			</div>
		</CommonListSpec>
	) : null;
};

DaysToShipListSpec.displayName = 'DaysToShipListSpec';
