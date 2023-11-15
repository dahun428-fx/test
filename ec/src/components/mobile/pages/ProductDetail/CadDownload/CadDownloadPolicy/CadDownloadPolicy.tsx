import React, { FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './CadDownloadPolicy.module.scss';
import { Button } from '@/components/mobile/ui/buttons';
import { Checkbox } from '@/components/mobile/ui/controls/checkboxes';
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
				<div className={styles.section}>
					<h3 className={styles.title}>
						{t(
							'mobile.pages.productDetail.cadDownload.cadDownloadPolicy.title'
						)}
					</h3>
					<div className={styles.content}>
						<p>
							{t(
								'mobile.pages.productDetail.cadDownload.cadDownloadPolicy.web2CadPolicyContent.title'
							)}
						</p>
						<ul>
							<li className={styles.policyItem}>
								<Trans i18nKey="mobile.pages.productDetail.cadDownload.cadDownloadPolicy.web2CadPolicyContent.listItemFirst">
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
								<Trans i18nKey="mobile.pages.productDetail.cadDownload.cadDownloadPolicy.web2CadPolicyContent.lisItemSecond">
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
								'mobile.pages.productDetail.cadDownload.cadDownloadPolicy.web2CadPolicyContent.endPolicy'
							)}
						</p>
					</div>
				</div>
			)}
			{isShowTermsOfUseMSM && (
				<div className={styles.section}>
					<h3 className={styles.title}>
						{t(
							'mobile.pages.productDetail.cadDownload.cadDownloadPolicy.title'
						)}
					</h3>
					<div className={styles.content}>
						<dl>
							<Trans i18nKey="mobile.pages.productDetail.cadDownload.cadDownloadPolicy.content">
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
							'mobile.pages.productDetail.cadDownload.cadDownloadPolicy.checkBoxContent'
						)}
					</span>
				</Checkbox>
			</div>

			<div className={styles.buttonGroup}>
				<div className={styles.button}>
					<Button icon="right-arrow" onClick={handleAgree}>
						{t(
							'mobile.pages.productDetail.cadDownload.cadDownloadPolicy.agree'
						)}
					</Button>
				</div>

				<div className={styles.button}>
					<Button icon="right-arrow" onClick={handleClose}>
						{t(
							'mobile.pages.productDetail.cadDownload.cadDownloadPolicy.disAgree'
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};
CadDownloadPolicy.displayName = 'CadDownloadPolicy';
