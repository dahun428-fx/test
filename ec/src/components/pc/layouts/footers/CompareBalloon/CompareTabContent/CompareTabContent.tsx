import { FC } from 'react';
import styles from '../CompareBalloon.module.scss';
import classNames from 'classnames';
import { Compare, CompareItem } from '@/models/localStorage/Compare';

type Props = {
	compare: Compare;
	tabHeads: string[];
	tabContents: CompareItem[];
	activeCategoryCode: string | undefined;
	onClick: (categoryCode: string) => void;
};

export const CompareTabContent: FC<Props> = ({
	compare,
	tabHeads,
	tabContents,
	activeCategoryCode,
	onClick,
}) => {
	console.log('contents ====> ', tabContents);

	const getCategoryName = (categoryCode: string) => {
		return (
			compare.items.find(item => item.categoryCode === categoryCode)
				?.categoryName || ''
		);
	};
	return (
		<div>
			<div className={styles.tabHead}>
				{tabHeads &&
					tabHeads.length > 0 &&
					tabHeads.map((categoryCode, index) => {
						return (
							<div
								key={categoryCode}
								className={classNames(
									styles.tabHeadItem,
									categoryCode === activeCategoryCode ? styles.on : ''
								)}
								onClick={() => onClick(categoryCode)}
							>
								<div className={styles.closeBtn}>닫기버튼</div>
								<p
									className={classNames(
										styles.name,
										styles.ndrBold,
										styles.ndrEllipsis
									)}
								>
									{getCategoryName(categoryCode)}
								</p>
							</div>
						);
					})}
			</div>
			<div className={styles.tabContentItem}>
				<div className={classNames(styles.pcpInfo, styles.ndrClearfix)}>
					<div className={styles.left}>
						<p>
							총 <span></span>건
						</p>
						<p>
							| <span></span>건 선택
						</p>
					</div>
					<div className={styles.right}>
						<p>삭제</p>
						<p>|</p>
						<p>
							<a>전체선택</a>
						</p>
					</div>
				</div>
				<div className={styles.pcpItemSection}>
					<div className={styles.pcpBlankItemWrap}>
						<div className={styles.pcpBlankItem}></div>
						<div className={styles.pcpBlankItem}></div>
						<div className={styles.pcpBlankItem}></div>
						<div className={styles.pcpBlankItem}></div>
						<div className={styles.pcpBlankItem}></div>
					</div>
					{/* <p>데이터가 없습니다.</p> */}
					<ul>
						<li className={styles.pcpItem}>
							<div className={styles.pcpCloseBtn}></div>
							<div className={styles.pcpItemTitle}>
								<p className={styles.ndrBold}>제목</p>
							</div>
							<p className={classNames(styles.ndrEllipsis, styles.ndrThin)}>
								브랜드이름
							</p>
							<div className={styles.pcpItemImg}>
								<span></span>
							</div>
							<div
								className={classNames(styles.pcpModelName, styles.pcpNewWindow)}
							>
								<a>
									<p className={styles.ndrThin}>형번</p>
								</a>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

CompareTabContent.displayName = 'CompareTabContent';
