import React, { VFC } from 'react';
import { CadDownloadButton } from './CadDownloadButton';
import { PartNumberForm } from './PartNumberForm';
import styles from './PartNumberInputHeader.module.scss';
import { ProductDetailsDownloadButton } from '@/components/pc/pages/ProductDetail/ProductDetailsDownloadButton';

type Props = {
	seriesCode: string;
	partNumber?: string;
};

/**
 * Part number input header
 * Part number Header used only in Wysiwyg and PatternH
 */
export const PartNumberInputHeader: VFC<Props> = ({
	seriesCode,
	partNumber,
}) => {
	return (
		<div className={styles.wrapper}>
			<PartNumberForm seriesCode={seriesCode} partNumber={partNumber} />
			<div className={styles.aside}>
				<ProductDetailsDownloadButton disabled />
				<CadDownloadButton />
			</div>
		</div>
	);
};

PartNumberInputHeader.displayName = 'PartNumberInputHeader';
