import { Translation } from '@/i18n/types';

export const cadDownloadPolicy: Translation = {
	title: 'Terms of use of CAD data',
	agree: 'Agree',
	disAgree: 'Cancel',
	checkBoxContent: "Don't Show Again",
	content: `
    <0>1. Purpose of Data Use</0>
    <1>
    MISUMI Corporation (hereafter called "MISUMI") offers CAD data found on this site (3D CAD Data, 3D Intermediate Data and 2D CAD Data) for the purpose of facilitating customers to verify interference, shape and other properties of the product manufactured by MISUMI or a manufacturer allied with MISUMI during the layout design phase.
    </1>
    <2>2. Characteristics of Data </2>
    <3>
    For the tolerance, surface roughness, chamfer, etc., there might be discrepancy between the CAD data and the actual product. Furthermore, for the purpose of reducing the file size of the CAD data and thereby, maintaining data offering, some information, including the one about oil groove and thread/spring shape, might be removed from the CAD data.  Please be forewarned.
    </3>
    <4>3. Disclaimer</4>
    <5>
    MISUMI creates each CAD data with its care and attention but cannot warrant the accuracy of the CAD data because of the said characteristics of data. And MISUMI may make some revision/addition to CAD data or delete it without notice. MISUMI tales no responsibility for any damage/loss that results from such revision/addition/deletion of CAD data. 
    </5>
    <6>4. Copyright</6>
    <7>
    All title and copyright in and to any information contained in the CAD Data are owned by MISUMI or the relevant manufacturer allied with MISUMI and are protected by the Copyright laws and international treaty provisions. Without prior approval from MISUMI, no part of the CAD data may be utilized (reproduced, modified, uploaded, presented, sent, distributed, licensed, sold, or published)for any purpose other than mentioned above.<br>In case that the CAD data is found to have been to be used for any purpose other than mentioned above or against the related laws, MISUMI may take legal actions, including the one for blocking the involved user from using CAD data and from accessing to the MISUMI site.
    </7>
    <8>5. Provision for Third Party</8>
    <9>
    In order to use the CAD data and data creator/view program whose copyright is owned by the third party (manufacturer allied with MISUMI), the user may be required to separately accept the provisions stipulated by the third party. MISUMI is not responsible for defects found on this CAD data or the related software or infringement arising therefrom. Please be forewarned. 
    </9>
`,
	web2CadPolicyContent: {
		title:
			'By downloading CAD data, you are agreeing to the following terms of use.',
		listItemFirst:
			'In order to download data, you are required to click this link to have access to the relevant external site (<0><0>http://www.web2cad.co.jp/</0></0>).',
		lisItemSecond:
			'For use of this external site, various provision related to the site (<0><0>Use Policy</0></0>、<1><0>Privacy Policy</0></1>) is applied to you.',
		endPolicy:
			'in addition, MISUMI does not disclose your personal information to the administrator of this external site.',
	},
};
