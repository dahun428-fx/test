import { useMemo, useState, VFC } from 'react';
import { MakerList as Presenter } from './MakerList';
import { ALL_VALUE, Option } from './MakerNavigation';
import { Meta } from './Meta';
import { getCategoryBrandRanking } from '@/api/services/cameleer/getCategoryBrandRanking';
import { searchBrand } from '@/api/services/searchBrand';
import { config } from '@/config';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { GetCategoryBrandRankingRequest } from '@/models/api/cameleer/getCategoryBrandRanking/GetCategoryBrandRankingRequest';
import { GetCategoryBrandRankingResponse } from '@/models/api/cameleer/getCategoryBrandRanking/GetCategoryBrandRankingResponse';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { Cookie, getCookie } from '@/utils/cookie';
import { getBrandGroupList } from '@/utils/domain/brand';
import { scrollIntoView } from '@/utils/scrollIntoView';
import { uuidv4 } from '@/utils/uuid';

/** Maker list container */
export const MakerList: VFC = () => {
	const [brandList, setBrandList] = useState<Brand[]>([]);
	const [selectedIndexCharacter, setSelectedIndexCharacter] =
		useState<Option>(ALL_VALUE);
	const [brandListLoaded, setBrandListLoaded] = useState<boolean>(false);
	const [categoryBrandRankingLoaded, setCategoryBrandRankingLoaded] =
		useState<boolean>(false);

	const [categoryBrandRanking, setCategoryBrandRanking] =
		useState<GetCategoryBrandRankingResponse>();

	// NOTE: Using uuid to avoid duplicated id in DOM
	const scrollAnchorId = `scrollAnchor-${uuidv4()}`;

	const allBrandList = useMemo(() => {
		const brandGroupList = getBrandGroupList({
			brandList,
			brandCodeList: brandList.map(brand => brand.brandCode),
		});
		return brandGroupList;
	}, [brandList]);

	const brandGroupList = useMemo(() => {
		if (selectedIndexCharacter === ALL_VALUE) {
			return allBrandList;
		}

		return allBrandList.filter(
			brandGroup => brandGroup.groupName === selectedIndexCharacter
		);
	}, [allBrandList, selectedIndexCharacter]);

	const getAllBrandList = async () => {
		try {
			const requestData = {
				sort: '1',
				page: 1,
				pageSize: 0,
			};
			const brandResponse = await searchBrand(requestData);
			setBrandList(brandResponse.brandList);
			setBrandListLoaded(true);
		} catch (error) {
			setBrandListLoaded(true);
		}
	};

	const getCategoryBrandRankingInfo = async () => {
		try {
			const request: GetCategoryBrandRankingRequest = {
				subsidiary: config.subsidiaryCode,
				// FIXME: Confirm cookie VONA_COMMON_LOG_KEY is it necessary or not?
				x: getCookie(Cookie.VONA_COMMON_LOG_KEY) ?? '',
				dispPage: 'mctop',
			};

			const categoryBrandRankingResponse = await getCategoryBrandRanking(
				request
			);
			setCategoryBrandRanking(categoryBrandRankingResponse);
			setCategoryBrandRankingLoaded(true);
		} catch (error) {
			setCategoryBrandRankingLoaded(true);
		}
	};

	const handleSelectIndexCharacter = (option: Option) => {
		setSelectedIndexCharacter(option);
		scrollIntoView(scrollAnchorId);
	};

	useOnMounted(() => {
		getAllBrandList().then();
		getCategoryBrandRankingInfo().then();
		aa.pageView.maker.list().then();
		ga.pageView.maker.list().then();
	});

	return (
		<>
			<Meta />
			<div>
				<Presenter
					scrollAnchorId={scrollAnchorId}
					allBrandList={allBrandList}
					brandGroupList={brandGroupList}
					categoryBrandRanking={categoryBrandRanking}
					selectedIndexCharacter={selectedIndexCharacter}
					makerListLoaded={brandListLoaded && categoryBrandRankingLoaded}
					onSelectIndexCharacter={handleSelectIndexCharacter}
				/>
			</div>
		</>
	);
};
MakerList.displayName = 'MakerList';
