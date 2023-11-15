import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './QuoteHistory.module.scss';
import { Link } from '@/components/pc/ui/links';
import { CurrencyProvider, Price } from '@/components/pc/ui/text/Price';
import { Quote } from '@/store/modules/pages/home';
import { dateTime } from '@/utils/date';
import { url } from '@/utils/url';

type Props = {
	/** 見積履歴リスト */
	quoteList: Quote[];
	/** 通貨コード */
	currencyCode?: string;
};

/**
 * 見積履歴
 */
export const QuoteHistory: React.VFC<Props> = ({ quoteList, currencyCode }) => {
	/** translator */
	const [t] = useTranslation();
	// TODO: wos パラメータ lang を、ヘッダーで指定した言語にする (en)
	const lang = 'en';

	return (
		<div className={styles.container}>
			<div className={styles.titleBox}>
				<div className={styles.title}>
					{t('pages.home.orderStatusPanel.quoteHistoryTitle')}
				</div>
				<div>
					<Link href={url.wos.quote.history({ lang })} className={styles.link}>
						{t('pages.home.orderStatusPanel.seeMore')}
					</Link>
				</div>
			</div>
			<div className={styles.main}>
				{quoteList?.length === 0 ? (
					<div className={styles.noData}>
						{t('pages.home.orderStatusPanel.noQuoteHistory')}
					</div>
				) : (
					<table className={styles.table}>
						<thead>
							<tr>
								<th className={styles.head}>
									{t('pages.home.orderStatusPanel.quoteDate')}
								</th>
								<th className={styles.head}>
									{t(
										'pages.home.orderStatusPanel.quoteSlipNumberWithItemCount'
									)}
								</th>
								<th className={styles.head}>
									{t('pages.home.orderStatusPanel.totalPrice')}
								</th>
								<th className={styles.head}>
									{t('pages.home.orderStatusPanel.statusMessage')}
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
