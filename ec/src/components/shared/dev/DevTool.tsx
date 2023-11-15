import classNames from 'classnames';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './DevTool.module.scss';
import { useSelector } from '@/store/hooks';
import { login, logout, selectAuthenticated } from '@/store/modules/auth';

/**
 * dev tool.
 */
export const DevTool: React.VFC = () => {
	const dispatch = useDispatch();
	// NOTE: using useSelector inside presentational component violates the rule
	// It makes it difficult to test. Do not use this style anywhere. But this is a dev tool -> ok for now.
	const authenticated = useSelector(selectAuthenticated);
	const [loading, setLoading] = useState(false);
	const [template, setTemplate] = useState('');
	const [isBlank, setIsBlank] = useState(true);

	const handleClickLogin = async (payload: {
		loginId: string;
		password: string;
	}) => {
		setLoading(true);
		try {
			await login(dispatch)(payload);
		} finally {
			setLoading(false);
		}
	};

	const handleClickLogout = () => {
		logout(dispatch)().then();
	};

	return (
		<div className={styles.devTool}>
			<div className={styles.panelContainer}>
				<button
					className={classNames(styles.expandButton, {
						[String(styles.loggedIn)]: authenticated,
					})}
				>
					<span className={styles.arrow}>▼</span>
				</button>
				<div className={styles.panel}>
					<div className={styles.panelInner}>
						<h3 className={styles.heading}>Login</h3>
						<div className={styles.contents}>
							{authenticated ? (
								<button
									key="logout"
									className={styles.logoutButton}
									onClick={handleClickLogout}
								>
									log out
								</button>
							) : (
								<div className={styles.buttonList}>
									{users.map(([loginId, password]) => (
										<button
											key={loginId}
											className={styles.loginButton}
											onClick={() => handleClickLogin({ loginId, password })}
										>
											{loginId}
										</button>
									))}
								</div>
							)}
						</div>
						<h3 className={styles.heading}>Links</h3>
						<div className={styles.contents}>
							<div>
								<h4 className={styles.heading4}>Environments</h4>
								<ul className={styles.linksBox}>
									<li>
										<a
											className={styles.link}
											href={configureURL({
												origin: 'https://stg0-my.misumi-ec.com',
												params: { Template: template },
											})}
											target="_blank"
											rel="noreferrer"
										>
											STG0
										</a>
									</li>
									<li>
										<select
											value={template}
											onChange={e => setTemplate(e.currentTarget.value)}
										>
											<option value="">Select templates</option>
											{templates.map(template => (
												<option key={template} value={template}>
													{template}
												</option>
											))}
										</select>
									</li>
								</ul>
							</div>
							<div>
								<h4 className={styles.heading4}>Template</h4>
								<ul className={styles.linksBox}>
									{templates.map(template => (
										<li key={template}>
											<NextLink
												href={configureURL({
													params: { Template: template },
												})}
											>
												<a className={styles.link}>{template}</a>
											</NextLink>
										</li>
									))}
								</ul>
							</div>
							<div>
								<h4 className={styles.heading4}>
									Useful Products
									<label className={styles.checkbox}>
										<input
											type="checkbox"
											checked={isBlank}
											onChange={e => setIsBlank(e.currentTarget.checked)}
										/>
										Open in new tab
									</label>
								</h4>
								<ul className={styles.scroll}>
									{series.map(({ feature, products }) => (
										<li key={feature}>
											<h5 className={styles.heading5}>{feature}</h5>
											<ul className={styles.detailLinks}>
												{products.map(
													({ code, origin, name, partNumberList = [] }) => (
														<li key={code}>
															{partNumberList.length > 0 ? (
																<ul>
																	{partNumberList.map(partNumber => (
																		<li key={partNumber}>
																			<a
																				href={configureURL({
																					origin,
																					pathname: `/vona2/detail/${code}/`,
																					params: { HissuCode: partNumber },
																				})}
																				target={isBlank ? '_blank' : '_self'}
																				rel="noreferrer"
																			>
																				{`${name}_${partNumber}`}
																			</a>
																		</li>
																	))}
																</ul>
															) : (
																<a
																	href={configureURL({
																		origin,
																		pathname: `/vona2/detail/${code}/`,
																		params: { HissuCode: undefined },
																	})}
																	target={isBlank ? '_blank' : '_self'}
																	rel="noreferrer"
																>
																	{name}
																</a>
															)}
														</li>
													)
												)}
											</ul>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
					{loading && <div className={styles.overlay} />}
				</div>
			</div>
		</div>
	);
};
DevTool.displayName = 'DevTool';

function configureURL(config: {
	origin?: string;
	pathname?: string;
	params?: Record<string, string | undefined>;
}) {
	const {
		origin = location.origin,
		pathname = location.pathname,
		params: additionalParams = {},
	} = config;

	let url = origin;
	if (pathname) {
		url = `${url}${pathname}`;
	}

	const params = new URLSearchParams(location.search);
	for (const [key, value] of Object.entries(additionalParams)) {
		params.delete(key);
		if (value) {
			params.append(key, value);
		}
	}

	return `${url}?${params.toString()}`;
}

// Data Definition

const users: [string, string][] = [
	['NRI0003', 'nri0003'],
	['Q1S1EC01', 'pass'],
	['Q0S0EC06', 'pass'],
];

const templates = ['simple', 'default', 'patternh', 'wysiwyg'];

const series: {
	feature: string;
	products: {
		code: string;
		origin?: string;
		name: string;
		partNumberList?: string[];
	}[];
}[] = [
	{
		feature: 'pict',
		products: [{ code: '110100094060', name: 'Shoulder Punches' }],
	},
	{
		feature: 'multiple images',
		products: [
			{
				code: '110600389870',
				name: 'Safety Shoulder Belt',
				partNumberList: [],
			},
			{ code: '110600382010', name: 'Safety Vest' },
		],
	},
	{
		feature: 'piece per package',
		products: [{ code: '110200237230', name: 'Platen Hose Clip' }],
	},
	{
		feature: 'minimum order quantity',
		products: [
			{
				code: '221006293162',
				name: 'Triple Branch Universal Male Elbow',
			},
		],
	},
	{
		feature: 'has content (specCode:E999)',
		products: [
			{
				code: '223006516106',
				name: 'No.224WC Kankyo Omoi® Color',
			},
		],
	},
	{
		feature: 'caution',
		products: [
			{
				code: '221006301768',
				name: 'Main Line Filter AFF Series',
			},
			{ code: '223006026865', name: 'Jet Oiler' },
		],
	},
	{
		feature: 'faq',
		products: [
			{
				code: '221000058301',
				name: 'Deep Groove Ball Bearings',
			},
		],
	},
	{
		feature: 'image specs',
		products: [{ code: '110300098460', name: 'Pivot Pins' }],
	},
	{
		feature: 'sinus 3D preview',
		products: [
			{
				code: '110200000450',
				name: 'Straight Ejector Pins',
				partNumberList: ['EPH0.5-60'],
			},
		],
	},
	{
		feature: 'cadenas 3D preview',
		products: [
			{
				code: '110302636410',
				name: 'Shaft Collar (Clamp)',
				partNumberList: ['SCS4-8'],
			},
		],
	},
	{
		feature: '3D preview ERR500000 error',
		products: [
			{
				code: '110100093450',
				name: 'Jector Punches TiCN Coating',
				partNumberList: ['AH-PJRS5-50-P3-W2.5-R1'],
			},
		],
	},
	{
		feature: 'specs with defaultFlag ON',
		products: [
			{
				code: '221000401741',
				name: 'Ball retainer with LM guide World standard SHS shape',
			},
		],
	},
	{
		feature: 'specs with specNoticeText',
		products: [
			{
				code: '110302587930',
				name: 'Precision Ball Screws Standard Nut',
			},
		],
	},
	{
		feature: 'Stork table + Various errors for purchase link user (stg1-jp)',
		products: [
			{
				code: '110302194530',
				origin: 'https://stg1-jp.misumi-ec.com',
				name: 'ウォームギア',
			},
		],
	},
	{
		feature: 'Stork table',
		products: [
			{
				code: '110300098460',
				name: 'Pivot Pins',
				partNumberList: ['KCLBC5-5'],
			},
		],
	},
	{
		feature: 'No product detail tab panel',
		products: [
			{
				code: '223004934423',
				name: 'Soft bucket',
			},
		],
	},
];
