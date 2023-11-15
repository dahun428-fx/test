import classnames from 'classnames';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DaysToShipListSpec.module.scss';
import { SpecFrame } from '@/components/pc/pages/ProductDetail/templates/Simple/SpecFilter/specs/SpecFrame';
import { Flag } from '@/models/api/Flag';
import { DaysToShip as RawDaysToShip } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { assertNotNull } from '@/utils/assertions';
import { getDaysToShipMessageSpecFilter } from '@/utils/domain/daysToShip';
import { selected } from '@/utils/domain/spec';
import { SendLogPayload } from '@/utils/domain/spec/types';

export type Props = {
	daysToShipList: RawDaysToShip[];
	onChange: (spec: { daysToShip: number | undefined }) => void;
	onSelectHiddenSpec: (selectedSpec: {
		daysToShip: number | undefined;
	}) => void;
	sendLog: (payload: SendLogPayload) => void;
};

type DaysToShip = {
	daysToShip?: number; // undefined means all
	daysToShipDisp: string;
	hiddenFlag?: Flag;
	selectedFlag: Flag;
};

/**
 * DaysToShip spec radio button list
 */
export const DaysToShipListSpec: React.VFC<Props> = ({
	daysToShipList: rawDaysToShipList,
	onChange,
	onSelectHiddenSpec,
	sendLog,
}) => {
	const { t } = useTranslation();

	// radio button なので択一
	const [checkedDaysToShip, setCheckedDaysToShip] = useState<number>();

	const daysToShipList: DaysToShip[] = useMemo(
		() =>
			!rawDaysToShipList.length
				? []
				: [
						{
							// 選択肢「All」。daysToShip は undefined
							hiddenFlag: Flag.FALSE,
							selectedFlag: rawDaysToShipList.some(selected)
								? Flag.FALSE
								: Flag.TRUE,
							daysToShipDisp: t(
								'pages.productDetail.simple.specFilter.specs.daysToShipListSpec.all'
							),
						},
						...rawDaysToShipList.map(daysToShip => ({
							...daysToShip,
							daysToShipDisp: getDaysToShipMessageSpecFilter(
								daysToShip.daysToShip,
								t
							),
						})),
				  ],
		[rawDaysToShipList, t]
	);

	useEffect(
		() =>
			setCheckedDaysToShip(
				rawDaysToShipList.find(daysToShip =>
					Flag.isTrue(daysToShip.selectedFlag)
				)?.daysToShip
			),
		[rawDaysToShipList]
	);

	const handleClick = ({ daysToShip, daysToShipDisp }: DaysToShip) => {
		// 既に選択していたら何もしない (radio button だから)
		if (daysToShip === checkedDaysToShip) {
			return;
		}

		const foundValue = daysToShipList.find(
			value => daysToShip === value.daysToShip
		);
		assertNotNull(foundValue);

		sendLog({
			specName: t(
				'pages.productDetail.simple.specFilter.specs.daysToShipListSpec.dayToShipSpecName'
			),
			specValueDisp: daysToShipDisp,
			// 出荷日は特殊で、ラジオボタンなので OFF のログを送ることはなく、ON しか送らない。
			selected: true,
		});

		// radio button なのでここで set できる
		setCheckedDaysToShip(daysToShip);

		if (Flag.isTrue(foundValue.hiddenFlag)) {
			return onSelectHiddenSpec({ daysToShip });
		}
		onChange({ daysToShip });
	};

	const handleClear = useCallback(() => {
		onChange({ daysToShip: undefined });
		setCheckedDaysToShip(undefined);
	}, [onChange]);

	return (
		<SpecFrame
			specName={t(
				'pages.productDetail.simple.specFilter.specs.daysToShipListSpec.dayToShipSpecName'
			)}
			selectedFlag={Flag.toFlag(
				rawDaysToShipList.some(daysToShip =>
					Flag.isTrue(daysToShip.selectedFlag)
				)
			)}
			onClear={handleClear}
		>
			<div className={styles.container}>
				<ul className={styles.itemList}>
					{daysToShipList.map(daysToShip => (
						<li
							key={String(daysToShip.daysToShip)}
							className={classnames(styles.listDefault, {
								[String(styles.checked)]:
									checkedDaysToShip === daysToShip.daysToShip,
								[String(styles.weak)]: Flag.isTrue(daysToShip.hiddenFlag),
							})}
							onClick={() => handleClick(daysToShip)}
						>
							{daysToShip.daysToShipDisp}
						</li>
					))}
				</ul>
			</div>
		</SpecFrame>
	);
};
