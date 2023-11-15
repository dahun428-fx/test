import classNames from 'classnames';
import { VFC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './SpecSearchHeader.module.scss';
import { SeriesSortBar } from '@/components/mobile/pages/Category/SeriesList/SpecSearchHeader/SeriesSortBar';
import { SpecSearchDispType } from '@/models/api/constants/SpecSearchDispType';
import { SeriesSortType } from '@/models/pages/category';

type Props = {
	categoryName: string;
	loading: boolean;
	count?: number;
	exceedsThreshold?: boolean;
	displayType?: SpecSearchDispType;
	sortType: SeriesSortType;
	onChangeDisplayType: () => void;
	onClickFilterButton: () => void;
	onChangeSortType: (sort: SeriesSortType) => void;
};

export const SpecSearchHeader: VFC<Props> = ({
	categoryName,
	loading,
	count,
	exceedsThreshold,
	displayType,
	sortType,
	onChangeDisplayType,
	onChangeSortType,
	onClickFilterButton,
}) => {
	const [t] = useTranslation();

	return (
		<>
			<div
				className={classNames(styles.container, {
					[String(styles.filterMinimizedContainer)]: exceedsThreshold,
				})}
			>
				<h1 className={styles.categoryName}>{categoryName}</h1>
				<p
					className={classNames(styles.countWrapper, {
						[String(styles.loading)]: loading,
					})}
				>
					{!loading && (
						<Trans
							i18nKey="mobile.pages.category.seriesList.specSearchHeader.totalCount"
							values={{ count: count ?? 0 }}
						>
							<span className={styles.countValue} />
						</Trans>
					)}
				</p>
				{!exceedsThreshold && (
					<div className={styles.buttonWrapper} onClick={onClickFilterButton}>
						<div className={styles.button}>
							{t(
								'mobile.pages.category.seriesList.specSearchHeader.filterProduct'
							)}
						</div>
					</div>
				)}
				<SeriesSortBar
					displayType={displayType}
					exceedsThreshold={exceedsThreshold}
					sortType={sortType}
					onChangeDisplayType={onChangeDisplayType}
					onChangeSortType={onChangeSortType}
					onClickFilterButton={onClickFilterButton}
				/>
			</div>
			<div
				className={
					exceedsThreshold
						? styles.minimizedFilterPadding
						: styles.normalFilterPadding
				}
			/>
		</>
	);
};
SpecSearchHeader.displayName = 'SeriesList';
