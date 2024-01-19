import { FC } from 'react';
import styles from './CompareBalloon.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { useBoolState } from '@/hooks/state/useBoolState';
import { CompareTabHeadItem } from './CompareTabHeadItem';

export const CompareBalloon: FC = () => {
	const dummy = [
		{
			categoryCode: 'M0101000000',
			seriesCode: '110302634310',
			partNumber: 'PSFG6-20',
			categoryCode1: 'M0100000000',
			categoryName1: '직동 부품',
			categoryCode2: 'M0101000000',
			categoryName2: '리니어 샤프트',
			categoryCode3: 'other',
			categoryName3: 'other',
			categoryCode4: 'other',
			categoryName4: 'other',
			categoryCode5: 'other',
			categoryName5: 'other',
			expire: 'Fri, 19 Jan 2024 15:00:00 GMT',
		},
		{
			categoryCode: 'M0101000000',
			seriesCode: '110302634310',
			partNumber: 'PSFG6-40',
			categoryCode1: 'M0100000000',
			categoryName1: '직동 부품',
			categoryCode2: 'M0101000000',
			categoryName2: '리니어 샤프트',
			categoryCode3: 'other',
			categoryName3: 'other',
			categoryCode4: 'other',
			categoryName4: 'other',
			categoryCode5: 'other',
			categoryName5: 'other',
			expire: 'Fri, 19 Jan 2024 15:00:00 GMT',
		},
		{
			categoryCode: 'K0703060000',
			seriesCode: '110200094770',
			partNumber: 'TPV20-5',
			categoryCode1: 'K0700000000',
			categoryName1: '가이드/이젝터 가이드',
			categoryCode2: 'K0703000000',
			categoryName2: '위치결정 부품',
			categoryCode3: 'K0703060000',
			categoryName3: '테이퍼핀 세트',
			categoryCode4: 'other',
			categoryName4: 'other',
			categoryCode5: 'other',
			categoryName5: 'other',
			expire: 'Fri, 19 Jan 2024 15:00:00 GMT',
		},
	];

	const [loading, startToLoading, endLoading] = useBoolState(false);

	return (
		<div className={styles.constrast}>
			<div className={styles.selectPopup}>
				<div className={styles.titleSection}>
					<h2>비교</h2>
				</div>
				<div className={styles.productList}>
					<div className={styles.clearfix}>
						<div className={styles.productListBody}>
							<div>
								{/* list */}
								<div className={styles.tabSection}>
									<div className={styles.tabHead}>
										{dummy &&
											dummy.length > 0 &&
											dummy.map((item, index) => {
												return (
													<CompareTabHeadItem
														categoryName={item.categoryName2}
													/>
												);
											})}
									</div>
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
								<Button size="m" type="button" theme="conversion" icon="cart">
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
							{/* loading... */}
							<div className={styles.loading}>
								<div className={styles.loadingBg}></div>
								<div className={styles.loadingImage}></div>
								<div className={styles.loadingText}>잠시 기다려 주십시오.</div>
							</div>
						</div>
					</div>
					<div className={styles.cookieGuid}>
						<p>비교 형번은 당일 이후 자동 삭제됩니다.</p>
					</div>
					<div className={styles.btnSection}>
						<Button size="m" type="button" theme="strong" icon="right-arrow">
							비교결과
						</Button>
						<Button size="m" type="button" theme="default">
							닫기
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

CompareBalloon.displayName = 'CompareBalloon';
