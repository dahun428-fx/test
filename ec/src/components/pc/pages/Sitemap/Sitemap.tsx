import { useTranslation } from 'react-i18next';
import { BrandList } from './BrandList';
import { CategoryList } from './CategoryList';
import { Meta } from './Meta';
import styles from './Sitemap.module.scss';
import { Anchor, Link } from '@/components/pc/ui/links';
import { Breadcrumbs } from '@/components/pc/ui/links/Breadcrumbs';
import { PageLoader } from '@/components/pc/ui/loaders';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { pagesPath } from '@/utils/$path';
import { BrandGroup } from '@/utils/domain/brand';
import { url } from '@/utils/url';

type Props = {
	categoryList: Category[];
	brandGroupList: BrandGroup[];
};

export const Sitemap: React.VFC<Props> = ({ categoryList, brandGroupList }) => {
	const [t] = useTranslation();

	return (
		<>
			<Meta />
			<div className={styles.page}>
				<div className={styles.breadcrumbWrap}>
					<Breadcrumbs breadcrumbList={[{ text: t('pages.sitemap.title') }]} />
				</div>
				<div className={styles.content}>
					<div className={styles.main}>
						<div>
							<h1 className={styles.heading}>{t('pages.sitemap.title')}</h1>
							<div className={styles.topLink}>
								<Link href={pagesPath.$url()}>{t('pages.sitemap.home')}</Link>
							</div>
						</div>
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
					<div className={styles.aside}>
						<div className={styles.helpBox}>
							<div className={styles.helpBoxTitle}>
								{t('pages.sitemap.help')}
							</div>
							<ul className={styles.helpBoxContents}>
								<li className={styles.helpBoxItems}>
									<Anchor href={url.guide}>{t('pages.sitemap.guide')}</Anchor>
								</li>
								<li className={styles.helpBoxItems}>
									<Anchor href={url.faq}>{t('pages.sitemap.faq')}</Anchor>
								</li>
								<li className={styles.helpBoxItems}>
									<Anchor href={url.contactUs}>
										{t('pages.sitemap.contactUs')}
									</Anchor>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
Sitemap.displayName = 'Sitemap';
