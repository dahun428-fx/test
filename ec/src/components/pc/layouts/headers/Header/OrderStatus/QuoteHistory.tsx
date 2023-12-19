import { Quote } from '@/store/modules/pages/home';
import React from 'react';
import styles from './QuoteHistory.module.scss';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/pc/ui/links';
import { url } from '@/utils/url';
import { CurrencyProvider, Price } from '@/components/pc/ui/text/Price';
import { dateTime } from '@/utils/date';

type Props = {
	quoteList: Quote[];
	currencyCode?: string;
};

export const QuoteHistory: React.FC<Props> = ({ quoteList, currencyCode }) => {
	const lang = 'ko';

	const [t] = useTranslation();

	return (
		<div className={styles.container}>
			<div className={styles.titleBox}>
				<div className={styles.title}>
					{t(
						'components.ui.layouts.headers.header.orderStatusPanel.quoteHistoryTitle'
					)}
				</div>
				<div>
					<Link href={url.wos.quote.history({ lang })} className={styles.link}>
						{t(
							'components.ui.layouts.headers.header.orderStatusPanel.quoteSeeMore'
						)}
					</Link>
				</div>
			</div>
			<div className={styles.main}>
				{quoteList?.length === 0 ? (
					<div className={styles.noData}>
						{t(
							'components.ui.layouts.headers.header.orderStatusPanel.noQuoteHistory'
						)}
					</div>
				) : (
					<table className={styles.table}>
						<thead>
							<tr>
								<th className={styles.head}>
									{t(
										'components.ui.layouts.headers.header.orderStatusPanel.quoteDate'
									)}
								</th>
								<th className={styles.head}>
									{t(
										'components.ui.layouts.headers.header.orderStatusPanel.quoteSlipNumberWithItemCount'
									)}
								</th>
								<th className={styles.head}>
									{t(
										'components.ui.layouts.headers.header.orderStatusPanel.totalPrice'
									)}
								</th>
								<th className={styles.head}>
									{t(
										'components.ui.layouts.headers.header.orderStatusPanel.statusMessage'
									)}
								</th>
							</tr>
						</thead>
						<tbody>
							<CurrencyProvider ccyCode={currencyCode}>
								{quoteList.map((history, index) => (
									<tr key={index}>
										<td className={styles.cell}>
											{dateTime(history.quoteDate)}
										</td>
										<td className={styles.cell}>
											{history.quoteSlipNumber && (
												<Link
													href={url.wos.quote.historyDetail(
														{ lang },
														history.quoteSlipNumber
													)}
													className={styles.link}
												>
													{history.quoteSlipNumber}({history.quoteItemCount})
												</Link>
											)}
										</td>
										<td className={styles.cell}>
											<Price value={history.totalPrice} />
										</td>
										<td className={styles.cell}>{history.statusMessage}</td>
									</tr>
								))}
							</CurrencyProvider>
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};

QuoteHistory.displayName = 'QuoteHistory';
