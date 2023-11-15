import { useCallback, useState } from 'react';
import { Cookie, getCookie, setCookie, removeCookie } from '@/utils/cookie';

export const useCookie = <T extends string = string>(cookie: Cookie) => {
	// cookie として取得できる値の型が規定できないため(string |undefined)
	const [value, setValue] = useState<string | undefined>(getCookie(cookie));

	const set = useCallback(
		(value: T) => {
			setValue(value);
			setCookie(cookie, value);
		},
		[cookie]
	);

	const remove = useCallback(() => {
		setValue(undefined);
		removeCookie(cookie);
	}, [cookie]);

	return [value, set, remove] as const;
};
