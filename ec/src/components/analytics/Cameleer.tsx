import Script from 'next/script';
import React from 'react';
import { config } from '@/config';

export const Cameleer: React.FC = () => {
	return (
		<Script
			type="text/javascript"
			src={`${config.api.cameleer.origin}/cameleer/js/cameleer.js`}
		/>
	);
};
Cameleer.displayName = 'Cameleer';
