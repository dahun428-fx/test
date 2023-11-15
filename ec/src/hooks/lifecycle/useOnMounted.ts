import { useEffect } from 'react';

/**
 * mount 時に指定の callback を実行します
 *
 * @param {() => any} callback mount 時に実行する callback(戻り値は cleanup として利用される。)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useOnMounted = (callback: () => any): void => {
	useEffect(() => {
		return callback();
		// WARN: useEffect 内の処理がどの変数に依存しているか、またどの変数に対する副作用なのかを
		//       明確にするために eslint を有効化しておく必要があります。
		//       無暗に react-hooks/exhaustive-deps を無効化すると不具合の元になるので、
		//       基本的には行わないでください。(callback を実行すべきタイミングで動かないなど。)
		//       ここでは、page / component のマウント時に唯一実行したいので、deps 無指定としています。
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
};
