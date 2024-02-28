import { config } from '@/config';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { first } from '@/utils/collection';
import { getOGImageUrl } from '@/utils/domain/image';
import { openSubWindow } from '@/utils/window';
import { MouseEvent, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useSocialShare = (series: Series) => {
	const [t] = useTranslation();
	const productImage = first(series.productImageList);

	const ogTitle = useMemo(() => {
		return t('pages.productDetail.socialShare.og.title', {
			seriesName: series.seriesName,
			brandName: series.brandName,
		});
	}, [series, t]);

	const ogType = 'website';

	const ogSitename = useMemo(() => {
		return t('pages.productDetail.socialShare.og.sitename');
	}, [t]);

	const ogDesc = useMemo(() => {
		return t('pages.productDetail.socialShare.og.description');
	}, [t]);

	const ogUrl = useMemo(() => {
		return `${config.web.ec.origin}/vona2/detail/${series.seriesCode}/?sid=sid_fb_share_sc001_20196`;
	}, [series, t]);

	const twitterTitle = useMemo(() => {
		return t('pages.productDetail.socialShare.twitter.title', {
			seriesName: series.seriesName,
			brandName: series.brandName,
		});
	}, [series, t]);

	const twitterUrl = useMemo(() => {
		return `${config.web.ec.origin}/vona2/detail/${series.seriesCode}/?sid=sid_tw_share_sc002_20196`;
	}, [series]);

	const twitterDesc = useMemo(() => {
		return t('pages.productDetail.socialShare.twitter.description');
	}, [t]);

	const productImageUrl = getOGImageUrl(productImage?.url) ?? '';

	const shareTwitter = useCallback(
		(e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				twitterTitle
			)}&url=${twitterUrl}`;
			openSubWindow(url, 'twitter', {
				width: 600,
				height: 400,
			});
		},
		[twitterTitle, twitterUrl, openSubWindow]
	);

	const shareFacebook = useCallback(
		(e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			const url = `http://www.facebook.com/sharer.php?u=${ogUrl}`;
			openSubWindow(url, 'facebook', {
				width: 600,
				height: 400,
			});
		},
		[ogUrl, openSubWindow]
	);

	const kakaoUrl = useMemo(() => {
		const kaCode = 'sid=sid_ka_share_sc003_20196';
		let ka_url = config.web.ec.origin;
		if (ka_url.match(/\?[^?\/]+$/)) {
			ka_url = ka_url + '&' + kaCode;
		} else {
			ka_url = ka_url + '?' + kaCode;
		}
		return ka_url;
	}, [location.href]);

	const createDefaultKakaoButton = () => {
		const { Kakao } = window as any;
		if (!Kakao) return;
		Kakao.Link.createDefaultButton({
			container: '#kakao-link-btn',
			objectType: 'feed',
			content: {
				title: ogTitle,
				description: ogDesc,
				imageUrl: getOGImageUrl(productImage?.url),
				link: {
					mobileWebUrl: kakaoUrl,
					webUrl: kakaoUrl,
				},
			},
			buttons: [
				{
					title: t('pages.productDetail.socialShare.kakao.buttons.title.pc'),
					link: {
						mobileWebUrl: kakaoUrl,
						webUrl: kakaoUrl,
					},
				},
				{
					title: t(
						'pages.productDetail.socialShare.kakao.buttons.title.mobile'
					),
					link: {
						mobileWebUrl: kakaoUrl,
						webUrl:
							'https://kr.misumi-ec.com/maker/misumi/crm/service/appintroduction/?bid=bid_kr_all_20190403_217',
						androidExecParams:
							'intent://#Intent;scheme=misumikrapp://;package=com.misumi_ec.kr.misumi_ec;end',
						iosExecParams: 'https://itunes.apple.com/kr/app/id1446374933/',
					},
				},
			],
		});
	};

	useOnMounted(() => {
		const fbscript = document.createElement('script');
		fbscript.src = '//connect.facebook.net/ko_KR/all.js';
		fbscript.async = true;
		document.body.appendChild(fbscript);

		const kakaoscript = document.createElement('script');
		kakaoscript.src = '//developers.kakao.com/sdk/js/kakao.min.js';
		kakaoscript.async = true;
		document.body.appendChild(kakaoscript);

		kakaoscript.onload = () => {
			const { Kakao } = window as any;
			if (Kakao && !Kakao.isInitialized()) {
				Kakao.init('6cc5289fb26986755bcce3acf18e3d18');
			}
			createDefaultKakaoButton();
		};
	});

	return {
		ogTitle,
		ogType,
		ogSitename,
		ogDesc,
		ogUrl,
		productImageUrl,
		twitterUrl,
		twitterTitle,
		twitterDesc,
		shareFacebook,
		shareTwitter,
	};
};
