import React, { ReactElement } from 'react';
import { AboutMisumi } from './AboutMisumi';
import styles from './MainPanel.module.scss';
import { OpenOrderStatusLink } from './OpenOrderStatusLink';
import { OrderStatusPanel } from './OrderStatusPanel';
import type { PanelType } from '@/components/pc/pages/Home/Home.types';
import {
	RecommendCategory,
	ViewCategoryRepeatRecommend,
} from '@/components/pc/pages/Home/ViewCategoryRepeatRecommend';
import { BlockLoader } from '@/components/pc/ui/loaders';
import { notEmpty } from '@/utils/predicate';

type Props = {
	panelType: PanelType;
	recommendCategoryList: RecommendCategory[];
	hideOrderStatus: boolean;
	showsOrderStatusGuidePopup: boolean;
	onClickCloseOrderStatus: () => void;
	onClickOpenOrderStatus: () => void;
	onClickCloseOrderStatusGuidePopup: () => void;

	onClickCategory: (categoryCode: string, position?: number) => void;
	onLoadImageCategory: (categoryCode: string, position?: number) => void;
	aside: ReactElement;
};

/**
 * 中央メインパネル
 */
export const MainPanel: React.VFC<Props> = ({
	panelType,
	recommendCategoryList,
	hideOrderStatus,
	showsOrderStatusGuidePopup,
	onClickCloseOrderStatus,
	onClickOpenOrderStatus,
	onClickCloseOrderStatusGuidePopup,
	onClickCategory,
	onLoadImageCategory,
	aside,
}) => {
	return (
		<>
			<div className={styles.container}>
				<div className={styles.main}>
					{panelType === 'loading' ? (
						<BlockLoader />
					) : panelType === 'orderStatus' ? (
						<OrderStatusPanel onClickClose={onClickCloseOrderStatus} />
					) : panelType === 'category' ? (
						<ViewCategoryRepeatRecommend
							categoryList={recommendCategoryList}
							onClickCategory={onClickCategory}
							onLoadImageCategory={onLoadImageCategory}
						/>
					) : (
						<AboutMisumi />
					)}
					{hideOrderStatus && (
						<OpenOrderStatusLink
							showsPopup={showsOrderStatusGuidePopup}
							onClickLink={onClickOpenOrderStatus}
							onClickClosePopup={onClickCloseOrderStatusGuidePopup}
						/>
					)}
				</div>
				{React.cloneElement(aside, { className: styles.aside })}
			</div>
			{panelType === 'orderStatus' && notEmpty(recommendCategoryList) && (
				<div className={styles.bottom}>
					<ViewCategoryRepeatRecommend
						categoryList={recommendCategoryList}
						inline
						onClickCategory={onClickCategory}
						onLoadImageCategory={onLoadImageCategory}
					/>
				</div>
			)}
		</>
	);
};
MainPanel.displayName = 'MainPanel';
