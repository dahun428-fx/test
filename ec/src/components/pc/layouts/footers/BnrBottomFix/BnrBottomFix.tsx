import React from 'react';
import styles from './BnrBottomFix.module.scss';
import classNames from 'classnames';

export const BnrBottomFix: React.FC = () => {
	return (
		<>
			<div className={classNames(styles.wrap, styles.show)}>
				<div className={styles.content}>
					<div className={styles.left}>
						<ul>
							<li>
								<a>
									<span className={styles.iconCad}>
										CAD 다운로드<span className={styles.iconCadNumber}>0</span>
									</span>
								</a>
							</li>
							<li>
								<a>
									<span className={styles.iconCompare}>
										비교하기<span className={styles.iconCadNumber}>0</span>
									</span>
								</a>
							</li>
							<li>
								<a>
									<span className={styles.iconOrder}>견적주문내역</span>
								</a>
							</li>
							<li>
								<a>
									<span className={styles.iconItem}>My 부품표</span>
								</a>
							</li>
							<li>
								<a>
									<span className={styles.iconTech}>기술정보</span>
								</a>
							</li>
							<li>
								<a className={styles.iconCadHistory}>
									<span className={styles.iconDesign}>도면이력조회</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<button type="button" className={classNames(styles.fold, styles.active)}>
				하단고정바 접기
			</button>
			<button type="button" className={styles.unfold}>
				하단고정바 펼치기
			</button>
		</>
	);
};

BnrBottomFix.displayName = 'BnrBottomFix';
