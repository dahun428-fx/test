import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { CategoryBrandRanking } from './CategoryBrandRanking';
import { MakerGroup } from './MakerGroup';
import styles from './MakerList.module.scss';
import { MakerNavigation, Option } from './MakerNavigation';
import { Breadcrumbs } from '@/components/pc/ui/links/Breadcrumbs';
import { PageLoader } from '@/components/pc/ui/loaders';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { ClassCode } from '@/logs/constants';
import { ectLogger } from '@/logs/ectLogger';
import { GetCategoryBrandRankingResponse } from '@/models/api/cameleer/getCategoryBrandRanking/GetCategoryBrandRankingResponse';
import { BrandGroup, getBrandBreadcrumbList } from '@/utils/domain/brand';

type Props = {
	scrollAnchorId: string;
	selectedIndexCharacter: Option;
	allBrandList: BrandGroup[];
	brandGroupList: BrandGroup[];
	categoryBrandRanking?: GetCategoryBrandRankingResponse;
	makerListLoaded: boolean;
	onSelectIndexCharacter: (option: Option) => void;
};

/** Maker list page */
export const MakerList: VFC<Props> = ({
	scrollAnchorId,
	selectedIndexCharacter,
	brandGroupList,
	allBrandList,
	categoryBrandRanking,
	makerListLoaded,
	onSelectIndexCharacter,
}) => {
	const [t] = useTranslation();
	const breadcrumbList = getBrandBreadcrumbList(t);

	const availableGroupNames = new Set(
		allBrandList.map(group => group.groupName)
	);

	useOnMounted(() => {
		ectLogger.visit({
			classCode: ClassCode.MAKER_LIST,
		});
	});

	return (
		<div className={styles.main}>
			{!makerListLoaded ? (
				<PageLoader />
			) : (
				<>
					<div className={styles.breadcrumbWrapper}>
						<Breadcrumbs breadcrumbList={breadcrumbList} />
					</div>
					<h1 className={styles.title}>
						{t('pages.maker.makerList.brandList')}
					</h1>
					<p className={styles.caption}>{t('pages.maker.makerList.caption')}</p>
					<CategoryBrandRanking categoryBrandRanking={categoryBrandRanking} />
					<div className={styles.container} id={scrollAnchorId}>
						<MakerNavigation
							possibleValues={availableGroupNames}
							selected={selectedIndexCharacter}
							onSelect={onSelectIndexCharacter}
						/>
						<MakerGroup
							brandGroupList={brandGroupList}
							selected={selectedIndexCharacter}
						/>
					</div>
				</>
			)}
		</div>
	);
};
MakerList.displayName = 'MakerList';
