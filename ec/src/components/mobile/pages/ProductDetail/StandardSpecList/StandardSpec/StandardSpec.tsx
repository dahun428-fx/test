import NextLink from 'next/link';
import { useMemo } from 'react';
import styles from './StandardSpec.module.scss';
import { SpecType } from '@/models/api/constants/SpecType';
import { stringifyBasicSpecValue } from '@/utils/domain/spec';
import { url } from '@/utils/url';

type Props = {
	specCode?: string;
	specType?: string;
	specValue?: string;
	specValueDisp?: string;
	categoryCodeList: string[];
	searchCategoryCode?: string;
};

/**
 * Spec value in basic Specifications section
 * - 基本情報スペックに表示するスペック値
 */
export const StandardSpec: React.VFC<Props> = ({
	specCode,
	specType,
	specValue,
	specValueDisp,
	categoryCodeList: rawCategoryCodeList,
	searchCategoryCode,
}) => {
	const shouldLink =
		specCode != null &&
		specValueDisp != null &&
		specType === SpecType.C &&
		!isNumber(specValueDisp);

	const categoryCodeList = useMemo(() => {
		if (searchCategoryCode) {
			const index = rawCategoryCodeList.indexOf(searchCategoryCode);
			if (index > 0) {
				return rawCategoryCodeList.slice(0, index + 1);
			}
		}
		return rawCategoryCodeList;
	}, [rawCategoryCodeList, searchCategoryCode]);

	return shouldLink ? (
		<NextLink
			href={url.category(...categoryCodeList).fromProductDetail({
				CategorySpec: stringifyBasicSpecValue({ specCode, specValue }),
			})}
		>
			<a
				className={styles.link}
				dangerouslySetInnerHTML={{ __html: specValueDisp ?? '' }}
			/>
		</NextLink>
	) : (
		// NOTE: In some case, there are html tags on spec value
		<div dangerouslySetInnerHTML={{ __html: specValueDisp ?? '' }} />
	);
};
StandardSpec.displayName = 'StandardSpec';

const isNumber = (specValueDisp: string) =>
	!!specValueDisp.match(/^[\-]?([1-9]\d*|0)(\.\d+)?$/);
