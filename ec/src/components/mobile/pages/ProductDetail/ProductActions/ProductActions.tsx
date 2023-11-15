import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './ProductActions.module.scss';
import { CadDownLoadButton } from '@/components/mobile/pages/ProductDetail/CadDownload';
import { AddToMyComponentsButton } from '@/components/mobile/pages/ProductDetail/ProductActions/AddToMyComponentsButton';
import { ProductDetailsDownloadButton } from '@/components/mobile/pages/ProductDetail/ProductDetailsDownloadButton';
import { SearchSimilarProductButton } from '@/components/mobile/pages/ProductDetail/SearchSimilarProductButton';
import { scrollIntoView } from '@/utils/scrollIntoView';

type Props = {
	isCompleted: boolean;
};

export const ProductActions: React.VFC<Props> = ({ isCompleted }) => {
	const { t } = useTranslation();

	return (
		<div className={styles.buttonContainer}>
			<div className={styles.linkButtonContainer}>
				<div
					className={classNames(styles.linkButton, {
						[String(styles.disabledLink)]: !isCompleted,
					})}
					onClick={() => scrollIntoView('configuredSpecifications')}
				>
					{t(
						'mobile.pages.productDetail.productActions.configuredSpecification'
					)}
				</div>
				<AddToMyComponentsButton className={styles.addToMyComponents} />
			</div>
			<SearchSimilarProductButton />
			<ProductDetailsDownloadButton disabled={!isCompleted} />
			<CadDownLoadButton />
		</div>
	);
};
ProductActions.displayName = 'ProductActions';
