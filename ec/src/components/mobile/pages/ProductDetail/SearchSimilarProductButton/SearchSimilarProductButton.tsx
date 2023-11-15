import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SearchSimilarProductButton.module.scss';
import {
	SearchSimilarProductModal,
	Props as SearchSimilarProductModalProps,
} from './SearchSimilarProductModal';
import { Button } from '@/components/mobile/ui/buttons';
import { ModalOpener, ModalProvider } from '@/components/mobile/ui/modals';

type Props = SearchSimilarProductModalProps & {
	disabled?: boolean;
};

/**
 * Search for Similar Products Button
 */
export const SearchSimilarProductButton: React.VFC<Props> = ({
	disabled,
	...rest
}) => {
	const { t } = useTranslation();

	return (
		<ModalProvider>
			<ModalOpener className={styles.wide}>
				<Button icon="search" className={styles.button} disabled={disabled}>
					{t('mobile.pages.productDetail.searchSimilarProductButton.label')}
				</Button>
			</ModalOpener>
			<SearchSimilarProductModal {...rest} />
		</ModalProvider>
	);
};
SearchSimilarProductButton.displayName = 'SearchSimilarProductButton';
