import { Story } from '@storybook/react';
import React from 'react';
import { CadPreviewError, Props } from './CadPreviewError';
import { errorTypeList } from './types';

export default {
	component: CadPreviewError,
	argTypes: {
		errorType: errorTypeList,
		isSinus: [true, false],
	},
};

export const _CadPreviewError: Story<Props> = args => (
	<>
		<dl>
			<dt>Control</dt>
			<dd>
				<CadPreviewError {...args} />
			</dd>
			{errorTypeList.map(errorType => {
				return [true, false].map(isSinus => {
					return (
						<div key={`${errorType}-${isSinus ? 'sinus' : 'cadenas'}`}>
							<hr />
							<dt>
								{isSinus ? `${errorType} / SINUS` : `${errorType} / CADENAS`}
							</dt>
							<dd>
								<CadPreviewError errorType={errorType} isSinus={isSinus} />
							</dd>
						</div>
					);
				});
			})}
		</dl>
	</>
);
