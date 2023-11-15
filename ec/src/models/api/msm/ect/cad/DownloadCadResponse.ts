import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';
import { CadSiteType } from '@/models/domain/cad';

/** CADデータ取得APIレスポンス */
export interface DownloadCadResponse extends MsmApiResponse {
	/**
	 * 固定寸2D CADリスト
	 * - 固定寸2D CADファイルのリスト
	 * - NOTE: ヒットしなかった場合は0件のリストを返却
	 */
	fixed2DCadList: Fixed2DCad[];
	/**
	 * 固定寸3D CADリスト
	 * - 固定寸3D CADファイルのリスト
	 * - NOTE: ヒットしなかった場合は0件のリストを返却
	 */
	fixed3DCadList: Fixed3DCad[];
	/**
	 * CADサイトタイプ
	 * - 動的3D CADを生成する外部サイトの種別
	 *   0: なし
	 *   1: CADENAS
	 *   2: web2cad
	 *   3: MEX
	 *   4: WEBMEX
	 *   5: CADENAS TCR
	 *   6: CIMSOURCE
	 * - example: 1
	 * - NOTE: 2と5はレスポンスに同一パラメータを返す。
	 *         2. は、eカタログではweb2cadを表示し、 RapidDesignではCADENAS TCRを利用する。
	 *         5. は、eカタログ/RapidDesignでも
	 */
	cadSiteType?: CadSiteType;
	/**
	 * 動的3D CADリスト
	 * - 動的3D CAD生成サイトへの接続情報リスト
	 *   CADENASで型番未確定時は複数件、それ以外は最大で1件のリストとなる
	 * - NOTE: ヒットしなかった場合は0件のリストを返却
	 */
	dynamic3DCadList: Dynamic3DCad[];
	/**
	 * ファイルタイプリスト
	 * - 2D/3D CADデータのファイル形式の情報
	 */
	fileTypeList: FileType[];
	/**
	 * その他ファイルタイプリスト
	 * - その他のファイル形式の情報
	 */
	otherFileTypeList: OtherFileType[];
}

/** 固定寸2D CAD */
export interface Fixed2DCad {
	/**
	 * ファイル名
	 * - ファイル名
	 * - example: 2d_dxf_BRJ.zip
	 */
	fileName: string;
	/**
	 * URL
	 * - ファイルのURL
	 * - example: //xxx/.../2d_dxf_BRJ.zip
	 */
	url: string;
}

/** 固定寸3D CAD */
export interface Fixed3DCad {
	/**
	 * ファイル名
	 * - ファイル名
	 * - example: 3d_ap203_BRJ.zip
	 */
	fileName: string;
	/**
	 * URL
	 * - ファイルのURL
	 * - example: //xxx/.../3d_ap203_BRJ.zip
	 */
	url: string;
}

/** 動的3D CAD */
export interface Dynamic3DCad {
	/**
	 * パラメータマップ
	 * - 外部サイトのURLを生成する際に必要なパラメータのマップ
	 *   返却するパラメータの詳細については「【別紙】パラメータ詳細」シートを参照
	 */
	parameterMap: ParameterMap;
}

/** パラメータマップ */
export interface ParameterMap {
	// TODO: confirm if any other fields
	alterations: string;
	cadenasAssistantResolveUrl: string;
	cadenasCgi2PviewUrl: string;
	cadenasPsConfVonaUrl: string;
	cadenasResolveUrl: string;
	cadenasPloggerUrl?: string; // TODO: check if this exists in API response
	cadGenerationTime: string;
	cadName: string;
	cgiaction: string;
	CombinationView: string;
	downloadflags: string;
	dxfsettings: string;
	ec_loc: string;
	gc_wos: string;
	ge_location: string;
	ge_sdm: string;
	language: string;
	location: string;
	loggedin: string;
	MAIN_PHOTO: string;
	ms_list: string;
	partcommunityUrl: string;
	partserverUrl: string;
	prj: string;
	PRODUCT_ID: string;
	select: string;
	test: string;
	vg: string;
	viewType: string;
	web2cadUrl?: string;
	viewerOptions: string;
	domain: string;
	environment: string;
}

/** ファイルタイプ */
export interface FileType {
	/**
	 * タイプ
	 * - ファイル形式のタイプ
	 * - example: 3D
	 */
	type: string;
	/**
	 * フォーマットリスト
	 * - フォーマットのリスト
	 */
	formatList: Format[];
}

/** フォーマット */
export interface Format {
	/**
	 * ラベル
	 * - ラベル
	 * - example: SolidWorks® >=2001+
	 */
	label: string;
	/**
	 * フォーマット
	 * - フォーマット
	 * - example: SW_MAC","versionList
	 */
	format?: string;
	/**
	 * バージョンリスト
	 * - バージョンのリスト
	 */
	versionList?: Version[];
}

/** バージョン */
export interface Version {
	/**
	 * ラベル
	 * - ラベル
	 * - example: AUTOCAD VERSION 2013
	 */
	label: string;
	/**
	 * フォーマット
	 * - フォーマット
	 * - example: DWG2D-AUTOCAD VERSION 2013
	 */
	format: string;
}

/** その他ファイルタイプ */
export interface OtherFileType {
	/**
	 * タイプ
	 * - ファイル形式のタイプ
	 * - example: 2D
	 */
	type: string;
	/**
	 * フォーマットリスト
	 * - フォーマットのリスト
	 */
	formatList: Format[];
}

/** フォーマット */
export interface Format {
	/**
	 * ラベル
	 * - ラベル
	 * - example: Allplan 2008
	 */
	label: string;
	/**
	 * フォーマット
	 * - フォーマット
	 * - example: ALLPLANXML2D
	 */
	format?: string;
	/**
	 * バージョンリスト
	 * - バージョンのリスト
	 */
	versionList?: Version[];
}

/** バージョン */
export interface Version {
	/**
	 * ラベル
	 * - ラベル
	 * - example: 2
	 */
	label: string;
	/**
	 * フォーマット
	 * - フォーマット
	 * - example: creo2
	 */
	format: string;
}
