import { Option } from '@/components/pc/ui/controls/select';

/** CAD site type */
export const CadSiteType = {
	NONE: '0',
	CADENAS: '1',
	WEB2CAD: '2',
	MEX: '3',
	SINUS: '4',
	// There are not "5: CADENAS TCR" and "6: CIMSOURCE" in Malaysia.
	// "2: Web2Cad" does not have 3D preview. (by IMJ Yukiko Hori 2022)
} as const;
export type CadSiteType = typeof CadSiteType[keyof typeof CadSiteType];

/**
 * dynamicCadModifiedCommon
 */
export interface DynamicCadModifiedCommon {
	pn: string; // LX3005-B1-A3040-125,
	ec_loc: string; // 1,
	gc_wos: string; // gmy,stg,
	ge_location: string; // asia,
	ge_sdm: string; // stg0-my,
	language: string; // english_jp,
	location: string; // my,
	prj: string; // /metric/08_linear_motion_units/lx3005_asmtab.prj,
	url: string; // https: string; // //stg0-my.misumi-ec.com/vcommon/detail/html/blank.html,
	loggedin: string; // 1,
	ms_list: string; // 0,
	alterations: string; // 0,
	test: string; // 2,
	vg: string; // 0,
	viewType: string; // 4,
	select: string; // 2,
	MAIN_PHOTO: string; // //stg0-my.misumi-ec.com/linked/material/mech/MSM1/PHOTO/10300075450.jpg,
	DOMAIN: string; // https: string; // //stg0-my.misumi-ec.com,
	PAGE_PATH: string; // https: string; // //stg0-my.misumi-ec.com/vona2/detail/110300075450/?ProductCode=LX3005-B1-A3040-125,
	BRD_CODE: string; // MSM1,
	BRD_NAME: string; // MISUMI_Test,
	SERIES_CODE: string; // 110300075450,
	SERIES_NAME: string; // Single Axis Actuators LX30 Standard / Cover Type,
	customer_cd: string; // 1222898,
	userCode: string; // 1222898,
	PRODUCT_ID: string; // 10300075450,
	EST_FLAG: string; // ,
	PRODUCT_TYPE: string; // LX3005,
	cgiaction: string; // download,
	downloadflags: string; // ZIP,
	dxfsettings: string; // {x=0.0},{y=0.0},{noattrib=0},{layer0=vis},{layer1=thin},{layer2=hidden},{layer3=center},{layer4=center1},{layer7=thread},{layer8=attrib},{ltyp0=bylayer},{ltyp1=bylayer},{ltyp2=bylayer},{ltyp3=bylayer},{ltyp4=bylayer},{ltyp8=bylayer},{colno0=1},{colno1=2},{colno2=3},{colno3=4},{colno4=5},{colno8=6},
	format: string; // ,
	part: string; // ,
	firm: string; // misumi,
	ok_url: string; // https: string; // //stg0-my.misumi-ec.com/vcommon/detail/html/blank.html?xmlfile=<%download_xml%>,
	Maker: string; // ,
	From: string; // ,
	LogID: string; // ,
	info: string; // ,
	vonaid: string; // ,
	resolveUrl: string; // //misumi.qa.partcommunity.com/23d-libs/misumi_jp/service/v1/resolve.asp,
	assResolveURL: string; // //misumi.qa.partcommunity.com/23d-libs/misumi_jp/assistant/resolve.asp,
	psConfVonaUrl: string; // //misumi.qa.partcommunity.com/23d-libs/misumi_jp/assistant/ps_conf_vona.asp,
	web2cadUrl: string; // ,
	mexUrl: string; // ,
	cgi2dviewUrl: string; // //misumi.qa.partcommunity.com/cgi-bin/cgi2pview.exe,
	cadName: string; // Standard,
	cadGenerationTime: string; // 5,
	partcommunityUrl: string; // //misumi.qa.partcommunity.com,
	partserverUrl: string; // //www.partserver.de,
	CombinationView: string; // misumi_custom,
	cadenasResolveUrl: string; // //misumi.qa.partcommunity.com/23d-libs/misumi_jp/service/v1/resolve.asp,
	cadenasPsConfVonaUrl: string; // //misumi.qa.partcommunity.com/23d-libs/misumi_jp/assistant/ps_conf_vona.asp,
	cadenasCgi2PviewUrl: string; // //misumi.qa.partcommunity.com/cgi-bin/cgi2pview.exe,
	cadenasAssistantResolveUrl: string; // //misumi.qa.partcommunity.com/23d-libs/misumi_jp/assistant/resolve.asp,
	web2cadParam: Record<string, string>; // {}
	// TODO need to check ploggerUrl
	ploggerUrl?: string;
	// TODO need to check viewerOptions
	viewerOptions: string;
}

export type DynamicParams = {
	resolveParam: Pick<
		DynamicCadModifiedCommon,
		| 'ec_loc'
		| 'gc_wos'
		| 'ge_sdm'
		| 'language'
		| 'location'
		| 'pn'
		| 'prj'
		| 'ge_location'
		| 'url'
	>;
	ploggerParam: Pick<
		DynamicCadModifiedCommon,
		'language' | 'firm' | 'part' | 'viewerOptions'
	>;
	psConfVonaParam: Pick<
		DynamicCadModifiedCommon,
		| 'ec_loc'
		| 'gc_wos'
		| 'ge_sdm'
		| 'language'
		| 'location'
		| 'pn'
		| 'prj'
		| 'PRODUCT_ID'
		| 'loggedin'
		| 'ms_list'
		| 'alterations'
		| 'customer_cd'
		| 'test'
		| 'vg'
		| 'viewType'
		| 'select'
		| 'MAIN_PHOTO'
		| 'PAGE_PATH'
		| 'BRD_CODE'
		| 'BRD_NAME'
		| 'SERIES_CODE'
		| 'SERIES_NAME'
		| 'EST_FLAG'
	>;
	cgi2dviewParam: {
		CombinationView: string;
		language: string;
		firm: string;
		part: string;
		cgiaction: string;
		downloadflags: string;
		dxfsettings: string;
		format: string;
		ok_url: string;
	};
	web2cadParam: Record<string, string>;
	mexParam: Pick<
		DynamicCadModifiedCommon,
		| 'PRODUCT_ID'
		| 'customer_cd'
		| 'pn'
		| 'MAIN_PHOTO'
		| 'PAGE_PATH'
		| 'BRD_CODE'
		| 'BRD_NAME'
		| 'SERIES_CODE'
		| 'SERIES_NAME'
		| 'PRODUCT_TYPE'
		| 'DOMAIN'
		| 'userCode'
		| 'language'
	>;
	urlInfo: Pick<
		DynamicCadModifiedCommon,
		| 'ploggerUrl'
		| 'resolveUrl'
		| 'assResolveURL'
		| 'psConfVonaUrl'
		| 'web2cadUrl'
		| 'mexUrl'
		| 'cgi2dviewUrl'
	>;
	otherInfo: Pick<
		DynamicCadModifiedCommon,
		'cadName' | 'cadGenerationTime' | 'partcommunityUrl' | 'partserverUrl'
	>;
	COMMON: DynamicCadModifiedCommon;
};

export type SelectedOption = {
	format: Option;
	otherFormat: Option | null;
	version: Option | null;
};
