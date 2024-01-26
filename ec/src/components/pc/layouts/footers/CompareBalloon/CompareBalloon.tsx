import { FC, MutableRefObject, useEffect } from 'react';
import styles from './CompareBalloon.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { Compare, CompareItem } from '@/models/localStorage/Compare';
import { CompareTabContent } from './CompareTabContent';
import { useCompareBalloon } from './CompareBalloon.hooks';

type Props = {
	showStatus: boolean;
	selectedItemsForCheck: MutableRefObject<Set<CompareItem>>;
	selectedActiveTab: MutableRefObject<string>;
	handleClose: () => void;
};

export const CompareBalloon: FC<Props> = ({
	showStatus,
	selectedItemsForCheck,
	selectedActiveTab,
	handleClose,
}) => {
	return (
		<>
			{showStatus && (
				<div className={styles.constrast}>
					<div className={styles.selectPopup}>
						<div className={styles.titleSection}>
							<h2>비교</h2>
						</div>

						<div className={styles.productList}>
							<div className={styles.ndrClearfix}>
								<div className={styles.productListBody}>
									<div>
										{/* list */}
										<div className={styles.tabSection}>
											{/* <OverlayLoader show={loading} /> */}
											<CompareTabContent
												selectedItemsForCheck={selectedItemsForCheck}
												selectedActiveTab={selectedActiveTab}
											/>
											{/* content */}
										</div>
									</div>
								</div>
								<div className={styles.asideBtnSection}>
									{/* 상단버튼 */}
									<div className={styles.topBtnSection}>
										<Button
											size="m"
											type="button"
											theme="conversion"
											icon="order-now"
										>
											주문
										</Button>
										<Button
											size="m"
											type="button"
											theme="conversion"
											icon="cart"
										>
											장바구니
										</Button>
										<Button
											size="m"
											type="button"
											theme="default"
											icon="add-my-component"
										>
											My 부품표
										</Button>
									</div>
								</div>
							</div>
							<div className={styles.pcpCookieGuide}>
								<p>비교 형번은 당일 이후 자동 삭제됩니다.</p>
							</div>
							<div className={styles.btnSection}>
								<Button
									size="m"
									type="button"
									theme="strong"
									icon="right-arrow"
								>
									비교결과
								</Button>
								<Button
									size="m"
									type="button"
									theme="default"
									onClick={handleClose}
								>
									닫기
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
