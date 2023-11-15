import { useTranslation } from 'react-i18next';
import { BrandList } from './BrandList';
import { CategoryList } from './CategoryList';
import { Meta } from './Meta';
import styles from './Sitemap.module.scss';
import { BreadcrumbsPortal } from '@/components/mobile/layouts/footers/Footer/BreadcrumbsPortal';
import { Link } from '@/components/mobile/ui/links';
import { PageLoader } from '@/components/mobile/ui/loaders';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { pagesPath } from '@/utils/$path';
import { BrandGroup } from '@/utils/domain/brand';

type Props = {
	categoryList: Category[];
	brandGroupList: BrandGroup[];
};

/**
 * Sitemap component
 */
export const Sitemap: React.VFC<Props> = ({ categoryList, brandGroupList }) => {
	const [t] = useTranslation();

	return (
		<div className={styles.container}>
			<Meta />
			<BreadcrumbsPortal
				breadcrumbList={[{ text: t('mobile.pages.sitemap.title') }]}
			/>
			<h1 className={styles.heading}>{t('mobile.pages.sitemap.title')}</h1>
			<h4 className={styles.topLink}>
				<Link href={pagesPath.$url().pathname} className={styles.link}>
					{t('mobile.pages.sitemap.home')}
				</Link>
			</h4>
			{categoryList.length > 0 ? (
				<div className={styles.section}>
					<CategoryList categoryList={categoryList} />
				</div>
			) : (
				<PageLoader />
			)}
			{brandGroupList.length > 0 && (
				<div className={styles.section}>
					<BrandList brandGroupList={brandGroupList} />
				</div>
			)}
		</div>
	);
};
Sitemap.displayName = 'Sitemap';
