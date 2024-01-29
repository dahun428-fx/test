import { FC, MutableRefObject } from 'react';
import styles from './CompareBalloon.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { CompareItem } from '@/models/localStorage/Compare';
import { CompareTabContent } from './CompareTabContent';
import { useTranslation } from 'react-i18next';

type Props = {
	showStatus: boolean;
	selectedItemsForCheck: MutableRefObject<Set<CompareItem>>;
	selectedActiveTab: MutableRefObject<string>;
	handleClose: () => void;
};
/**
 * 비교 푸터 팝업
 */
export const CompareBalloon: FC<Props> = ({
	showStatus,
	selectedItemsForCheck,
	selectedActiveTab,
	handleClose,
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
										>
											{t('components.ui.layouts.footers.compareBalloon.order')}
										</Button>
										<Button
											size="m"
											type="button"
											theme="conversion"
											icon="cart"
										>
											{t('components.ui.layouts.footers.compareBalloon.cart')}
										</Button>
										<Button
											size="m"
											type="button"
											theme="default"
											icon="add-my-component"
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
