import NextLink from 'next/link';
import styles from './StandardSpec.module.scss';
import { stringifyBasicSpecValue } from '@/utils/domain/spec';
import { url } from '@/utils/url';

type Props = {
	specCode?: string;
	specType: string;
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
	categoryCodeList,
	searchCategoryCode,
}) => {
	// TODO: specType 定数化
	const shouldLink =
		specCode != null &&
		specValueDisp != null &&
		specType === '1' &&
		!isNumber(specValueDisp);

	let categoryCodeListCopy = [...categoryCodeList];
	if (searchCategoryCode) {
		const searchCategoryCodeIndex =
			categoryCodeList.indexOf(searchCategoryCode);
		if (searchCategoryCodeIndex > 0) {
			categoryCodeListCopy = categoryCodeList.slice(
				0,
				searchCategoryCodeIndex + 1
			);
		}
	}

	return shouldLink ? (
		<NextLink
			href={url.category(...categoryCodeListCopy).fromProductDetail({
				CategorySpec: stringifyBasicSpecValue({ specCode, specValue }),
			})}
		>
			<a
				className={styles.link}
				target="_blank"
				dangerouslySetInnerHTML={{ __html: specValueDisp }}
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
