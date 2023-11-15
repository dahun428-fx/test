import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { Modal } from './Modal';
import { ModalOpener } from './ModalOpener';
import { ModalProvider } from './ModalProvider';
import { Button, LinkButton } from '@/components/mobile/ui/buttons';
import {
	MessageModalController,
	MessageModalProvider,
	useMessageModal,
} from '@/components/mobile/ui/modals/MessageModal';
import { ModalCloser } from '@/components/mobile/ui/modals/ModalCloser';

export default {
	component: Modal,
} as ComponentMeta<typeof Modal>;

export const _Example: ComponentStory<typeof Modal> = () => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div>
			<Button size="s" onClick={() => setIsOpen(true)} aria-haspopup="dialog">
				open
			</Button>
			<Modal title="foo bar" isOpen={isOpen} onCancel={() => setIsOpen(false)}>
				<div>Message</div>
				<div
					style={{
						marginTop: '20px',
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					<Button theme="default" size="m" onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
				</div>
			</Modal>
		</div>
	);
};

export const _Provider: ComponentStory<typeof ModalProvider> = () => {
	return (
		<ModalProvider>
			<ModalOpener>
				<Button theme="strong" size="s" icon="right-arrow">
					Login
				</Button>
			</ModalOpener>
			<Modal title="Login">
				<form
					onSubmit={event => {
						event.preventDefault();
						action('submit')();
					}}
				>
					<ul>
						<li>
							<label>
								Your Login ID:
								<input type="text" name="loginId" />
							</label>
						</li>
						<li style={{ marginTop: '10px' }}>
							<label>
								Your Password:
								<input type="password" name="password" />
							</label>
						</li>
					</ul>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: '20px',
						}}
					>
						<Button type="submit" size="s" theme="conversion">
							Submit
						</Button>

						<ModalCloser>
							<Button
								type="submit"
								size="s"
								theme="default-sub"
								style={{ marginLeft: '10px' }}
							>
								Cancel
							</Button>
						</ModalCloser>
					</div>
				</form>
			</Modal>
		</ModalProvider>
	);
};

export const _ShowMessage = () => {
	const ShowModalButtonGroup: React.FC = () => {
		const { showMessage } = useMessageModal();
		return (
			<div style={{ display: 'flex' }}>
				<Button
					theme="strong"
					size="m"
					onClick={() => showMessage('You clicked Me!!')}
				>
					{"Don't Click Me!!"}
				</Button>
				<Button
					theme="conversion"
					size="m"
					onClick={() =>
						showMessage({
							title: 'Congratulations!!',
							message: (
								<strong style={{ fontSize: '20px' }}>
									You can win $10 million!!!
								</strong>
							),
							button: (
								<LinkButton
									theme="default-sub"
									size="s"
									icon="right-arrow"
									href="https://google.com"
									target="_blank"
								>
									Click here!
								</LinkButton>
							),
						})
					}
				>
					Click Me!!
				</Button>
			</div>
		);
	};

	return (
		<MessageModalProvider>
			<ShowModalButtonGroup />
			<MessageModalController />
		</MessageModalProvider>
	);
};
