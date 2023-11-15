import classNames from 'classnames';
import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CenterSpec.module.scss';
import { SeriesSpec } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { isNumericString, notHidden } from '@/utils/domain/spec';
import { removeTags } from '@/utils/string';

type Props = {
	spec: SeriesSpec;
	checkedSpecValues: string[];
	hasCategorySpecParam: boolean;
	onSelectSpec: (specValue: string) => void;
	onClear: () => void;
};

/** Center spec component */
export const CenterSpec: VFC<Props> = ({
	spec,
	checkedSpecValues,
	hasCategorySpecParam,
	onSelectSpec,
	onClear,
}) => {
	const [t] = useTranslation();

	return (
		<div className={styles.container}>
			<div className={styles.titleWrap}>
				<h2 className={styles.title}>{spec.specName}</h2>
				{checkedSpecValues.length > 0 && (
					<div className={styles.clearButton} onClick={onClear}>
						{t('components.domain.category.centerSpec.clear')}
					</div>
				)}
			</div>
			<ul className={styles.specList}>
				{spec.specValueList.filter(notHidden).map(specItem => {
					const isDisplayLink =
						!hasCategorySpecParam || isNumericString(specItem.specValueDisp);

					return (
						<li
							key={specItem.specValue}
							className={classNames(
								styles.specItem,
								styles.checkboxDefault,
								checkedSpecValues.includes(specItem.specValue)
									? styles.checked
									: styles.unChecked
							)}
							onClick={() => onSelectSpec(specItem.specValue)}
						>
							<div className={styles.imageWrapper}>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={specItem.specValueImageUrl}
									alt={removeTags(specItem.specValueDisp)}
									className={styles.image}
								/>
							</div>
							<div className={styles.specName}>
								{isDisplayLink ? (
									<a
										className={styles.link}
										href={`?CategorySpec=${encodeURIComponent(
											`${spec.specCode}::${specItem.specValue}`
										)}`}
										onClick={event => {
											event.preventDefault();
										}}
										dangerouslySetInnerHTML={{ __html: specItem.specValueDisp }}
									/>
								) : (
									<span
										dangerouslySetInnerHTML={{ __html: specItem.specValueDisp }}
									/>
								)}
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
};
CenterSpec.displayName = 'CenterSpec';
