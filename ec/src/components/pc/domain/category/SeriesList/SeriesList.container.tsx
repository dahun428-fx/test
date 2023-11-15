import { VFC } from 'react';
import { SeriesList as Presenter } from './SeriesList';
import { useSpecSearchContext } from '@/components/pc/domain/category/context';
import { Option } from '@/components/pc/ui/controls/select/DisplayTypeSwitch';
import { useSelector } from '@/store/hooks';
import { selectSeriesResponse } from '@/store/modules/pages/category';

type Props = {
	stickyBottomSelector: string;
	categoryCode: string;
	categoryMainSelector: string;
};

/** Series list container */
export const SeriesList: VFC<Props> = ({
	stickyBottomSelector,
	categoryCode,
	categoryMainSelector,
}) => {
	const seriesResponse = useSelector(selectSeriesResponse);
	const {
		currentPage,
		loading,
		pageSize,
		daysToShip,
		sortType,
		isShowDaysToShipSelect,
		onChangePageSize,
		onChangePage,
		onChangeDaysToShip,
		onChangeSortType,
	} = useSpecSearchContext();

	const { defaultDisplayType, onChangeDisplayType } = useSpecSearchContext();

	const scrollToSeriesTop = () => {
		const element = document.querySelector(categoryMainSelector) as HTMLElement;
		if (element && document.documentElement.scrollTop > element.offsetTop) {
			document.documentElement.scrollTop = element.offsetTop;
		}
	};

	const handleChangePage = (page: number) => {
		onChangePage(page);
		scrollToSeriesTop();
	};

	const handleChangeDisplayType = (displayType: Option) => {
		onChangeDisplayType(displayType);
		scrollToSeriesTop();
	};

	if (!seriesResponse) {
		return null;
	}

	return (
		<Presenter
			{...{
				categoryCode,
				seriesResponse,
				stickyBottomSelector,
				pageSize,
				page: currentPage,
				isShowDaysToShipSelect,
				daysToShip,
				sortType,
				loading,
				defaultDisplayType,
				onChangeDisplayType: handleChangeDisplayType,
				onChangePageSize,
				onChangePage: handleChangePage,
				onChangeDaysToShip,
				onChangeSortType,
			}}
		/>
	);
};
