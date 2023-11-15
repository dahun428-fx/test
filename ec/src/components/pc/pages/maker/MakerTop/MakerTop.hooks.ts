import { useDispatch } from 'react-redux';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { SearchBrandResponse } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { loadOperation } from '@/store/modules/pages/category/operations';

type MakerTopResponse = {
	brandResponse: SearchBrandResponse;
	categoryResponse: SearchCategoryResponse;
};

/** Maker top hook */
export const useMakerTop = ({
	brandResponse,
	categoryResponse,
}: MakerTopResponse) => {
	const dispatch = useDispatch();

	useOnMounted(() => {
		loadOperation(dispatch)({
			brandResponse,
			categoryResponse,
		});
	});
};
