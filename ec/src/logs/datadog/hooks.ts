import { datadogLogs } from '@datadog/browser-logs';
import { useEffect } from 'react';
import { GlobalContext } from './types';
import { useSelector } from '@/store/hooks';
import { selectUser } from '@/store/modules/auth';
import { removeUser, setUser } from '@/utils/datadogRUM/rum';

/** Target keys of GlobalContext */
const keyList: Readonly<
	(keyof Pick<GlobalContext, 'customerCode' | 'userCode'>)[]
> = ['customerCode', 'userCode'] as const;
type Key = typeof keyList[number];

/** Add items to GlobalContext */
const add = (context: Partial<Record<Key, unknown>>) =>
	keyList.forEach(key => datadogLogs.addLoggerGlobalContext(key, context[key]));

/** Clear items in GlobalContext */
const clear = () =>
	keyList.forEach(key => datadogLogs.removeLoggerGlobalContext(key));

/** Update user data to GlobalContext when changed it */
export const useUpdateDatadogGlobalContext = () => {
	const user = useSelector(selectUser);
	useEffect(() => (user ? add(user) : clear()), [user]);
};

/** Update user data to RUM sessions when changed it */
export const useUpdateRumSessionUser = () => {
	const user = useSelector(selectUser);
	useEffect(() => (user ? setUser(user.userCode) : removeUser()), [user]);
};
