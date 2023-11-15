import React from 'react';
import styles from './NormalProductCell.module.scss';
import { PriceLeadTime } from './PriceLeadTime';
import { Link } from '@/components/pc/ui/links';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';
import { join } from '@/utils/jsx';
import { url } from '@/utils/url';

type Props = {
	type: Series;
};

export const NormalProductCell: React.VFC<Props> = ({ type }) => {
	const { cadTypeList = [] } = type;

	return (
		<>
			<td className={styles.cadDataCell}>
				{join(
					cadTypeList.map(({ cadType, cadTypeDisp }) => (
						<Link
							key={cadType}
							href={url
								.productDetail(type.seriesCode)
								.fromKeywordSearch(type.partNumber)
								.typeList(type.partNumber, cadType)}
							target="_blank"
							onClick={event => {
								event.stopPropagation();
								ga.ecommerce.selectItem({
									...type,
									itemListName: ItemListName.KEYWORD_SEARCH_RESULT,
								});
							}}
						>
							{cadTypeDisp}
						</Link>
					)),
					' / '
				)}
			</td>
			<td className={styles.priceLeadTimeDataCell}>
				<div>
					<PriceLeadTime {...type} />
				</div>
			</td>
		</>
	);
};
NormalProductCell.displayName = 'NormalProductCell';
