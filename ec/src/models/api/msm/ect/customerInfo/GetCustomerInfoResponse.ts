import { Flag } from '@/models/api/Flag';
import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** CustomerInfo */
export interface GetCustomerInfoResponse extends MsmApiResponse {
	/**
	 * 고객코드
	 */
	customerCode: string;
	/**
	 * 고객성함
	 */
	customerName: string;
	/**
	 * 고객성함(英字)
	 */
	customerNameEn?: string;
	/**
	 * 구매연계대상 플래그
	 * - 구매연계대상 플래그
	 * 0: 대상 외
	 * 1 : 대상
	 * (일본 현법 고유.해외시 0)
	 */
	purchaseLinkFlag: Flag;
	/**
	 * 캠페인적용 플래그
	 * - 캠페인적용 플래그
	 * 0: 캠페인 적용 불가
	 * 1 : 캠페인 적용 가능
	 */
	campaignApplyFlag: Flag;
	/**
	 * 견적언핏건수
	 * - 사용자 액션을 필요로 하는 건수
	 */
	quotationUnfitCount?: number;
	/**
	 * 주문 언핏 건수
	 * - 사용자 액션을 필요로 하는 건수
	 */
	orderUnfitCount?: number;
	/**
	 * 결제 형태
	 * - 결제형태
	 * CRD: 외상매출채권
	 * ADV: 선금
	 * CCD: 신용 카드
	 * COD: 대금 상환
	 * ADI: 선금(인도용)
	 * COI: 대금상환(인도용)
	 */
	settlementType: string;
	/**
	 * 결제 형태 표시 문구
	 * - 결제 형태의 표시 문구
	 */
	settlementTypeDisp: string;
	/**
	 * cellCode
	 */
	cellCode?: string;
	/**
	 * 채팅여부 플래그
	 */
	chatAvailableFlag?: Flag;
	/**
	 * 즉납 대응 가능 플래그
	 * - 즉납 대응 가능 여부(중국만 해당)
	 * 0: 비대응
	 * 1 : 대응
	 * * - example: 1
	 */
	promptDeliveryFlag?: Flag;
	/**
	 * 거치장 코드
	 * - 즉납배송에 사용하는 거치장 코드(중국만)
	 * * - example: C1
	 */
	plantCode: string;
	/**
	 * 담당자명(현지어)
	 * - 사용자명(현지어)
	 * - example : 테스트 유저
	 */
	userName: string;
	/**
	 * 부서명(현지어)
	 * - 부서명(현지어)
	 * - example: 테스트부서명
	 */
	departmentName: string;
	/**
	 * 전화번호
	 * - 전화번호
	 * - example: 03-5805-7480
	 */
	tel: string;
	/**
	 * FAX번호
	 * - FAX번호
	 * - example: 03-5805-7227
	 */
	fax: string;
	/**
	 * デフォルト直送先担当者名(現地語)
	 * - デフォルト直送先担当者名
	 * - example: みすみ太郎
	 */
	defaultSendToUserName: string;
	/**
	 * デフォルト直送先部課名(現地語)
	 * - デフォルト直送先部課名
	 * - example: みすみ
	 */
	defaultSendToDepartmentName: string;
	/**
	 * デフォルト直送先コード
	 * - デフォルト直送先コード
	 * - example: 4013
	 */
	defaultSendToCode: string;
	/**
	 * デフォルト直送先郵便番号
	 * - デフォルト直送先郵便番号
	 * - example: 232-0062
	 */
	defaultSendToPostalCode: string;
	/**
	 * デフォルト直送先住所1(現地語)
	 * - デフォルト直送先住所1
	 * - example: 東京都文京区後楽２－５
	 */
	defaultSendToAddress1: string;
	/**
	 * デフォルト直送先住所2(現地語)
	 * - デフォルト直送先住所2
	 * - example: 飯田橋ファーストビル
	 */
	defaultSendToAddress2: string;
	/**
	 * デフォルト直送先住所3(現地語)
	 * - デフォルト直送先住所3
	 * - example: 直送先住所３
	 */
	defaultSendToAddress3: string;
	/**
	 * デフォルト直送先住所4(現地語)
	 * - デフォルト直送先住所4
	 * - example: 直送先住所４
	 */
	defaultSendToAddress4: string;
	/**
	 * デフォルト直送先住所1(英字/カナ)
	 * - デフォルト直送先住所1
	 * - example: ｶﾅｶﾞﾜｹﾝﾖｺﾊﾏｼﾐﾅﾐｸ
	 */
	defaultSendToAddressEn1: string;
	/**
	 * デフォルト直送先住所2(英字/カナ)
	 * - デフォルト直送先住所2
	 * - example: ﾅｶｻﾞﾄﾁｮｳ
	 */
	defaultSendToAddressEn2: string;
	/**
	 * デフォルト直送先住所3(英字/カナ)
	 * - デフォルト直送先住所3
	 * - example: ﾁｮｸｿｳｻｷｼﾞｭｳｼｮ
	 */
	defaultSendToAddressEn3: string;
	/**
	 * デフォルト直送先住所4(英字/カナ)
	 * - デフォルト直送先住所4
	 * - example: ﾁｮｸｿｳｻｷｼﾞｭｳｼｮ
	 */
	defaultSendToAddressEn4: string;
	/**
	 * デフォルト直送先都市名
	 * - デフォルト直送先都市名
	 * - example: tokyo
	 */
	defaultSendToCityName: string;
	/**
	 * デフォルト直送先電話番号
	 * - デフォルト直送先電話番号
	 * - example: 03-5805-7205
	 */
	defaultSendToTel: string;
	/**
	 * デフォルト直送先FAX番号
	 * - デフォルト直送先FAX番号
	 * - example: 03-6735-8991
	 */
	defaultSendToFax: string;
	/**
	 * 承認機能必要フラグ
	 * - 承認機能必要フラグ
	 *   （0: 承認不要、1: 承認必要）
	 * - example: 0
	 */
	requireApprovalFlag: string;
	/**
	 * 段階リリース必要フラグ
	 * - 段階リリース必要フラグ
	 *   （0: 段階リリース不要、1: 段階リリース必要）
	 * - example: 0
	 */
	ecSiteFlag: Flag;
	/**
	 * 梱包ランク
	 * - 梱包ランク
	 *   （A: ランクA、B: ランクB、C: ランクC、D: ランクD、空: なし）
	 * - example: A
	 */
	packingRank: string;
	/**
	 * 通貨コード
	 * - 通貨コード
	 * - example: JPY
	 */
	currencyCode: string;
	/**
	 * 国コード
	 * - 国コード
	 * - example: JPN
	 */
	countryCode: string;
	/**
	 * 言語コード
	 * - 言語コード
	 * - example: MJP
	 */
	languageCode: string;
	/**
	 * 税込みフラグ
	 * - 税込みかどうか
	 *   0: 税込みでない
	 *   1: 税込み
	 * - example: 1
	 * - NOTE: WOSの得意先情報取得APIから返却されている「決済形態」から判別
	 *         クレカ・代引きユーザ 1:税込、
	 *         それ以外のユーザ 0:税抜
	 */
	includeTaxFlag?: Flag;
	/**
	 * 単価表参照フラグ
	 * - 税込みかどうか
	 *   0: 権限なし
	 *   1: 権限あり
	 * - example: 1
	 */
	priceListFlag?: Flag;
	/**
	 * 帳票値引き表示フラグ
	 * - 帳票値引き表示フラグ
	 * - example: 1
	 */
	showDiscountFlag: Flag;
	/**
	 * 納期マイナス日数
	 * - 納期マイナス日数
	 * - example: 1
	 */
	reductionDaysToShip: number;
	/**
	 * クーポン適用フラグ
	 * - クーポン適用フラグ
	 * - example: 1
	 */
	couponApplyFlag: Flag;

	couponFlag: Flag;

	transferAccount?: TransferAccount;

	maxCustomerOrderSlipNumberLength: number;

	customerOrderSlipNumberQuoteRequiredFlag: Flag;
	customerOrderSlipNumberOrderRequiredFlag: Flag;
	customerOrderItemNumberLocalLanguageFlag: Flag;

	unifiedDesignFlag: Flag;
	customerStatementFlag: Flag;
	billType?: string;
	newBillFlag?: Flag;
	shipToManageFlag?: Flag;
	shipToChangeFlag?: Flag;
	userManageFlag?: Flag;
	orderCancelDisplayFlag?: Flag;
	cartBulkAddFlag?: Flag;
	unfitReplyDateTimeDisplayFlag?: Flag;
	unfitReplyCompleteFlag?: Flag;
	exclusiveStaffType?: string;
	customerRankType?: string;
	freeDeliveryMinOrderAmount?: number;
	freeDeliveryMinOrderAmountIncludingTax?: number;
	strategyRecommendFlag?: Flag;
	customerEmail: string;
}

export type TransferAccount = {
	accountHolder: string;
	bankName: string;
	accountNumber: string;
};
