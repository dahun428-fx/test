import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { BrandList as Presenter } from './BrandList';
import { ectLogger } from '@/logs/ectLogger';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { useSelector } from '@/store/hooks';
import { selectBrandList } from '@/store/modules/pages/keywordSearch';
import { getOneParams } from '@/utils/query';
import { url } from '@/utils/url';

type Props = {
	className?: string;
	keyword: string;
};

/**
 * Brand list container
 * WARN: Experimental. Violates development rules. Container implementation is forbidden, implement with hooks.
 */
export const BrandList: React.VFC<Props> = ({ className, keyword }) => {
	const brandList = useSelector(selectBrandList);
	const router = useRouter();
	const { isReSearch } = getOneParams(router.query, 'isReSearch');

	const handleClick = useCallback(
		(index: number, brand: Pick<Brand, 'brandCode' | 'brandUrlCode'>) => {
			ectLogger.searchResult.clickBrandLink({
				keyword,
				isReSearch,
				forwardPageUrlDispNo: String(index + 1),
				forwardPageUrl: url.brand(brand).fromKeywordSearch(keyword),
			});
		},
		[isReSearch, keyword]
	);

	return (
		<Presenter
			className={className}
			onClick={handleClick}
			keyword={keyword}
			brandList={brandList}
		/>
	);
};
BrandList.displayName = 'BrandList';
