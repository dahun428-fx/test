import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Gnb.module.scss';
import { Link, LinkItem } from './Link';
import { GnbItem } from './Gnb.types';
import classNames from 'classnames';
import { useGnb } from './Gnb.hooks';
import { useTimer } from '@/utils/timer';
import { NagiLink } from '@/components/mobile/ui/links';
import { useRouter } from 'next/router';
import { post } from '@/utils/post';
import { getSessionId } from '@/api/clients/utils/session';
import { Cookie, getCookie } from '@/utils/cookie';

const initialHoverId = -1;
const delay = 200;

export const Gnb: React.FC = () => {
	const timer = useTimer<'open' | 'close' | 'cooling'>();

	const [hoverId, setHoverId] = useState(initialHoverId);

	const { gnbList, postFaMarsTop } = useGnb();

	const handleMouseEnter = (item: GnbItem) => {
		timer.cancel('close');
		timer
			.sleep(delay, 'open')
			.then(() => {
				setHoverId(item.idx || initialHoverId);
				timer.sleep(delay, 'cooling').catch(() => {});
			})
			.catch(() => {});
	};
	const handleMouseLeave = () => {
		timer.cancel('open');
		timer
			.sleep(delay, 'close')
			.then(() => {
				setHoverId(initialHoverId);
				timer.sleep(delay, 'cooling').catch(() => {});
			})
			.catch(() => {});
	};

	const handleOnClickFaMars = (
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		item: GnbItem,
		sublink?: string
	) => {
		event.preventDefault();
		postFaMarsTop(item, sublink || '');
	};

	return (
		<div className={styles.headerGnb}>
			<ul>
				{gnbList &&
					gnbList.map((item: GnbItem, index: number) => {
						return (
							<li
								key={`gnb_${index}`}
								className={
									hoverId === item.idx ? classNames(styles.active) : ''
								}
								onMouseEnter={() => handleMouseEnter(item)}
								onMouseLeave={handleMouseLeave}
							>
								<Link label={item.label} link={item.link} isNew={item.isNew}>
									{item.childrenList && <i></i>}
								</Link>
								{item.childrenList && hoverId === item.idx && (
									<ul className={styles.depth2}>
										{item.childrenList.map(
											(children: GnbItem, childrenIndex: number) => {
												return (
													<li key={`gnb_${index}_${childrenIndex}`}>
														{children.id === 'faMars' ? (
															<a
																onClick={e =>
																	handleOnClickFaMars(
																		e,
																		children,
																		'?bid=bid_kr_ec_44078_446'
																	)
																}
															>
																{children.label}
															</a>
														) : (
															<Link
																label={children.label}
																link={children.link}
																isNew={children.isNew}
															></Link>
														)}
													</li>
												);
											}
										)}
									</ul>
								)}
							</li>
						);
					})}
			</ul>
		</div>
	);
};
Gnb.displayName = 'Gnb';
