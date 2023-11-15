import { Flag } from '@/models/api/Flag';
import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/**
 * 得意先タイプ
 * - 1: EC会員
 * - 2: WOS会員(一般顧客)
 * - 3: WOS会員(B-E顧客)
 * - 4: WOS会員(TT顧客)
 */
export const CustomerType = {
	/** EC会員 */
	EC: '1',
	/**
	 * WOS会員(一般顧客)
	 * - WOS はなくなるのに Wos という名前はどうなのだろうという葛藤がある。
	 */
	WOS: '2',
	/**
	 * WOS会員(B-E顧客)
	 * - B-E: customer rank B 〜 E の意味。これを前面に出した変数物理名は厳禁です。
	 */
	WOS_BE: '3',
	/**
	 * WOS会員(TT顧客)
	 * - TT: Top Tier の略。TOYOTA, SONY など
	 */
	WOS_TT: '4',
} as const;
export type CustomerType = typeof CustomerType[keyof typeof CustomerType];

/** ユーザ情報取得APIレスポンス */
export interface GetUserInfoResponse extends MsmApiResponse {
	/**
	 * セッション状態
	 * - セッション状態
	 *   1: 未ログイン
	 *   2: 仮ログイン(ログイン後、30分以上経過)
	 *   3: 本ログイン(ログイン後、30分以内)
	 */
	sessionStatus: string;
	/**
	 * ユーザコード
	 * - ユーザのコード
	 */
	userCode?: string;
	/**
	 * ユーザ名
	 * - ユーザの名前(現地語)
	 */
	userName?: string;
	/**
	 * 得意先タイプ
	 * - 得意先のタイプ
	 *   1: EC会員
	 *   2: WOS会員(一般顧客)
	 *   3: WOS会員(B-E顧客)
	 *   4: WOS会員(TT顧客)
	 * - NOTE: user_infoと値が異なる
	 */
	customerType?: CustomerType;
	/**
	 * 得意先コード
	 * - 得意先のコード
	 */
	customerCode?: string;
	/**
	 * 得意先名
	 * - 得意先の名前(現地語)
	 */
	customerName?: string;
	/**
	 * 権限リスト
	 * - 操作可能な機能のリスト
	 *   1: カート
	 *   2: My部品表
	 *   3: 見積
	 *   4: 注文
	 *   5: 見積履歴
	 *   6: 注文履歴
	 *   7: CADダウンロード
	 *   8: 価格チェック
	 *   20: 設計履歴
	 */
	permissionList: string[];
	/**
	 * 購買連携対象フラグ
	 * - 購買連携対象フラグ
	 *   0: 対象外
	 *   1: 対象
	 *   (日本現法固有。海外の場合は0)
	 */
	purchaseLinkFlag?: Flag;
	/**
	 * キャンペーン適用フラグ
	 * - キャンペーン適用フラグ
	 *   0: キャンペーン適用不可
	 *   1: キャンペーン適用可
	 */
	campaignApplyFlag?: Flag;
	/**
	 * カート内商品件数
	 * - カート内の商品件数
	 */
	cartCount: number;
	/**
	 * 見積アンフィット件数
	 * - ユーザアクションを必要とする件数
	 */
	quotationUnfitCount: number;
	/**
	 * 注文アンフィット件数
	 * - ユーザアクションを必要とする件数
	 */
	orderUnfitCount: number;
	/**
	 * 未確認メッセージ件数
	 * - 未確認のメッセージ件数(通常とクーポンの合計)
	 */
	unconfirmedMessageCount: number;
	/**
	 * 未読メッセージ件数
	 * - 未読のメッセージ件数(通常とクーポンの合計)
	 */
	unreadMessageCount: number;
	/**
	 * 通常メッセージ配信フラグ
	 * - 通常メッセージが配信されたことがあるか
	 *   0: 配信なし
	 *   1: 配信あり
	 */
	informationMessageFlag?: Flag;
	/**
	 * クーポンメッセージ配信フラグ
	 * - クーポンメッセージが配信されたことがあるか
	 *   0: 配信なし
	 *   1: 配信あり
	 */
	couponMessageFlag?: Flag;
	/**
	 * 別タブフラグ
	 * - 商品詳細画面等に遷移する際に別タブで表示するかどうか
	 *   0: 同一タブで遷移
	 *   1: 別タブで遷移
	 * - NOTE: user_infoと0/1が逆
	 */
	newTabFlag?: Flag;
	/**
	 * 決済サイトタイプ
	 * - 利用する決済サイト
	 *   1: WOS
	 *   2: eカタログ
	 * - NOTE: user_infoと値が異なる
	 */
	settlementSiteType?: string;
	/**
	 * 決済形態
	 * - 決済形態
	 *   CRD: 売掛金
	 *   ADV: 前金
	 *   CCD: クレジットカード
	 *   COD: 代引き
	 *   ADI: 前金(インド用)
	 *   COI: 代引き(インド用)
	 */
	settlementType: SettlementType;
	/**
	 * 決済形態表示文言
	 * - 決済形態の表示文言
	 */
	settlementTypeDisp: string;
	/**
	 * セルコード
	 */
	cellCode?: string;
	/**
	 * チャット可否フラグ
	 * - WeChat使用可否
	 *   0: 使用しない
	 *   1: 使用する
	 */
	chatAvailableFlag?: Flag;
	/**
	 * ご利用状況マップ表示フラグ
	 * - ご利用状況マップを表示するかどうか
	 *   0: 表示しない
	 *   1: 表示する
	 */
	usageMapFlag?: Flag;
	/**
	 * 担当者リスト
	 * - 担当者のリスト
	 */
	staffList: Staff[];
	/**
	 * FA営業情報
	 * - FAの営業情報
	 */
	faSalesStaff?: FaSalesStaff;
	/**
	 * スタイル指定キー
	 * - CSS取得時に指定するキー
	 */
	styleKey?: string;
	/**
	 * メニュータイトル
	 * - メニューのタイトル
	 */
	menuTitle?: string;
	/**
	 * メニューリスト
	 * - メニューのリスト
	 */
	menuList?: Menu[];
	/**
	 * 購買連携情報
	 * - 購買連携情報
	 */
	purchase?: Purchase;
	/**
	 * 標準価格表示フラグ
	 * - 標準価格を表示するかどうか
	 *   0: 表示しない
	 *   1: 表示する
	 */
	displayStandardPriceFlag?: Flag;
	/**
	 * 未確認メッセージ・問い合わせ件数
	 * - ユーザ向けメッセージの未確認件数（通常と技術支援サイト問い合わせの合算）
	 */
	unconfirmedMessageAndContactCount?: number;
	/**
	 * 未確認通知件数
	 * - ユーザ向けメッセージの未確認件数（メッセージ、クーポン、技術支援問い合わせの合算）
	 */
	unconfirmedNotificationCount?: number;
	/**
	 * 利用可能クーポン件数
	 * - 利用可能クーポン件数
	 */
	availableCouponCount?: number;
	/**
	 * 未確認クーポン件数
	 * - 未確認クーポン件数
	 */
	unconfirmedCouponCount?: number;
	/**
	 * 技術支援サイト用情報
	 * - 技術支援サイト情報
	 */
	technicalSupport?: TechnicalSupport;
	/**
	 * 複数CADダウンロード完了フラグ
	 * - 複数CADダウンロードが完了したかどうか
	 *   0: 未完了
	 *   1: 完了
	 */
	cadDownloadCompleteFlag?: Flag;
	/**
	 * 戻り先URL
	 * - 中国購買連携VG顧客向け戻り先URL
	 */
	cancelUrl?: string;
	/**
	 * 即納対応可フラグ
	 * - 即納対応可能かどうか(中国のみ)
	 *   0: 非対応
	 *   1: 対応
	 */
	promptDeliveryFlag?: Flag;
	/**
	 * 携帯番号認証済みフラグ
	 * - 携帯番号認証済みかどうか(中国のみ)
	 *   0: 未認証
	 *   1: 認証済み
	 */
	authPhoneCompleteFlag?: Flag;
	/**
	 * 置場コード
	 * - 即納配送に使用する置場コード(中国のみ)
	 * - example: C1
	 */
	plantCode?: string;
	/**
	 * 得意先送料無料フラグ
	 * - 得意先送料無料フラグ
	 *   0: 有料
	 *   1: 無料
	 * - example: 1
	 * - NOTE: 【無料条件】
	 *         ・ 得意先マスタ#運賃計算不要フラグ＝１：無料
	 *         ・ 得意先マスタ#運賃値引フラグ＝１：100％値引き
	 *         ・ 得意先送料管理マスタ#送料無料事由 ＝ 1 or 2
	 *         　　& 得意先送料管理マスタ#送料無料期限 >= 当日
	 */
	freightNeedlessFlag?: Flag;
	/**
	 * 得意先別送手数料無料フラグ
	 * - 得意先別送手数料無料フラグ
	 *   0: 有料
	 *   1: 無料
	 * - example: 1
	 * - NOTE: 【無料条件】
	 *         ・ 得意先マスタ#別送品手数料不要フラグ＝１：無料
	 */
	specialShipmentFeeNeedlessFlag?: Flag;
	/**
	 * 直送先送料無料有フラグ
	 * - 直送先送料無料有フラグ
	 *   0: 無料なし
	 *   1: 無料あり
	 * - example: 1
	 * - NOTE: 【無料あり条件】
	 *         得意先に紐づく直送先リストにて、「直送先送料当月無料フラグ」もしくは「直送先送料当日無料フラグ」に「1：無料」が設定されているものが1件以上ある場合
	 */
	shipToFreightNeedlessFlag?: Flag;
	/**
	 * 得意先送料当月無料フラグ
	 * - 得意先送料当月無料フラグ
	 *   ※得意先住所の送料が当月無料かどうか
	 *   0: 有料
	 *   1: 無料
	 * - example: 1
	 * - NOTE: 得意先直送先送料管理MSTの直送先コード=半角スペース6桁の直送先の送料無料期限より
	 *         ①送料無料期限≧システム日付の場合、”1” を設定
	 *         ②上記以外の場合は、”0” を設定
	 *         0：有料、1：無料
	 */
	customerAddressFreightNeedlessForMonthFlag?: Flag;
	/**
	 * 得意先送料当日無料フラグ
	 * - 得意先送料当日無料フラグ
	 *   ※得意先住所の送料が当日無料かどうか
	 *   0: 有料
	 *   1: 無料
	 * - example: 1
	 * - NOTE: 得意先直送先送料管理MSTの直送先コード=半角スペース6桁の直送先の直近注文日
	 *         ①直近注文日＝システム日付の場合、”1” を設定
	 *         ②上記以外の場合は、”0” を設定
	 *         0：有料、1：無料
	 */
	customerAddressFreightNeedlessForDayFlag?: Flag;
	/**
	 * 得意先送料無料有効期限
	 * - 得意先住所の送料無料となる有効期限（YYYYMMDD）
	 * - example: 20211231
	 * - NOTE: 得意先直送先送料管理MSTのの直送先コード=半角スペース6桁の送料無料期限（YYYYMMDD）を返却する。
	 */
	customerAddressFreightNeedlessExpiredDate?: string;
	/**
	 * 段階開放フラグ（少額SO課金）
	 * - 段階開放フラグ（少額SO課金）
	 *   ※少額SO課金の段階開放がされているかどうか
	 *   0: 未開放
	 *   1: 開放済み（運用開始）
	 * - maxLength: 1
	 * - example: 1
	 * - NOTE: 得意先MSTの段階開放フラグ（少額SO課金）を返却する。
	 *         0:未開放、1:開放済み（運用開始）
	 */
	stageReleaseFreightFlag?: Flag;
	/**
	 * 段階開放フラグ（特別配送課金）
	 * - 段階開放フラグ（特別配送課金）
	 *   ※特別配送課金の段階開放がされているかどうか
	 *   0: 未開放
	 *   1: 開放済み（運用開始）
	 * - maxLength: 1
	 * - example: 1
	 * - NOTE: 得意先MSTの段階開放フラグ（特別配送課金）を返却する。
	 *         0:未開放、1:開放済み（運用開始）
	 */
	stageReleaseSpecialShipmentFeeFlag?: Flag;
}

