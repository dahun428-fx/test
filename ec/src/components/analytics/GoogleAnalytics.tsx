import Script from 'next/script';
import React from 'react';
/**
 * Google tag manager
 */
export const GoogleAnalytics: React.VFC = () => {
	return (
		<>
			<noscript>
				{/* NOTE: style は使用禁止です。真似しないでください。ここでは、流石にこれだけのために .module.scss を作ることが逆に憚られたため、このようにしています。 */}
				<iframe
					src="//www.googletagmanager.com/ns.html?id=GTM-MBDFGM"
					height="0"
					width="0"
					style={{ display: 'none', visibility: 'hidden' }}
				/>
			</noscript>
			{/* NOTE: 通常 id は付与してはいけません。ここでは next/script が要求しているため付与しています。 */}
			<script
				type="text/javascript"
				dangerouslySetInnerHTML={{
					__html: 'var ga_spaflag="true";',
				}}
			/>
			{/* eslint-disable-next-line @next/next/next-script-for-ga */}
			<Script
				id="ec-web-google-analytics"
				dangerouslySetInnerHTML={{
					__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MBDFGM');`,
				}}
			/>
		</>
	);
};
GoogleAnalytics.displayName = 'GoogleAnalytics';
