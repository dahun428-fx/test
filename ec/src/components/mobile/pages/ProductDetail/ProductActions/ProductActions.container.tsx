import { ProductActions as Presenter } from './ProductActions';
import { Flag } from '@/models/api/Flag';
import { useSelector } from '@/store/hooks';
import {
	selectCompleteFlag,
	selectCurrentPartNumberTotalCount,
} from '@/store/modules/pages/productDetail';

export const ProductActions: React.VFC = () => {
	const totalCount = useSelector(selectCurrentPartNumberTotalCount);
	const completedFlag = useSelector(selectCompleteFlag);

	if (totalCount !== 1) {
		return null;
	}

	return <Presenter isCompleted={Flag.isTrue(completedFlag)} />;
};
