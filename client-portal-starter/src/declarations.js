import {
  companyName,
  privacyPolicyLink,
  clientAgreementLink,
  companyWebsite,
} from "./content";

export const REGISTER = `By clicking here, I give my consent for ${companyName} to contact me for marketing purposes. You can opt out at any time. For further details, please see our Marketing and Communication Policy Statement. <a class="link-blue" style="cursor: pointer; color: #E4B200;" href="/${clientAgreementLink}" download="GW_Client_Agreement.pdf">Client Agreement</a>.`;

export const CLIENT_AGREEMENT = `You have read, understood, and agreed to ${companyName}'s <a class="link-blue" href=${clientAgreementLink} download="GW_Client_Agreement.pdf">client agreement</a>, which includes order execution policy, conflict of interest policy, privacy policy, 3rd party disclosure policy and any other terms in the client agreement.`;

export const IB_AGREEMENT = `You have read, understood, acknowledged, and agreed to all ${companyName}'s policies, terms & conditions and client agreements which are available on the company's <a href=${companyWebsite} target='_blank'>website</a>`;

export const COUNTRY_REGULATIONS = `You confirm that you do not breach any regulation of your country of residence in trading with ${companyName}.`;

export const E_SIGNATURE = "Your electronic signature is considered a legal and official signature.";
