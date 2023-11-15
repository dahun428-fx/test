// 親方向の相対パスによる import は eslint により禁じられています。
// このファイルは、i18n-ally の制約のため、親方向の相対パスによる import が特別に許可されています。
// https://github.com/misumi-org/order-web-id/issues/469
import { domain } from '../../../../../components/mobile/domain/domain.i18n.en';
import { applicationErrorContents } from '../../../../../components/mobile/error/ApplicationErrorContents.i18n.en';
import { errorHandler } from '../../../../../components/mobile/error/ErrorHandler.i18n.en';
import { headTitle } from '../../../../../components/mobile/head/HeadTitle.i18n.en';
import { footer } from '../../../../../components/mobile/layouts/footers/Footer/Footer.i18n.en';
import { header } from '../../../../../components/mobile/layouts/headers/Header.i18n.en';
import { addToCartModal } from '../../../../../components/mobile/modals/AddToCartModal/AddToCartModal.i18n.en';
import { loginModal } from '../../../../../components/mobile/modals/LoginModal/LoginModal.i18n.en';
import { orderNoListedProductModal } from '../../../../../components/mobile/modals/OrderNoListedProductModal/OrderNoListedProductModal.i18n.en';
import { paymentMethodRequiredModal } from '../../../../../components/mobile/modals/PaymentMethodRequiredModal/PaymentMethodRequiredContent.i18n.en';
import { category } from '../../../../../components/mobile/pages/Category/Category.i18n.en';
import { home } from '../../../../../components/mobile/pages/Home/Home.i18n.en';
import { keywordSearch } from '../../../../../components/mobile/pages/KeywordSearch/KeywordSearch.i18n.en';
import { notFound } from '../../../../../components/mobile/pages/NotFound/NotFound.i18n.en';
import { addToMyComponentsModal } from '../../../../../components/mobile/pages/ProductDetail/ProductActions/AddToMyComponentsModal/AddToMyComponentsModal.i18n.en';
import { productDetail } from '../../../../../components/mobile/pages/ProductDetail/ProductDetail.i18n.en';
import { sitemap } from '../../../../../components/mobile/pages/Sitemap/Sitemap.i18n.en';
import { techView } from '../../../../../components/mobile/pages/TechView/TechView.i18n.en';
import { economyLabel } from '../../../../../components/mobile/ui/labels/EconomyLabel.i18n';
import { saleLabel } from '../../../../../components/mobile/ui/labels/SaleLabel.i18n.en';
import { breadcrumbs } from '../../../../../components/mobile/ui/links/Breadcrumbs.i18n.en';
import { messageModal } from '../../../../../components/mobile/ui/modals/MessageModal/MessageModal.i18n.en';
import { bottomNav } from '../../../../../components/mobile/ui/navigations/BottomNav/BottomNav.i18n.en';
import { paginations } from '../../../../../components/mobile/ui/paginations/i18n.en';
import { daysToShip } from '../../../../../components/mobile/ui/text/DaysToShip/i18n.en';
import { deprecatedDaysToShip } from '../../../../../components/mobile/ui/text/DeprecatedDaysToShip/DeprecatedDaysToShip.i18n.en';
import { minQuantity } from '../../../../../components/mobile/ui/text/MinQuantity/MinQuantity.i18n.en';
import { orderDeadline } from '../../../../../components/mobile/ui/text/OrderDeadline/OrderDeadline.i18n.en';
import { priceWithSale } from '../../../../../components/mobile/ui/text/PriceWithSale/PriceWithSale.i18n.en';
import type { Translation } from '@/i18n/types';

const translation: Translation = {
	mobile: {
		common: {
			addToCart: 'Add to Cart',
			cart: {
				noPermission:
					'You do not have permission to add the product(s) to the cart',
			},
			daysToShipLabel: 'Days to Ship: <0 />',
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
			orderNow: 'Order Now',
			quantityLabel: 'Order Qty: <0 />',
			quote: {
				history: 'Quote History',
				quote: 'Quote',
			},
			totalPriceLabel: 'Total: <0 />',
			unitPriceLabel: 'Unit Price: <0 />',
		},
		components: {
			domain,
			error: {
				applicationErrorContents,
				errorHandler,
			},
			head: {
				headTitle,
			},
			layouts: {
				bottomNav,
				footers: {
					footer,
				},
				headers: {
					header,
				},
			},
			modals: {
				addToCartModal,
				addToMyComponentsModal,
				loginModal,
				orderNoListedProductModal,
				paymentMethodRequiredModal,
			},
			ui: {
				links: {
					breadcrumbs,
				},
				modals: {
					messageModal,
				},
				paginations,
				text: {
					daysToShip,
					deprecatedDaysToShip,
					minQuantity,
					orderDeadline,
					priceWithSale,
				},
			},
		},
		pages: {
			category,
			home,
			keywordSearch,
			notFound,
			productDetail,
			sitemap,
			techView,
		},
		ui: {
			labels: {
				economyLabel,
				saleLabel,
			},
			navigations: {
				bottomNav,
			},
		},
	},
};

// 'export default' for i18n-ally (vscode extension)
export default translation;
