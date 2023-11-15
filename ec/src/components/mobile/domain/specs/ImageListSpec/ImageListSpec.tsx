import React from 'react';
import styles from './ImageListSpec.module.scss';
import { SpecFrame } from '@/components/mobile/domain/specs/SpecFrame';
import { useSpecValueSelector } from '@/components/mobile/domain/specs/specs.hooks';
import { ChangePayload } from '@/components/mobile/domain/specs/types';
import { PartNumberSpec } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SeriesSpec } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { removeTags } from '@/utils/string';

type Props = {
	spec: PartNumberSpec | SeriesSpec;
	onChange: (payload: ChangePayload) => void;
};

export const ImageListSpec: React.VFC<Props> = ({ spec, onChange }) => {
	const { normalizedSpec, selectedValues, onClick, onClear } =
		useSpecValueSelector({ spec, onChange });

	return (
		<SpecFrame {...normalizedSpec} onClear={onClear}>
			<ul
				className={styles.candidates}
				data-view-type={normalizedSpec.specViewType}
			>
				{normalizedSpec.specValueList.map(value => (
					<li
						key={value.specValue}
						className={styles.candidate}
						role="checkbox"
						aria-checked={selectedValues.includes(value.specValue)}
						onClick={() => onClick(value)}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={value.specValueImageUrl}
							alt={removeTags(value.specValueDisp)}
							width={54}
						/>
						<p
							className={styles.valueDisp}
							dangerouslySetInnerHTML={{ __html: value.specValueDisp }}
						/>
					</li>
				))}
			</ul>
		</SpecFrame>
	);
};
ImageListSpec.displayName = 'ImageListSpec';