/** 担当者 */
export interface Staff {
	/**
	 * 事業部タイプ
	 * - 事業部タイプ
	 *   1: FA
	 *   2: 金型
	 *   3: VONA
	 */
	departmentType?: string;
	/**
	 * 営業担当者名
	 * - 営業担当者の名前
	 */
	salesStaffName?: string;
	/**
	 * 営業担当者画像パス
	 * - 営業担当者の画像URL
	 */
	salesStaffImageUrl?: string;
	/**
	 * 営業担当電話番号
	 * - 営業担当者の電話番号
	 */
	salesStaffTel?: string;
	/**
	 * 営業担当FAX番号
	 * - 営業担当者のFAX番号
	 */
	salesStaffFax?: string;
	/**
	 * 技術担当者名
	 * - 技術担当者の名前
	 */
	techStaffName?: string;
	/**
	 * 技術担当者画像パス
	 * - 技術担当者の画像URL
	 */
	techStaffImageUrl?: string;
	/**
	 * 技術担当電話番号
	 * - 技術担当者の電話番号
	 */
	techStaffTel?: string;
	/**
	 * 技術担当FAX番号
	 * - 技術担当者のFAX番号
	 */
	techStaffFax?: string;
}

/** FA営業情報 */
export interface FaSalesStaff {
	/**
	 * 営業組織名
	 * - 営業組織名
	 */
	salesDepartmentName?: string;
	/**
	 * 内勤営業担当者名
	 * - 内勤営業担当者の名前
	 */
	insideSalesStaffName?: string;
	/**
	 * 内勤営業担当者画像パス
	 * - 内勤営業担当者の画像URL
	 */
	insideSalesStaffImageUrl?: string;
	/**
	 * 外勤営業担当者名
	 * - 外勤営業担当者の名前
	 */
	outsideSalesStaffName?: string;
	/**
	 * 外勤営業担当者画像パス
	 * - 外勤営業担当者の画像URL
	 */
	outsideSalesStaffImageUrl?: string;
	/**
	 * 技術相談窓口組織名
	 * - 技術相談窓口の組織名
	 */
	techDepartmentName?: string;
	/**
	 * 技術相談窓口電話番号
	 * - 技術相談窓口の電話番号
	 */
	techTel?: string;
	/**
	 * 技術相談窓口FAX番号
	 * - 技術相談窓口のFAX番号
	 */
	techFax?: string;
}

