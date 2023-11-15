import Router from 'next/router';
import { Logger } from '@/logs/datadog';

/** Session storage key */
const STORAGE_KEY = 'ROUTER_HISTORY';

type History = {
	current: string;
	prev?: string;
};

class RouterHistory {
	get referrer() {
		return () => this.getHistory()?.prev;
	}

	private get currentURL() {
		return () => this.getHistory()?.current;
	}

	private setHistory(history: History) {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
	}

	private pushHistory(nextPath: string) {
		const history = this.getHistory();
		this.setHistory({
			current: this.pathToURL(nextPath),
			prev: history?.current,
		});
	}

	private getHistory(): History | null {
		const history = sessionStorage.getItem(STORAGE_KEY);
		if (history) {
			try {
				return JSON.parse(history);
			} catch (error) {
				Logger.warn(`Could not convert to JSON. value=${history}`, { error });
			}
		}
		return null;
	}

	private get pathToURL() {
		return (path: string) => `${location.origin}${path}`;
	}

	constructor() {
		if (typeof document !== 'undefined') {
			const navigationType = getNavigationType();
			if (navigationType === 'back_forward') {
				// back or forward の場合は、SPA 遷移と同等の history の更新を行う
				// タブ復元のような back に当たるものの、同一ページに戻るような場合は history の更新は行わない
				if (this.currentURL() !== location.href) {
					this.pushHistory(location.pathname);
				}
			} else if (navigationType === 'reload') {
				// リロードの場合は、referrer は変わらないので何もしない
			} else {
				// 主に通常のナビゲーションの場合 document.referrer を用いて history を初期化する
				this.setHistory({ prev: document.referrer, current: location.href });
			}

			Router.events.on('routeChangeStart', location => {
				if (
					// NOTE: 初回の画面ランディング時に routeChangeStart がページによって発火する場合と発火されない場合がある
					//       その差を document の読み込み状況を持って均しています。
					document.readyState === 'complete' &&
					// NOTE: next/link と Router#push が併用されるケースに対応。（仮にされた場合に2重で history が更新されてしまう）
					this.currentURL() !== this.pathToURL(location)
				) {
					this.pushHistory(location);
				}
			});
		}
	}
}
export const routerHistory = new RouterHistory();

/**
 * どのようにページが読み込まれたか示す種別
 *
 * NOTE: Type variation
 * - navigate: ユーザー操作によるページの読み込み（通常のページ遷移）
 * - reload: ページの再読み込み
 * - back_forward: ブラウザの戻る、進む操作による読み込み
 * - prerender: プリレンダリングの結果として発生した読み込み
 */
function getNavigationType() {
	if (performance.getEntriesByType == null) {
		return false;
	}

	const [entry] = performance.getEntriesByType('navigation');
	return isPerformanceNavigationTiming(entry) && entry.type;
}

function isPerformanceNavigationTiming(
	entry?: PerformanceEntry
): entry is PerformanceNavigationTiming {
	// type しか見てないので、(ないと思うけど)他で使うときは要注意
	return entry != null && 'type' in entry;
}
