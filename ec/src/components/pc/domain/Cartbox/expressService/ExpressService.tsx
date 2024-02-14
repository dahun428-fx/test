import { Express } from '@/models/api/msm/ect/myComponents/AddMyComponentsResponse';
import styles from './ExpressService.module.scss';
import { url } from '@/utils/url';
import { Trans, useTranslation } from 'react-i18next';

type Props = {
	isModal?: boolean;
	expressList: Express[];
};

export const ExpressService: React.VFC<Props> = ({ expressList, isModal }) => {
	const [t] = useTranslation();

	if (!expressList || expressList.length < 1) {
		return null;
	}

	if (isModal) {
		return (
			<table summary="익스프레스" className={styles.table}>
				<tbody>
					<tr>
						<th className={styles.colStrokeType} colSpan={2}>
							{t('components.domain.cartbox.express.title')}
							<a href={url.storkGuide} className={styles.help} target="guide">
								<span>?</span>
							</a>
						</th>
					</tr>
					{expressList.map((item, index) => {
						const { expressType, expressTypeDisp, expressDeadline } = item;
						if (expressType === 'T0') {
							return (
								<tr key={`${expressType}_${index}`}>
									<td className={styles.colStrokeType}>
										{t('components.domain.cartbox.express.expressTypeT0', {
											expressTypeDisp,
										})}
										<br></br>
										{t('components.domain.cartbox.express.expressTypeBack', {
											expressDeadline,
										})}
									</td>
								</tr>
							);
						}
						if (expressType === 'A0') {
							return (
								<tr key={`${expressType}_${index}`}>
									<td className={styles.colStrokeType}>
										{t('components.domain.cartbox.express.expressTypeA0', {
											expressTypeDisp,
										})}
										<br></br>
										{t('components.domain.cartbox.express.expressTypeBack', {
											expressDeadline,
										})}
									</td>
								</tr>
							);
						}
						if (expressType === '0A') {
							return (
								<tr key={`${expressType}_${index}`}>
									<td className={styles.colStrokeType}>
										{t('components.domain.cartbox.express.expressType0A', {
											expressTypeDisp,
										})}
										<br></br>
										{t('components.domain.cartbox.express.expressTypeBack', {
											expressDeadline,
										})}
									</td>
								</tr>
							);
						}
						if (expressType === 'B0') {
							return (
								<tr key={`${expressType}_${index}`}>
									<td className={styles.colStrokeType}>
										{t('components.domain.cartbox.express.expressTypeB0', {
											expressTypeDisp,
										})}
										<br></br>
										{t('components.domain.cartbox.express.expressTypeBack', {
											expressDeadline,
										})}
									</td>
								</tr>
							);
						}
						if (expressType === 'C0') {
							return (
								<tr key={`${expressType}_${index}`}>
									<td className={styles.colStrokeType}>
										{t('components.domain.cartbox.express.expressTypeC0', {
											expressTypeDisp,
										})}
										<br></br>
										{t('components.domain.cartbox.express.expressTypeBack', {
											expressDeadline,
										})}
									</td>
								</tr>
							);
						}
					})}
				</tbody>
			</table>
		);
	}

	return (
		<table summary="익스프레스" className={styles.table}>
			<colgroup>
				<col width="50%" />
				<col width="50%" />
			</colgroup>
			<thead>
				<tr>
					<th className={styles.colStorkeType} colSpan={2}>
						{t('components.domain.cartbox.express.title')}
						<a href={url.storkGuide} className={styles.help} target="guide">
							<span>?</span>
						</a>
					</th>
				</tr>
			</thead>
			<tbody>
				{expressList.map((item, index) => {
					const { expressType, expressTypeDisp, expressDeadline } = item;
					if (expressType === 'T0') {
						return (
							<tr key={`${expressType}_${index}`}>
								<td className={styles.colStrokeType}>
									{t('components.domain.cartbox.express.expressTypeT0', {
										expressTypeDisp,
									})}
								</td>
								<td className={styles.colStrokeTime}>
									{t('components.domain.cartbox.express.expressTypeBack', {
										expressDeadline,
									})}
								</td>
							</tr>
						);
					}
					if (expressType === 'A0') {
						return (
							<tr key={`${expressType}_${index}`}>
								<td className={styles.colStrokeType}>
									{t('components.domain.cartbox.express.expressTypeA0', {
										expressTypeDisp,
									})}
								</td>
								<td className={styles.colStrokeTime}>
									{t('components.domain.cartbox.express.expressTypeBack', {
										expressDeadline,
									})}
								</td>
							</tr>
						);
					}
					if (expressType === '0A') {
						return (
							<tr key={`${expressType}_${index}`}>
								<td className={styles.colStrokeType}>
									{t('components.domain.cartbox.express.expressType0A', {
										expressTypeDisp,
									})}
								</td>
								<td className={styles.colStrokeTime}>
									{t('components.domain.cartbox.express.expressTypeBack', {
										expressDeadline,
									})}
								</td>
							</tr>
						);
					}
					if (expressType === 'B0') {
						return (
							<tr key={`${expressType}_${index}`}>
								<td className={styles.colStrokeType}>
									{t('components.domain.cartbox.express.expressTypeB0', {
										expressTypeDisp,
									})}
								</td>
								<td className={styles.colStrokeTime}>
									{t('components.domain.cartbox.express.expressTypeBack', {
										expressDeadline,
									})}
								</td>
							</tr>
						);
					}
					if (expressType === 'C0') {
						return (
							<tr key={`${expressType}_${index}`}>
								<td className={styles.colStrokeType}>
									{t('components.domain.cartbox.express.expressTypeC0', {
										expressTypeDisp,
									})}
								</td>
								<td className={styles.colStrokeTime}>
									{t('components.domain.cartbox.express.expressTypeBack', {
										expressDeadline,
									})}
								</td>
							</tr>
						);
					}
				})}
			</tbody>
		</table>
	);
};

ExpressService.displayName = 'ExpressService';