/** メニュー */
export interface Menu {
	/**
	 * メニュー文言
	 * - メニューの文言
	 */
	menuText?: string;
	/**
	 * メニューURL
	 * - メニューのURL
	 */
	menuUrl?: string;
}

/** 購買連携情報 */
export interface Purchase {
	/**
	 * 購買連携チェックアウト可能フラグ
	 * - チェック可能なユーザかどうか
	 *   0: チェックアウト不可
	 *   1: チェックアウト可能
	 */
	checkoutFlag?: Flag;
	/**
	 * チェックアウト可能最大件数
	 * - チェックアウト可能な最大件数(0～500)
	 */
	checkoutMaxCount?: number;
	/**
	 * 禁止文字
	 * - 型番に含まれていた場合にチェックアウト不可
	 *   とする文字を連結した文字列
	 */
	invalidChars?: string;
	/**
	 * アンフィット時チェックアウト可能フラグ
	 * - アンフィット時にチェックアウト可能かどうか
	 *   0: チェックアウト不可
	 *   1: チェックアウト可能
	 */
	unfitCheckoutFlag?: Flag;
	/**
	 * 大口時出荷日数(ミスミ品)
	 * - 大口注文時の出荷日数(ミスミ品) (0 ～ 999)
	 */
	largeOrderDaysToShipMisumi?: number;
	/**
	 * 大口時出荷日数(VONA品)
	 * - 大口注文時の出荷日数(VONA品) (0 ～ 999)
	 */
	largeOrderDaysToShipVona?: number;
	/**
	 * アンフィット時メッセージ置換フラグ
	 * - アンフィット時にメッセージを置換するかどうか
	 *   0: 置換しない
	 *   1: 置換する
	 */
	unfitMessageReplaceFlag?: Flag;
}

