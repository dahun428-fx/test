type Page = {
	name: string;
	path: string;
};

export const pages: Page[] = [
	{ name: 'TOPページ', path: '/' },
	{
		name: 'リニアシャフト',
		path: '/vona2/mech/M0100000000/M0101000000/',
	},
	{
		name: 'リーマ',
		path: '/vona2/fs_machining/T0109000000/',
	},
	{
		name: '丸線コイルスプリング',
		path: '/vona2/mech/M1200000000/M1202000000/M1202030000/M1202030100/',
	},
	{
		name: '超硬スクエアエンドミル',
		path: '/vona2/fs_machining/T0101000000/T0101010000/',
	},
	{
		name: 'パンチ',
		path: '/vona2/press/P0100000000/P0101000000/',
	},
	{
		name: 'シャフト　ストレート',
		path: '/vona2/detail/110302634310/',
	},
	// The following product does not exists on Mylasia
	// { name: '超硬底刃付ストレートリーマ　', path: '' },
	{
		name: '丸線コイルスプリング-WF・WL　外形基準タイプ-',
		path: '/vona2/detail/110302604030/',
	},
	{
		name: '樹脂加工用超硬スクエアエンドミル　２枚刃／レギュラータイプ',
		path: '/vona2/detail/110600022460/',
	},
	{
		name: 'ショルダーパンチ　RWコート処理',
		path: '/vona2/detail/110100092930/',
	},
	{
		name: '“ミスミ”の検索結果',
		path: '/vona2/result/?Keyword=misumi',
	},
];
