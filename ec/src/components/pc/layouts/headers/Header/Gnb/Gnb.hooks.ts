import { useTranslation } from 'react-i18next';
import { GnbItem } from './Gnb.types';
import { url } from '@/utils/url';
import { useCallback } from 'react';
import { useSelector } from '@/store/hooks';
import { selectAuthenticated } from '@/store/modules/auth';
import { Cookie, getCookie } from '@/utils/cookie';

export const useGnb = () => {
	const authenticated = useSelector(selectAuthenticated);

	const [t] = useTranslation();

	const gnbList: GnbItem[] = [
		{
			id: 'economy',
			link: '/economy/?clkid=clkid_etct_kr_ec_45169_41',
			label: t('components.ui.layouts.headers.header.gnb.economy'),
		},
		{
			id: 'campaign',
			link: '/pr/vona/economy/campaign/?clkid=clkid_etct_kr_ec_45169_42',
			label: t('components.ui.layouts.headers.header.gnb.campaign'),
		},
		{
			id: 'ecoDesign',
			link: '/pr/vona/eco_design/?clkid=clkid_etct_kr_ec_45169_43',
			label: t('components.ui.layouts.headers.header.gnb.ecoDesign'),
			isNew: true,
		},
		{
			id: 'techSupport',
			link: '',
			label: t('components.ui.layouts.headers.header.gnb.techSupport'),
			childrenList: [
				{
					id: 'techInfo',
					link: `${url.techInfo}?clkid=clkid_etct_kr_ec_45169_44`,
					label: t('components.ui.layouts.headers.header.gnb.techInfo'),
				},
				{
					id: 'faMars',
					link: url.faMdrs,
					label: t('components.ui.layouts.headers.header.gnb.faMdrs'),
				},
				{
					id: 'incadLibrary',
					link: `${url.inCadLibrary}?clkid=clkid_etct_kr_ec_45169_46`,
					label: t('components.ui.layouts.headers.header.gnb.incadLibraray'),
				},
				{
					id: 'rapidDesign',
					link: `${url.rapidDesign}?clkid=clkid_etct_kr_ec_45169_47`,
					label: t('components.ui.layouts.headers.header.gnb.rapidDesign'),
				},
			],
		},
		{
			id: 'maker',
			link: `${url.makerTop}?clkid=clkid_etct_kr_ec_45169_48`,
			label: t('components.ui.layouts.headers.header.gnb.maker'),
		},
		{
			id: 'misumiBest',
			link: `${url.misumiBest2023}?clkid=clkid_etct_kr_ec_45169_49`,
			label: t('components.ui.layouts.headers.header.gnb.misumiBest'),
		},
	];

	let idx = 0;
	for (const item of gnbList) {
		item['idx'] = idx++;
		if (item.childrenList && item.childrenList?.length > 0) {
			let childIdx = 0;
			for (const children of item.childrenList) {
				children['idx'] = Number(String(item.idx) + String(childIdx++));
			}
		}
	}

	const postFaMarsTop = (item: GnbItem, sublink: string) => {
		let port = location.host == 'kr.misumi-ec.com' ? '' : ':446';
		let mdrsHost = `${item.link}${port}`;
		let selectPage = `${mdrsHost}${sublink}`;
		if (!authenticated) {
			selectPage = `${mdrsHost}?bid=bid_etct_kr_m-fa_44378_1044`;
		}
		const formId = 'fa-mars-form';

		const previousForm = document.getElementById(formId);
		if (previousForm) {
			try {
				console.log('revmoew ===> ', previousForm);
				document.body.removeChild(previousForm);
			} catch {}
		}

		const sessionId = getCookie(Cookie.ACCESS_TOKEN_KEY) || '';
		const form = document.createElement('form');
		form.id = formId;
		form.action = selectPage;
		form.method = 'POST';
		form.target = 'windowMDRS';

		const input = document.createElement('input');
		input.type = 'hidden';
		input.name = 'ECsessionId';
		input.value = sessionId;

		document.body.appendChild(form);
		form.appendChild(input);
		form.submit();
	};

	return {
		gnbList,
		postFaMarsTop,
	};
};
