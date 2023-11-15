import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useProductDetailsDownloadButton } from './ProductDetailsDownloadButton.hooks';
import styles from './ProductDetailsDownloadButton.module.scss';
import { Button } from '@/components/pc/ui/buttons/Button';

type Props = {
	disabled?: boolean;
	className?: string;
};

/**
 * ProductDetails Download Button
 */
export const ProductDetailsDownloadButton: React.VFC<Props> = ({
	disabled,
	className,
}) => {
	const [t] = useTranslation();
	const { onClick } = useProductDetailsDownloadButton();

	return (
		<div className={classNames(styles.downloadButton, className)}>
			<Button icon="download" disabled={disabled} onClick={onClick} size="max">
				{t('pages.productDetail.productDetailsDownloadButton.label')}
			</Button>
		</div>
	);
};

ProductDetailsDownloadButton.displayName = 'ProductDetailsDownloadButton';
