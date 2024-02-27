import { ParametricUnitPartNumberSpec } from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/SpecFilter.types';
import styles from './ImageListSpec.module.scss';
import {
	AlterationSpec,
	SpecValue,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import { SendLogPayload } from '@/utils/domain/spec/types';
import { useNormalizeSpec } from '@/utils/domain/spec/normalize';
import { useEffect, useState } from 'react';
import { selected } from '@/utils/domain/spec';
import { assertNotNull } from '@/utils/assertions';
import { Flag } from '@/models/api/Flag';
import { RadioButton } from '@/components/pc/ui/specs/RadioButton';

type SpecValues = string[];

type Props = {
	spec: ParametricUnitPartNumberSpec | AlterationSpec;
	onChange: (
		specs: Partial<SearchPartNumberRequest>,
		isHiddenSpec?: boolean
	) => void;
	sendLog: (payload: SendLogPayload) => void;
};

export const ImageListSpec: React.FC<Props> = ({ spec, onChange, sendLog }) => {
	const normalizedSpec = useNormalizeSpec(spec);

	const { specCode, specValueList } = normalizedSpec;

	const [selectedSpecValueList, setSelectedSpecValueList] =
		useState<SpecValues>([]);

	useEffect(() => {
		setSelectedSpecValueList(
			specValueList.filter(selected).map(specValue => specValue.specValue)
		);
	}, [specValueList]);

	const handleClick = ({
		specValue,
		specValueDisp,
		selectedFlag,
	}: SpecValue) => {
		const foundValue = specValueList.find(
			value => specValue === value.specValue
		);
		assertNotNull(foundValue);

		sendLog({
			specName: normalizedSpec.specName,
			specValueDisp,
			selected: !Flag.isTrue(selectedFlag), // toggle
		});

		setSelectedSpecValueList([specValue]);
		const isHidden = Flag.isTrue(foundValue.hiddenFlag);
		onChange({ [specCode]: [specValue] }, isHidden);
	};

	return (
		<ul className={styles.specList}>
			{specValueList.map(specValue => {
				const checked = selectedSpecValueList.includes(specValue.specValue);
				return (
					<li key={specValue.specValue} className={styles.listItem}>
						<div className={styles.spec}>
							{/* NOTE: When using next/image, app crashed due to image URLs with no http(s) or malformed URLs */}
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={specValue.specValueImageUrl}
								alt={''}
								className={styles.specImage}
							/>
						</div>
						<ul>
							<RadioButton
								className={styles.radio}
								checked={checked}
								onClick={() => handleClick(specValue)}
							>
								<span
									dangerouslySetInnerHTML={{
										__html: specValue.specValueDisp,
									}}
								/>
							</RadioButton>
						</ul>
					</li>
				);
			})}
		</ul>
	);
};

ImageListSpec.displayName = 'ImageListSpec';
