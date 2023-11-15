import { Meta, Story } from '@storybook/react';
import React, { useReducer } from 'react';
import { useTimer } from './hooks';
import { TimerCancelError } from '@/errors/timer/TimerCancelError';

export default {
	title: 'hooks/useTimer',
	argTypes: {
		duration: {
			type: 'number',
		},
	},
} as Meta;

export const Example: Story = ({ duration = 500 }) => {
	const [keys, appendKey] = useReducer(
		(p: string[], v: string) => [...p, v],
		new Array<string>()
	);
	const timer = useTimer();

	const handleKeydown = async (event: React.KeyboardEvent) => {
		appendKey(event.key);
		timer.cancel();
		try {
			await timer.sleep(duration);
			appendKey('■');
		} catch (error) {
			if (!(error instanceof TimerCancelError)) {
				throw error;
			}
		}
	};

	return (
		<div>
			<p style={{ fontSize: '1rem' }}>
				{
					'If there is a {duration}ms gap between key typing, "■" will be displayed.'
				}
			</p>
			<input
				onKeyDown={handleKeydown}
				style={{ padding: '5px 10px', borderStyle: 'solid', width: '100%' }}
				placeholder="Please enter something."
			/>
			<div
				style={{
					height: '200px',
					border: '1px solid #ccc',
					padding: '5px',
					whiteSpace: 'pre-wrap',
					marginTop: '10px',
				}}
			>
				{keys.map((key, index) => (
					<span
						key={index}
						style={{ display: 'inline-block', marginLeft: '2px' }}
					>
						{key}
					</span>
				))}
			</div>
		</div>
	);
};
