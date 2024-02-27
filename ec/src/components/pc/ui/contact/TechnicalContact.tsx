import classNames from 'classnames';
import React, { MouseEvent, VFC, useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './TechnicalContact.module.scss';
import { Anchor } from '@/components/pc/ui/links';
import { toUrl, url } from '@/utils/url';
import { openSubWindow } from '@/utils/window';
import { Button } from '@/components/pc/ui/buttons';
import { TextField } from '../fields';
import { siteFeedback } from '@/api/services/siteFeedback';
import { useMessageModal } from '../modals/MessageModal';

type Props = {
	onOpenChat: (event: MouseEvent) => void;
	setShouldShowForm: (value: boolean) => void;
};

/** Technical contact component */
export const TechnicalContact: VFC<Props> = ({
	onOpenChat,
	setShouldShowForm,
}) => {
	const [t] = useTranslation();

	const [commentBefore, setCommentBefore] = useState(true);

	const [sendText, setSendText] = useState('');
	const [senderName, setSenderName] = useState('');
	const [senderEmail, setSenderEmail] = useState('');
	const [senderContactNumber, setSenderContactNumber] = useState('');
	const { showMessage } = useMessageModal();

	const handleSendButtonClick = async () => {
		if (!sendText) return;
		try {
			const data = {
				name: senderName,
				email: senderEmail,
				tel: senderContactNumber,
				comment: sendText,
				url: window.location.href,
				title: document.title,
			};
			await siteFeedback(data);
			setCommentBefore(false);
		} catch (error) {
			showMessage({
				message: t('components.ui.contact.technicalContact.message.error'),
				button: (
					<Button>
						{t('components.ui.contact.technicalContact.message.ok')}
					</Button>
				),
			});
			setShouldShowForm(false);
		} finally {
			setSendText('');
			setSenderName('');
			setSenderEmail('');
			setSenderContactNumber('');
		}
	};
	return (
		<div className={styles.contactContainer}>
			<div className={styles.ballon}>
				<h3 className={styles.title}>
					{t('components.ui.contact.technicalContact.title')}
				</h3>
				<div className={styles.mainInner}>
					{commentBefore ? (
						<div className={styles.commentBef}>
							<dl className={styles.commentForm}>
								<dt>
									{t('components.ui.contact.technicalContact.description')}
								</dt>
								<dd>
									<textarea
										id="commentText"
										className={styles.textArea}
										rows={5}
										cols={100}
										value={sendText}
										onChange={e => {
											e.preventDefault();
											setSendText(e.target.value);
										}}
									></textarea>
								</dd>
							</dl>
							<dl className={styles.commentForm}>
								<dt>{t('components.ui.contact.technicalContact.name')}</dt>
								<dd>
									<TextField
										className={styles.inputText}
										value={senderName}
										onChange={setSenderName}
									/>
								</dd>
							</dl>
							<dl className={styles.commentForm}>
								<dt>{t('components.ui.contact.technicalContact.email')}</dt>
								<dd>
									<TextField
										className={styles.inputText}
										value={senderEmail}
										onChange={setSenderEmail}
									/>
								</dd>
							</dl>
							<dl className={styles.commentForm}>
								<dt>
									{t('components.ui.contact.technicalContact.contactNumber')}
								</dt>
								<dd>
									<TextField
										className={styles.inputText}
										value={senderContactNumber}
										onChange={setSenderContactNumber}
									/>
								</dd>
							</dl>
							<div className={styles.inner}>
								<p className={styles.buttonInner}>
									<Button
										theme="strong"
										className={styles.contactButton}
										onClick={handleSendButtonClick}
									>
										{t('components.ui.contact.technicalContact.send')}
									</Button>
								</p>
								<br />
								<div className={styles.unit}>
									<p>
										{t('components.ui.contact.technicalContact.inquryMessage1')}
										<br />
										<Trans i18nKey="components.ui.contact.technicalContact.inquryMessage2">
											<a
												className={styles.help}
												onClick={e => onOpenChat(e)}
											></a>
										</Trans>
										<br />
										<Trans i18nKey="components.ui.contact.technicalContact.inquryMessage3">
											<a
												className={styles.privacy}
												href={url.privacyPolicy}
												target="_blank"
											></a>
										</Trans>
									</p>
								</div>
							</div>
						</div>
					) : (
						<div className={styles.commentAft}>
							<div className={styles.inner}>
								<p className={styles.thank}>
									{t('components.ui.contact.technicalContact.thankMessage.one')}
									<br />
									{t('components.ui.contact.technicalContact.thankMessage.two')}
									<br />
									{t(
										'components.ui.contact.technicalContact.thankMessage.three'
									)}
									<br />
									{t(
										'components.ui.contact.technicalContact.thankMessage.four'
									)}
									<br />
									{t(
										'components.ui.contact.technicalContact.thankMessage.five'
									)}
								</p>
								<div className={styles.unit}>
									<p>
										{t(
											'components.ui.contact.technicalContact.thankMessage2.one'
										)}
										<br />

										<Trans i18nKey="components.ui.contact.technicalContact.thankMessage2.two">
											<a
												className={styles.help}
												onClick={e => onOpenChat(e)}
											></a>
										</Trans>
									</p>
									<p>
										<Trans i18nKey="components.ui.contact.technicalContact.inquryMessage3">
											<a
												className={styles.privacy}
												href={url.privacyPolicy}
												target="_blank"
											></a>
										</Trans>
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

TechnicalContact.displayName = 'TechnicalContact';
