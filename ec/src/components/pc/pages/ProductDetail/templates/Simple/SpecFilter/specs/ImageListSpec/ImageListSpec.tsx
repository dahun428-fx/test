import { useCallback, useEffect, useState } from 'react';
import styles from './ImageListSpec.module.scss';
import { SpecFrame } from '@/components/pc/pages/ProductDetail/templates/Simple/SpecFilter/specs/SpecFrame';
import { Checkbox } from '@/components/pc/pages/ProductDetail/templates/Simple/SpecFilter/specs/checkboxes';
import { Flag } from '@/models/api/Flag';
import {
	PartNumberSpec,
	SpecValue,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { assertNotNull } from '@/utils/assertions';
import { hidden, selected } from '@/utils/domain/spec';
import { useNormalizeSpec } from '@/utils/domain/spec/normalize';
import { SendLogPayload } from '@/utils/domain/spec/types';
import { removeTags } from '@/utils/string';

type SpecCode = string;
type SpecValues = string[];

type Props = {
	partNumberSpec: PartNumberSpec;
	onChange: (spec: Record<SpecCode, SpecValues>) => void;
	onSelectHiddenSpec: (selectedSpec: Record<SpecCode, string>) => void;
	sendLog: (payload: SendLogPayload) => void;
};

export const ImageListSpec: React.FC<Props> = ({
	partNumberSpec,
	onChange,
	onSelectHiddenSpec,
	sendLog,
}) => {
	const normalizedSpec = useNormalizeSpec(partNumberSpec);

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

		if (Flag.isTrue(foundValue.hiddenFlag)) {
			setSelectedSpecValueList([specValue]);
			return onSelectHiddenSpec({ [specCode]: specValue });
		}

		const newValues = [...selectedSpecValueList];

		selectedSpecValueList?.includes(specValue)
			? newValues.splice(selectedSpecValueList.indexOf(specValue), 1)
			: newValues.push(specValue);

		setSelectedSpecValueList(newValues);
		onChange({ [specCode]: newValues });
	};

	const handleClear = useCallback(() => {
		onChange({ [specCode]: [] });
	}, [onChange, specCode]);

	return (
		<SpecFrame {...normalizedSpec} onClear={handleClear}>
			<ul className={styles.specList}>
				{specValueList.map(specValue => {
					const selected = selectedSpecValueList.includes(specValue.specValue);
					return (
						<li key={specValue.specValue} className={styles.listItem}>
							<Checkbox
								checked={selected}
								weak={hidden(specValue)}
								onClick={() => handleClick(specValue)}
							>
								<div className={styles.spec}>
									{/* NOTE: When using next/image, app crashed due to image URLs with no http(s) or malformed URLs */}
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={specValue.specValueImageUrl}
										alt={removeTags(specValue.specValueDisp)}
										className={styles.specImage}
									/>
									<div
										className={styles.specText}
										dangerouslySetInnerHTML={{
											__html: specValue.specValueDisp,
										}}
									/>
								</div>
							</Checkbox>
						</li>
					);
				})}
			</ul>
		</SpecFrame>
	);
};
ImageListSpec.displayName = 'ImageListSpec';
