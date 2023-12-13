//=============================================================================
// 親方向の相対パスによる import は eslint により禁じられています。
// このファイルは、i18n-ally の制約のため、親方向の相対パスによる import が特別に許可されています。
// https://github.com/misumi-org/order-web-id/issues/469
//=============================================================================
// import type 以外でパスに @ を使用してはいけません。i18n-ally の制約により相対パスで記述します。
//=============================================================================
import { cadDownload } from '../../../../../components/pc/domain/CadDownload/CadDownload.i18n.en';
import { category as categoryDomain } from '../../../../../components/pc/domain/category/category.i18n.en';
import { price } from '../../../../../components/pc/domain/price/price.i18n.en';
import { series } from '../../../../../components/pc/domain/series/series.i18n.en';
import { applicationErrorContents } from '../../../../../components/pc/error/ApplicationErrorContents.i18n.en';
import { errorHandler } from '../../../../../components/pc/error/ErrorHandler.i18n.en';
import { cadDownloadStatusBalloon } from '../../../../../components/pc/layouts/footers/CadDownloadStatusBalloon/CadDownloadStatusBalloon.i18n.en';
import { footer } from '../../../../../components/pc/layouts/footers/Footer/Footer.i18n.en';
import { headers } from '../../../../../components/pc/layouts/headers/headers.i18n.ko'; //change to ko
import { addToCartModal } from '../../../../../components/pc/modals/AddToCartModal/AddToCartModal.i18n.en';
import { loginModal } from '../../../../../components/pc/modals/LoginModal/LoginModal.i18n.en';
import { orderNoListedProductModal } from '../../../../../components/pc/modals/OrderNoListedProductModal/OrderNoListedProductModal.i18n.en';
import { paymentMethodRequiredModal } from '../../../../../components/pc/modals/PaymentMethodRequiredModal/PaymentMethodRequiredContent.i18n.en';
import { cadPreview } from '../../../../../components/pc/pages/CadPreview/CadPreview.i18n.en';
import { category } from '../../../../../components/pc/pages/Category/Category.i18n.en';
import { home } from '../../../../../components/pc/pages/Home/Home.i18n.en';
import { keywordSearch } from '../../../../../components/pc/pages/KeywordSearch/KeywordSearch.i18n.en';
import { notFound } from '../../../../../components/pc/pages/NotFound/NotFound.i18n.en';
import { productDetail } from '../../../../../components/pc/pages/ProductDetail/ProductDetail.i18n.en';
import { sitemap } from '../../../../../components/pc/pages/Sitemap/Sitemap.i18n.en';
import { techView } from '../../../../../components/pc/pages/TechView/TechView.i18n.en';
import { maker } from '../../../../../components/pc/pages/maker/maker.i18n.en';
import { displayTypeSwitch } from '../../../../../components/pc/ui/controls/select/DisplayTypeSwitch/DisplayTypeSwitch.i18n.en';
import { economyLabel } from '../../../../../components/pc/ui/labels/EconomyLabel.i18n';
import { saleLabel } from '../../../../../components/pc/ui/labels/SaleLabel.i18n.en';
import { breadcrumbs } from '../../../../../components/pc/ui/links/Breadcrumbs.i18n.en';
import { confirmModal } from '../../../../../components/pc/ui/modals/ConfirmModal/ConfirmModal.i18n.en';
import { messageModal } from '../../../../../components/pc/ui/modals/MessageModal/MessageModal.i18n.en';
import { megaNav } from '../../../../../components/pc/ui/navigations/MegaNav/MegaNav.i18n.en';
import { pagination } from '../../../../../components/pc/ui/paginations/i18n.en';
import { panels } from '../../../../../components/pc/ui/panels/i18n.en';
import { radio } from '../../../../../components/pc/ui/radio/i18n.en';
import { specs } from '../../../../../components/pc/ui/specs/specs.i18n.en';
import { text } from '../../../../../components/pc/ui/text/i18n.en';
import { toasts } from '../../../../../components/pc/ui/toasts/i18n.en';
import { useLogin } from '../../../../../hooks/auth/useLogin.i18n.en';
import { useTabTranslation } from '../../../../../hooks/i18n/useTabTranslation.i18n.en';
import { domain } from '../../../../../utils/domain/i18n.en';
import type { Translation } from '@/i18n/types';

const translation: Translation = {
	common: {
		cart: {
			noPermission:
				'You do not have permission to add the product(s) to the cart',
		},
		/**
		 * 注文に関する文言
		 * - 注: 2022/2/1 現在、模索中なので common への追加は慎重にお願いします。order.history ですらここに登録すべきか悩ましい。
		 *   以下は登録サンプルと捉えてください。いずれ消すかもしれません。
		 */
		order: {
			history: 'Order History',
			noPermission: 'You do not have order permission',
			order: 'Order',
		},
		quote: {
			history: 'Quote History',
			quote: 'Quote',
		},
	},
	components: {
		domain: {
			cadDownload,
			category: categoryDomain,
			price,
			series,
		},
		error: {
			applicationErrorContents,
			errorHandler,
		},
		modals: {
			addToCartModal,
			loginModal,
			orderNoListedProductModal,
			paymentMethodRequiredModal,
		},
		ui: {
			controls: {
				displayTypeSwitch,
			},
			labels: {
				economyLabel,
				saleLabel,
			},
			// TODO: layouts は ui ではないのできちんと別の場所にレイアウトする
			layouts: {
				footers: {
					cadDownloadStatusBalloon,
					footer,
				},
				headers,
			},
			links: {
				breadcrumbs,
			},
			modals: {
				confirmModal,
				messageModal,
			},
			navigations: {
				megaNav,
			},
			pagination,
			panels,
			radio,
			specs,
			text,
			toasts,
		},
	},
	// TODO: create src/hooks/hooks.i18n.en.ts, etc
	hooks: {
		auth: {
			useLogin,
		},
		i18n: {
			useTabTranslation,
		},
	},
	pages: {
		cadPreview,
		category,
		home,
		keywordSearch,
		maker,
		notFound,
		productDetail,
		sitemap,
		techView,
	},
	utils: {
		domain,
	},
};

// 'export default' for i18n-ally (vscode extension)
export default translation;
