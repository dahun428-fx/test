import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicSpec } from './ConfiguredSpecifications.container';
import styles from './ConfiguredSpecifications.module.scss';
import { useBoolState } from '@/hooks/state/useBoolState';

type Props = {
	specList: BasicSpec[];
	className?: string;
};

/** Initial visible specs length in landing */
const INITIAL_VISIBLE_ROW = 6;

export const ConfiguredSpecifications: React.VFC<Props> = ({
	specList,
	className,
}) => {
	const { t } = useTranslation();
	const { bool: expanded, toggle } = useBoolState(false);

	const visibleSpecList: BasicSpec[] = useMemo(() => {
		return expanded ? specList : specList.slice(0, INITIAL_VISIBLE_ROW);
	}, [expanded, specList]);

	return (
		<div className={className} id="configuredSpecifications">
			<h2 className={styles.heading}>
				{t('mobile.pages.productDetail.configuredSpecifications.title')}
			</h2>
			<table className={styles.specTable}>
				<colgroup>
					<col width="50%" />
					<col width="50%" />
				</colgroup>
				<tbody>
					{visibleSpecList.map((spec, index) => (
						<tr key={index}>
							<th
								className={styles.specName}
								dangerouslySetInnerHTML={{ __html: spec.specName }}
							/>
							<td
								className={styles.specValue}
								dangerouslySetInnerHTML={{ __html: spec.specValueDisp }}
							/>
						</tr>
					))}
				</tbody>
			</table>
			{specList.length > INITIAL_VISIBLE_ROW && (
				<div className={styles.accordionWrapper}>
					<span
						className={expanded ? styles.expanded : styles.collapsed}
						onClick={toggle}
					>
						{t(
							expanded
								? 'mobile.pages.productDetail.configuredSpecifications.showLess'
								: 'mobile.pages.productDetail.configuredSpecifications.showMore'
						)}
					</span>
				</div>
			)}
		</div>
	);
};
ConfiguredSpecifications.displayName = 'ConfiguredSpecifications';
