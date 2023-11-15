import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PageSizeSelect.module.scss';
import { config } from '@/config';

/** Props 定義 */
export type Props = {
	pageSize: number;
	pageSizeList?: number[];
	onChange: (count: number) => void;
};

const defaultPageSizeList = config.pagination.detail.sizeList;

/**
 * PageSizeSelect component
 */
export const PageSizeSelect: VFC<Props> = ({
	pageSize,
	pageSizeList = defaultPageSizeList,
	onChange,
}) => {
	const [t] = useTranslation();

	return (
		<div className={styles.container}>
			<div className={styles.titleDescription}>
				<span>{t('components.ui.radio.displayResult')}</span>
			</div>
			<div className={styles.switchPageSizeContainer}>
				<select
					value={pageSize}
					onChange={e => onChange(Number(e.currentTarget.value))}
					className={styles.switchPageSize}
				>
					{pageSizeList.map(size => (
						<option key={size} value={size}>
							{t('components.ui.radio.item', { pageSize: size })}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};
PageSizeSelect.displayName = 'PageSizeSelect';
