import classNames from 'classnames';
import React from 'react';
import styles from './PartNumberTypeList.module.scss';
import { ProductItem } from './ProductItem';
import { Option as DisplayTypeOption } from '@/components/mobile/ui/controls/select/DisplayTypeSwitch';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';

type Props = {
	displayType: DisplayTypeOption;
	typeList: Series[];
	currencyCode?: string;
	keyword: string;
	onClick: (rowIndex: number) => void;
	onClickAlternativeLink: (href: string, index: number) => void;
};

/**
 * Part Number Type List component
 */
export const PartNumberTypeList: React.VFC<Props> = ({
	displayType,
	typeList,
	currencyCode,
	keyword,
	onClick,
	onClickAlternativeLink,
}) => {
	return (
		<ul
			className={classNames(styles.partNumberTypeList, {
				[String(styles.horizontalList)]:
					displayType === DisplayTypeOption.PHOTO,
			})}
		>
			{typeList.map((series, index) => {
				return (
					<ProductItem
						key={index}
						series={series}
						currencyCode={currencyCode}
						displayType={displayType}
						keyword={keyword}
						index={index}
						onClick={onClick}
						onClickAlternativeLink={onClickAlternativeLink}
					/>
				);
			})}
		</ul>
	);
};

PartNumberTypeList.displayName = 'PartNumberTypeList';
