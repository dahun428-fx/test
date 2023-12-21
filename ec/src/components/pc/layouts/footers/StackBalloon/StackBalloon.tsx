import React from 'react';
import { useStackBalloon } from './StackBalloon.hooks';
import styles from './StackBalloon.module.scss';
import { StackBalloonItems } from './StackBallonItem';
import { stackList } from './dummy';
import { CadDownloadStatus } from '@/models/localStorage/CadDownloadStack_origin';

export const StackBalloon: React.FC = () => {
	const {
		stackShowStatus,
		stackTabStatus,
		setStackShowStatus,
		setStackTabDone,
		checkedDoneCad,
		checkedPendingCad,
		handleSelectPendingCad,
		handleSelectDoneCad,
	} = useStackBalloon();

	return (
		<div>
			{stackShowStatus && (
				<div className={styles.wrapper}>
					<div className={styles.balloonBox}>
						<div className={styles.balloonBoxInner}>
							<div>
								<h3 className={styles.h3}>CAD 다운로드</h3>
								<div className={styles.tab}>
									<ul>
										<li onClick={() => setStackTabDone(false)}>
											<a className={!stackTabStatus ? styles.on : ''}>
												다운로드 대기
											</a>
										</li>
										<li onClick={() => setStackTabDone(true)}>
											<a className={!stackTabStatus ? '' : styles.on}>
												다운로드 완료
											</a>
										</li>
									</ul>
								</div>
								<div className={styles.listArea}>
									<div className={styles.info}>
										<p>
											총 <span>0</span>건
										</p>
										<p>|</p>
										<p>
											<span>0</span> 건 선택
										</p>
										<div>
											<p className={styles.selectAllItem}>
												<a>전체 선택</a>
											</p>
											<div className={styles.delimiter1}></div>
											<p className={styles.deleteItem}>
												<a>삭제</a>
											</p>
										</div>
									</div>
									<div className={styles.list}>
										{stackTabStatus ? (
											<ul>
												{stackList &&
													stackList.map((item, index) => {
														if (item.status === CadDownloadStatus.Done) {
															return (
																<StackBalloonItems
																	item={item}
																	checkedItems={checkedDoneCad}
																	onClick={() => handleSelectDoneCad(item)}
																/>
															);
														}
													})}
											</ul>
										) : (
											<ul>
												{stackList &&
													stackList.map((item, index) => {
														if (item.status !== CadDownloadStatus.Done) {
															return (
																<StackBalloonItems
																	item={item}
																	checkedItems={checkedPendingCad}
																	onClick={() => handleSelectPendingCad(item)}
																/>
															);
														}
													})}
											</ul>
										)}
									</div>
								</div>
								<div className={styles.stackMyCad}>
									<a>CAD 다운로드 이력조회</a>
								</div>
								<div className={styles.btnSection}>
									<span className={styles.btnArrow}>다운로드</span>
									<span
										className={styles.btnClose}
										onClick={() => setStackShowStatus(!stackShowStatus)}
									>
										닫기
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
StackBalloon.displayName = 'StackBalloon';
