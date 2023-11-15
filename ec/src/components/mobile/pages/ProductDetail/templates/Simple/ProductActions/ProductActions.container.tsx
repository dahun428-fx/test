import { ProductActions as Presenter } from './ProductActions';
import { useSelector } from '@/store/hooks';
import { selectCurrentPartNumberTotalCount } from '@/store/modules/pages/productDetail';

/** Product actions container */
export const ProductActions: React.VFC = () => {
	const totalCount = useSelector(selectCurrentPartNumberTotalCount);

	return <Presenter partNumberCount={totalCount} />;
};
