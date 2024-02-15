import { FC, MutableRefObject } from 'react';
import styles from './CompareBalloon.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { CompareItem } from '@/models/localStorage/Compare';
import { CompareTabContent } from './CompareTabContent';
import { useTranslation } from 'react-i18next';
import { BlockLoader, PageLoader } from '@/components/pc/ui/loaders';

type Props = {
	loading: boolean;
	showStatus: boolean;
	selectedItemsForCheck: MutableRefObject<Set<CompareItem>>;
	selectedActiveTab: MutableRefObject<string>;
	handleClose: () => void;
	onClickOrderNow: () => void;
	addToCart: () => void;
	addToMyComponents: () => void;
	openCompareDetailPage: () => void;
};
/**
 * 비교 푸터 팝업
 */
export const CompareBalloon: FC<Props> = ({
	loading,
	showStatus,
	selectedItemsForCheck,
	selectedActiveTab,
	handleClose,
	onClickOrderNow,
	addToCart,
	addToMyComponents,
	openCompareDetailPage,
}) => {
	const [t] = useTranslation();

	return (
		<>
			{showStatus && (
				<div className={styles.constrast}>
					<div className={styles.selectPopup}>
						<div className={styles.titleSection}>
							<h2>{t('components.ui.layouts.footers.compareBalloon.title')}</h2>
						</div>

						<div className={styles.productList}>
							<div className={styles.ndrClearfix}>
								<div className={styles.productListBody}>
									<div>
										<div className={styles.tabSection}>
											<CompareTabContent
												loading={loading}
												selectedItemsForCheck={selectedItemsForCheck}
												selectedActiveTab={selectedActiveTab}
											/>
										</div>
									</div>
								</div>
								<div className={styles.asideBtnSection}>
									<div className={styles.topBtnSection}>
										<Button
											size="m"
											type="button"
											theme="conversion"
											icon="order-now"
											onClick={onClickOrderNow}
										>
											{t('components.ui.layouts.footers.compareBalloon.order')}
										</Button>
										<Button
											size="m"
											type="button"
											theme="conversion"
											icon="cart"
											onClick={addToCart}
										>
											{t('components.ui.layouts.footers.compareBalloon.cart')}
										</Button>
										<Button
											size="m"
											type="button"
											theme="default"
											icon="add-my-component"
											onClick={addToMyComponents}
										>
											{t(
												'components.ui.layouts.footers.compareBalloon.myComponent'
											)}
										</Button>
									</div>
								</div>
							</div>
							<div className={styles.pcpCookieGuide}>
								<p>{t('components.ui.layouts.footers.compareBalloon.guide')}</p>
							</div>
							<div className={styles.btnSection}>
								<Button
									size="m"
									type="button"
									theme="strong"
									icon="right-arrow"
									onClick={openCompareDetailPage}
								>
									{t(
										'components.ui.layouts.footers.compareBalloon.compareResult'
									)}
								</Button>
								<Button
									size="m"
									type="button"
									theme="default"
									onClick={handleClose}
								>
									{t('components.ui.layouts.footers.compareBalloon.close')}
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

CompareBalloon.displayName = 'CompareBalloon';
