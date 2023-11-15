import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SpecTable.module.scss';
import { ComparisonSpecValue } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { Spec } from '@/models/api/msm/ect/series/shared';
import { keyBy } from '@/utils/collection';
import { getSpecName } from '@/utils/domain/spec';

type Props = {
	specList: Spec[];
	comparisonSpecValueList: ComparisonSpecValue[];
};

const MAX_SPEC_COUNT = 9;

/** Spec table component */
export const SpecTable: FC<Props> = ({ specList, comparisonSpecValueList }) => {
	const [t] = useTranslation();

	const specValueByCode = useMemo(() => {
		return keyBy(comparisonSpecValueList, 'specCode');
	}, [comparisonSpecValueList]);

	return (
		<table className={styles.table}>
			<thead>
				<tr>
					{specList.slice(0, MAX_SPEC_COUNT).map(spec => {
						return (
							<th key={spec.specCode} className={styles.headerCell}>
								<span
									className={styles.cellContent}
									dangerouslySetInnerHTML={{ __html: getSpecName(spec) }}
								/>
							</th>
						);
					})}
				</tr>
			</thead>
			<tbody>
				<tr>
					{specList.slice(0, MAX_SPEC_COUNT).map(spec => {
						const specValueDisp = specValueByCode[spec.specCode]?.specValueDisp;
						return (
							<td key={spec.specCode} className={styles.bodyCell}>
								{specValueDisp ? (
									<span
										className={styles.cellContent}
										dangerouslySetInnerHTML={{
											__html: specValueDisp,
										}}
									/>
								) : (
									<span className={styles.cellContent}>
										{t('components.domain.category.seriesList.specTable.void')}
									</span>
								)}
							</td>
						);
					})}
				</tr>
			</tbody>
		</table>
	);
};

SpecTable.displayName = 'SpecTable';
