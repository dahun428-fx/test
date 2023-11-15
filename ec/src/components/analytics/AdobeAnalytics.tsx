import Head from 'next/head';
import React from 'react';
/**
 * Adobe analytics
 */
export const AdobeAnalytics: React.VFC = () => {
	return (
		<Head>
			{/* eslint@next/next/no-script-in-head */}
			<script
				type="text/javascript"
				dangerouslySetInnerHTML={{
					__html: 'var sc_spaflag="true";',
				}}
			/>
			{/* 
				https://tickets.tools.misumi.jp/jira/browse/NEW_FE-2772
				2023/1/6 12:59 AAチーム安藤さんより、2023/3 リリースでは AA script load は非同期にしないとご連絡あり。
				(何か問題が起きた時に、Adobe から「AA を非推奨の利用形態で利用している
				 ケースであるためサポートしない」などと言われないようにするためと思われる)
				残念だが、2023/3 は head タグ内の同期ロードでリリースすることになる。
				2023/3 以降、どこかのタイミングで非同期ロードする形でリリースするのであれば、分析チームと定期MTGを開催する。
			 */}
			{/* eslint-disable-next-line @next/next/no-sync-scripts */}
			<script
				id="ec-web-adobe-analytics"
				type="text/javascript"
				src="//assets.adobedtm.com/059b68a380be5965dda59b47504aa655a2e9b3d7/satelliteLib-f20d40b03195dc17715019e5ba2006f6b47e81e1.js"
			/>
		</Head>
	);
};
AdobeAnalytics.displayName = 'AdobeAnalytics';
