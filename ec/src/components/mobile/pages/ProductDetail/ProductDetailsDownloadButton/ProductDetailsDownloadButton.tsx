import React from 'react';
import { useTranslation } from 'react-i18next';
import { useProductDetailsDownloadButton } from './ProductDetailsDownloadButton.hooks';
import { Button } from '@/components/mobile/ui/buttons/Button';

type Props = {
	disabled?: boolean;
};

/**
 * ProductDetails Download Button
 */
export const ProductDetailsDownloadButton: React.VFC<Props> = ({
	disabled,
}) => {
	const [t] = useTranslation();
	const { onClick } = useProductDetailsDownloadButton();

	return (
		<Button icon="download" disabled={disabled} onClick={onClick} size="max">
			{t('mobile.pages.productDetail.productDetailsDownloadButton.label')}
		</Button>
	);
};

ProductDetailsDownloadButton.displayName = 'ProductDetailsDownloadButton';
