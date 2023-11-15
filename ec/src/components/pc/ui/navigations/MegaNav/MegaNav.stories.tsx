import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/react';
import React from 'react';
import { Provider, useDispatch } from 'react-redux';
import { MegaNav } from './MegaNav';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { store } from '@/store';
import { loadTopCategories } from '@/store/modules/cache';

export default {
	component: MegaNav,
};

// TODO: 暫定的に story の中で redux を用いる。
//       ui component は redux に依存しないほうが良いかも。
const _Story: React.VFC = () => {
	const dispatch = useDispatch();
	useOnMounted(() => {
		loadTopCategories(dispatch)();
	});
	return <MegaNav onClickLink={action('clicked')} />;
};

export const _MegaNav: Story = () => {
	return (
		<Provider store={store}>
			<_Story />
		</Provider>
	);
};
