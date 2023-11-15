import { SinusApiRequest } from '@/models/api/sinus/SinusApiRequest';

/** SINUS 3Dプレビューデータ取得API リクエスト */
export interface PreviewCadRequest extends SinusApiRequest {
	partNumberList: PartNumber[];
}

export interface PartNumber {
	/**
	 * 得意先コード
	 * - NOTE: 設計書は誤っておりユーザコードと書かれているが得意先コードである。また必須指定も間違っている。
	 */
	customer_cd?: string;
	/**
	 * 言語
	 * @exmaple ja
	 */
	language: string;
	/** 型番 */
	partNumber: string;
	/** シリーズコード */
	seriesCode: string;
	/**
	 * ブランドコード
	 * @exmaple MSM1
	 */
	brdCode: string;
	/**
	 * タイプコード
	 * @example A-PHAL
	 */
	typeCode: string;
	/**
	 * 商品コード
	 * @example A-PHAL3
	 */
	SYCD: string;
	/**
	 * Eカタサイトのドメイン
	 * @exmaple jp
	 */
	domain: string;
	/**
	 * 実行環境
	 * @exmaple STG
	 */
	environment: string;
	/** スペックリスト */
	specValueList?: Spec[];
	/** 追加工スペックリスト */
	alterationSpecList?: Spec[];
}

export interface Spec {
	specCADCode?: string;
	specCADValue?: string;
}