/** 技術支援サイト用情報 */
export interface TechnicalSupport {
	/**
	 * 事例集バナーパス
	 * - 事例集バナーのURL
	 */
	caseStudiesBannerUrl?: string;
	/**
	 * 担当者リスト
	 * - 技術支援サイト担当者情報のリスト
	 */
	technicalSupportStaffList?: TechnicalSupportStaff[];
}

/** 担当者 */
export interface TechnicalSupportStaff {
	/**
	 * 担当種別
	 * - 担当者の担当種別
	 */
	type?: string;
	/**
	 * 氏名
	 * - 担当者の氏名
	 */
	name?: string;
	/**
	 * 電話番号
	 * - 担当者の電話番号
	 */
	tel?: string;
	/**
	 * コメント
	 * - 担当者のコメント
	 */
	comment?: string;
	/**
	 * プロフィール画像パス
	 * - 担当者のプロフィール画像パス
	 */
	profileImgUrl?: string;
}

/**
 * 決済形態
 * - 決済形態
 *   CRD: 売掛金
 *   ADV: 前金
 *   CCD: クレジットカード
 *   COD: 代引き
 *   ADI: 前金(インド用)
 *   COI: 代引き(インド用)
 */
export const SettlementType = {
	CREDIT: 'CRD',
	ADVANCE: 'ADV',
	CREDIT_CARD: 'CCD',
	CASH_ON_DELIVERY: 'COD',
} as const;
export type SettlementType = typeof SettlementType[keyof typeof SettlementType];
