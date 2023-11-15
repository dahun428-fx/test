import React from 'react';
import { ProductHtml as Presenter } from './ProductHtml';
import { useSelector } from '@/store/hooks';
import { selectWysiwygList } from '@/store/modules/pages/productDetail';

export const ProductHtml: React.VFC = () => {
	const wysiwygList = useSelector(selectWysiwygList);

	if (wysiwygList.length === 0) {
		return null;
	}

	return <Presenter wysiwygList={wysiwygList} />;
};
ProductHtml.displayName = 'ProductHtml';
