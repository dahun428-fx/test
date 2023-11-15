import { useTranslation } from 'react-i18next';
import styles from './SearchSimilarProductButton.module.scss';
import { SearchSimilarProductModal } from './SearchSimilarProductModal';
import { Button } from '@/components/pc/ui/buttons';
import { ModalOpener, ModalProvider } from '@/components/pc/ui/modals';
import {
	PartNumberSpecValue,
	Spec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';

type Props = {
	partNumber: string;
	categoryName?: string;
	categoryCodeList: string[];
	seriesCode: string;
	brandCode: string;
	innerCode?: string;
	similarSpecList: (Spec & PartNumberSpecValue)[];
};

/**
 * Search for Similar Products Button
 */
export const SearchSimilarProductButton: React.VFC<Props> = ({
	similarSpecList,
	...rest
}) => {
	const { t } = useTranslation();

	// If no part number specs, not show button.
	if (!similarSpecList.length) {
		return null;
	}

	return (
		<ModalProvider>
			<ModalOpener className={styles.wide}>
				<Button
					type="button"
					theme="default-sub"
					size="m"
					icon="similar-search"
				>
					{t('pages.productDetail.searchSimilarProductButton.label')}
				</Button>
			</ModalOpener>
			<SearchSimilarProductModal specList={similarSpecList} {...rest} />
		</ModalProvider>
	);
};
SearchSimilarProductButton.displayName = 'SearchSimilarProductButton';
