import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

// NOTE: CADプレビューレスポンスは特殊なモデルなので type で定義していますが、
//       他で真似しないでください。
// NOTE: The CAD preview response is a special model, so it's defined by type,
//       but should not be imitated elsewhere.

/** CADプレビューデータ取得APIレスポンス */
export type PreviewCadResponse =
	| (MsmApiResponse & {
			/**
			 * CADサイトタイプ
			 * - 動的3D CADを生成する外部サイトの種別
			 *   1: CADENAS
			 */
			cadSiteType: '1';
			dynamic3DCadPreviewList: {
				parameterMap: CadenasParameters;
			}[];
	  })
	| (MsmApiResponse & {
			/**
			 * CADサイトタイプ
			 * - 動的3D CADを生成する外部サイトの種別
			 *   4: WEBMEX (SINUS)
			 */
			cadSiteType: '4';
			dynamic3DCadPreviewList: {
				parameterMap: SinusParameters;
			}[];
	  })
	| (MsmApiResponse & {
			/**
			 * CADサイトタイプ
			 * - 動的3D CADを生成する外部サイトの種別
			 *   0: なし
			 *   1: CADENAS
			 *   2: web2CAD
			 *   4: WEBMEX
			 *   5: CADENAS TCR
			 *   6: CIMSOURCE
			 * - example: 1
			 * - NOTE: マスタに設定されたADサイトタイプがweb2CADの場合、RapidDesignから呼ばれるときのみフロント側の処理でCADENAS TCRを利用して3Dプレビューを表示する。（eカタログでは3Dプレビューなし）。本APIではデータ状態を重視し、CADサイトタイプはマスタ設定値の2.を返却する。
			 */
			cadSiteType?: '0';
			/**
			 * 動的3D CADプレビューリスト
			 * - 動的3D CADのプレビューを表示するための情報リスト
			 * - NOTE: ヒットしなかった場合は0件のリストを返却
			 */
			dynamic3DCadPreviewList: {
				parameterMap: Record<string, string>;
			}[];
	  });

export type CadenasParameters = {
	cadenasResolveUrl: string;
	cadenasPloggerUrl: string;
	cadenasAssistantResolveUrl: string;
	cadName: string;
	cadGenerationTime: string;
	ec_loc: string;
	gc_wos: string;
	ge_sdm: string;
	language: string;
	location: string;
	prj: string;
	firm: string;
	part?: string;
	PRODUCT_ID: string;
	loggedin: string;
	ms_list: string;
	alterations: string;
	test: string;
	vg: string;
	viewType: string;
	select: string;
	MAIN_PHOTO: string;
	ge_location: string;
	viewerOptions: string;
};

export type SinusParameters = Pick<CadenasParameters, 'language'> & {
	domain: string;
	environment: string;
};
