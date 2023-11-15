import { useTranslation } from 'react-i18next';
import { DisplayTypeSwitch } from './DisplayTypeSwitch';
import styles from './SeriesSortBar.module.scss';
import { SpecSearchDispType } from '@/models/api/constants/SpecSearchDispType';
import { SeriesSortType } from '@/models/pages/category';

type Props = {
	displayType?: SpecSearchDispType;
	exceedsThreshold?: boolean;
	sortType: SeriesSortType;
	onChangeDisplayType: () => void;
	onChangeSortType: (sort: SeriesSortType) => void;
	onClickFilterButton: () => void;
};

export const SeriesSortBar: React.VFC<Props> = ({
	displayType,
	exceedsThreshold,
	sortType,
	onChangeDisplayType,
	onChangeSortType,
	onClickFilterButton,
}) => {
	const [t] = useTranslation();

	const handleClick = (sort: SeriesSortType) => {
		if (sortType === sort) {
			return;
		}
		onChangeSortType(sort);
	};

	return (
		<>
			<div
				className={styles.container}
				data-exceed-threshold={exceedsThreshold}
			>
				<div className={styles.listWrapper}>
					<ul className={styles.list}>
						<li
							className={styles.item}
							data-aria-selected={sortType === SeriesSortType.POPULARITY}
							onClick={() => handleClick(SeriesSortType.POPULARITY)}
						>
							{t(
								'mobile.pages.category.seriesList.specSearchHeader.seriesSortBar.sortLabel.popularity'
							)}
						</li>
						<li
							className={styles.item}
							data-aria-selected={sortType === SeriesSortType.DAYS_TO_SHIP}
							onClick={() => handleClick(SeriesSortType.DAYS_TO_SHIP)}
						>
							{t(
								'mobile.pages.category.seriesList.specSearchHeader.seriesSortBar.sortLabel.daysToShip'
							)}
						</li>
						<li
							className={styles.item}
							data-aria-selected={sortType === SeriesSortType.PRICE}
							onClick={() => handleClick(SeriesSortType.PRICE)}
						>
							{t(
								'mobile.pages.category.seriesList.specSearchHeader.seriesSortBar.sortLabel.price'
							)}
						</li>
						<DisplayTypeSwitch
							displayType={displayType}
							onChange={onChangeDisplayType}
						/>
					</ul>
					{exceedsThreshold && (
						<div className={styles.buttonWrapper}>
							<button
								className={styles.filterButton}
								onClick={onClickFilterButton}
							/>
						</div>
					)}
				</div>
			</div>
			<div className={styles.sortBarPadding} />
		</>
	);
};
SeriesSortBar.displayName = 'SeriesSortBar';
