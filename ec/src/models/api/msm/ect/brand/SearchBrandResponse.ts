import { Flag } from '@/models/api/Flag';
import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** ブランド検索APIレスポンス */
export interface SearchBrandResponse extends MsmApiResponse {
	/**
	 * 総件数
	 * - 検索結果総件数
	 */
	totalCount: number;
	/**
	 * ブランド情報リスト
	 * - 検索結果のブランド一覧
	 */
	brandList: Brand[];
}

/** ブランド情報 */
export interface Brand {
	/**
	 * ブランドコード
	 * - ブランドコード
	 * - example: ERH1
	 */
	brandCode: string;
	/**
	 * ブランド名
	 * - ブランドの現地名称
	 * - example: アース製薬
	 */
	brandName: string;
	/**
	 * ブランド名(カナ/英字)
	 * - ブランドの英語名称、もしくはカナ名称(日本の場合)
	 * - example: アースセイヤク
	 */
	brandNameEn?: string;
	/**
	 * ブランド索引用文字
	 * - ブランド索引用文字
	 * - example: あ
	 */
	brandIndexCharacter?: string;
	/**
	 * ブランド別称
	 * - ブランドの別称として登録された値を返却
	 */
	brandNameAnother?: string;
	/**
	 * ブランドURLコード
	 * - ブランドページのURLで使用するコード
	 * - example: earth_chemical
	 */
	brandUrlCode?: string;
	/**
	 * ブランドサイトURL
	 * - ブランドのメーカーサイトのURL
	 */
	brandSiteUrl?: string;
	/**
	 * ロゴ画像URL
	 * - ブランドのロゴ画像URL
	 * - example: http://ドメイン名/common/img/maker/inc/omr.png
	 */
	logoImageUrl?: string;
	/**
	 * キャッチコピー
	 * - ブランドの説明文
	 * - example: オムロンは、「企業は社会の公器である」という企業理念の下、1933年の創業から、産業のFA化と共に歩み、日本をはじめ世界の製造業の発展に貢献してきました。
	 */
	catchCopy?: string;
	/**
	 * ミスミブランド判別フラグ
	 * - ミスミブランドかどうかの判定フラグ
	 *   0: VONA
	 *   1: ミスミ
	 * - example: 1
	 */
	misumiFlag: Flag;
	/**
	 * メタタグリスト
	 * - マスタ情報のメタタグ項目
	 * - example: ["てらだ","テラダ","ＴＥＲＡＤＡ"]
	 */
	brandSynonymList?: string[];
	/**
	 * 検索デバッグ情報
	 * - 検索時の内部処理の内容を表す文字列
	 * - example: BN|BA
	 * - NOTE: BN: ブランド名称にヒット
	 *         BA: ブランド別称にヒット
	 */
	searchDebugInfo?: string;
}
