import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** CAD利用規定取得APIレスポンス */
export interface TermsOfUseCadResponse extends MsmApiResponse {
	/**
	 * 利用規定タイプリスト
	 * - 表示する利用規定の種別のリスト
	 *   1: ミスミ用利用規定
	 *   固定寸CAD、もしくは、CADサイトタイプ: 1(CADENAS), 3(MEX), 4(WebMEX) のCADがダウンロード対象の場合
	 *   2: web2CAD用利用規定
	 *   CADサイトタイプ: 2(web2CAD), 5(CADENAS TCR) のCADがダウンロード対象の場合
	 *   3: CIMSOURCE用利用規定
	 *   CADサイトタイプ: 6(CIMSOURCE) のCADがダウンロード対象の場合
	 * - NOTE: CADサイトタイプ5(CADENAS TCR)のときの挙動は、仮の定義のため信用しないこと
	 */
	termsOfUseTypeList: string[];
}
