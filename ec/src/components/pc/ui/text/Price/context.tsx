import React, { createContext, useContext } from 'react';

const Context = createContext<string | null>(null);

/**
 * Currency provider
 * Price component describes this context.
 *
 * @see Price
 * @example
 * <CurrencyProvider ccyCode>
 * </CurrencyProvider>
 */
export const CurrencyProvider: React.FC<{ ccyCode?: string }> = ({
	ccyCode,
	children,
}) => {
	return (
		<Context.Provider value={ccyCode ?? null}>{children}</Context.Provider>
	);
};

export const useCurrencyContext = () => useContext(Context);
