//=============================================================================
// 親方向の相対パスによる import は eslint により禁じられています。
// このファイルは、i18n-ally の制約のため、親方向の相対パスによる import が特別に許可されています。
// https://github.com/misumi-org/order-web-id/issues/469
//=============================================================================
// import type 以外でパスに @ を使用してはいけません。i18n-ally の制約により相対パスで記述します。
//=============================================================================

import { chat } from '../../../../../components/shared/pages/Chat/Chat.i18n.en';
import type { Translation } from '@/i18n/types';

const translation: Translation = { shared: { pages: { chat } } };

// 'export default' for i18n-ally (vscode extension)
export default translation;
