import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from '@/store/hooks';
import {
	loadOperation,
	selectTemplateType,
} from '@/store/modules/pages/productDetail';

/** Product detail hook */
export const useProductDetail = () => {
	const templateType = useSelector(selectTemplateType);
	const dispatch = useDispatch();

	const load = useMemo(() => loadOperation(dispatch), [dispatch]);

	return { templateType, load };
};
