import React, { FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './CadDownloadPolicy.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { Checkbox } from '@/components/pc/ui/controls/checkboxes';
import { url } from '@/utils/url';

type Props = {
	isShowTermsOfUseMSM?: boolean;
	isShowTermsOfUseWeb2Cad?: boolean;
	onAgree: (isCheckboxChecked: boolean) => void;
};

/** Cad download policy */
export const CadDownloadPolicy: FC<Props> = ({
	isShowTermsOfUseMSM,
	isShowTermsOfUseWeb2Cad,
	onAgree,
}) => {
	const [t] = useTranslation();
	const [isChecked, setIsChecked] = useState(false);
	const [isShowCadDownloadPolicy, setIsShowCadDownloadPolicy] = useState(true);

	const handleAgree = (event: React.MouseEvent) => {
		event.stopPropagation();
		onAgree(isChecked);
	};

	const handleClose = () => {
		setIsShowCadDownloadPolicy(false);
	};

	if (!isShowCadDownloadPolicy) {
		return null;
	}

	return (
		<div className={styles.container}>
			{isShowTermsOfUseWeb2Cad && (
				<div>
					<h3 className={styles.title}>
						{t('components.domain.cadDownload.cadDownloadPolicy.title')}
					</h3>
					<div className={styles.content}>
						<p>
							{t(
								'components.domain.cadDownload.cadDownloadPolicy.web2CadPolicyContent.title'
							)}
						</p>
						<ul>
							<li className={styles.policyItem}>
								<Trans i18nKey="components.domain.cadDownload.cadDownloadPolicy.web2CadPolicyContent.listItemFirst">
									<a
										href={url.web2cadPolicy().home()}
										target="_blank"
										rel="noreferrer"
									>
										<span className={styles.policyItemLink} />
									</a>
								</Trans>
							</li>
							<li className={styles.policyItem}>
								<Trans i18nKey="components.domain.cadDownload.cadDownloadPolicy.web2CadPolicyContent.lisItemSecond">
									<a
										href={url.web2cadPolicy().copyrightEula()}
										target="_blank"
										rel="noreferrer"
									>
										<span className={styles.policyItemLink} />
									</a>
									<a
										href={url.web2cadPolicy().copyrightPrivacy()}
										target="_blank"
										rel="noreferrer"
									>
										<span className={styles.policyItemLink} />
									</a>
								</Trans>
							</li>
						</ul>
						<p>
							{t(
								'components.domain.cadDownload.cadDownloadPolicy.web2CadPolicyContent.endPolicy'
							)}
						</p>
					</div>
				</div>
			)}
			{isShowTermsOfUseMSM && (
				<div>
					<h3 className={styles.title}>
						{t('components.domain.cadDownload.cadDownloadPolicy.title')}
					</h3>
					<div className={styles.content}>
						<dl>
							<Trans i18nKey="components.domain.cadDownload.cadDownloadPolicy.content">
								<dl />
								<dt />
								<dl />
								<dt />
								<dl />
								<dt />
								<dl />
								<dt />
								<dl />
								<dt />
							</Trans>
						</dl>
					</div>
				</div>
			)}

			<div className={styles.checkBoxWrapper}>
				<Checkbox
					checked={isChecked}
					onChange={() => {
						setIsChecked(prev => !prev);
					}}
				>
					<span className={styles.checkBoxContent}>
						{t(
							'components.domain.cadDownload.cadDownloadPolicy.checkBoxContent'
						)}
					</span>
				</Checkbox>
			</div>

			<div className={styles.buttonGroup}>
				<div className={styles.buttonAgree}>
					<Button onClick={handleAgree}>
						{t('components.domain.cadDownload.cadDownloadPolicy.agree')}
					</Button>
				</div>

				<div className={styles.buttonDisagree}>
					<Button onClick={handleClose}>
						{t('components.domain.cadDownload.cadDownloadPolicy.disAgree')}
					</Button>
				</div>
			</div>
		</div>
	);
};
CadDownloadPolicy.displayName = 'CadDownloadPolicy';
