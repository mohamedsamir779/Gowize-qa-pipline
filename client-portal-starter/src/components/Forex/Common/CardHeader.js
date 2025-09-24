import { useTranslation } from "react-i18next";

function CardHeader({ title, className }) {
  const { t } = useTranslation();
  return ( <div className={`d-flex justify-content-between border-bottom pb-2 ${className ? className : ""}`}>
    <h5>{t(title)}</h5>
    <div>
      <svg width="3" height="15" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="2" cy="2" r="2" fill="#74788D"/>
        <circle cx="2" cy="9" r="2" fill="#74788D"/>
        <circle cx="2" cy="16" r="2" fill="#74788D"/>
      </svg>
    </div>
  </div> );
}

export default CardHeader;