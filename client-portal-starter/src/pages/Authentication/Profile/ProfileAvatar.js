import { imagesUrl } from "content";
import {
  useEffect,
  useRef,
  useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Alert, Spinner } from "reactstrap";
import {
  convertProfile,
  fetchProfile,
  logoutUser,
  uploadProfileAvatar,
  deleteAvatarImage
} from "store/actions";

const EDITAVATARSTATE = {
  DEFAULT: 0,
  EDIT: 1,
  UPDATE: 2
};

function ProfileAvatar(props) {
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [fileUploadError, setFileUploadError] = useState(null);
  const [editAvatarState, setAvatarEditState] = useState(EDITAVATARSTATE.DEFAULT);
  const [avatarImage, setAvatarImage] = useState(props.clientData?.profileAvatar ? { preview: `${imagesUrl}/${props.clientData?.profileAvatar}` } : null);

  const fileInputRef = useRef();

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const convertClickHandler = () => {
    dispatch(convertProfile());
    dispatch(logoutUser(props.history));
  };

  const editProfileAvatar = () => {
    fileInputRef?.current?.click();
  };

  const onAvatarFileSelected = (file) => {
    setFileUploadError(null);

    if (file && file?.target?.files.length > 0) {
      const imageFile = file?.target?.files[0];

      let hasInvalidFiles = false;

      if (!`${imageFile.name}`.toLowerCase().endsWith(".png") && !`${imageFile.name}`.toLowerCase().endsWith(".jpg") && !`${imageFile.name}`.toLowerCase().endsWith(".jpeg")) {
        hasInvalidFiles = true;
      }

      if (hasInvalidFiles) {
        setAvatarImage(null);
        setAvatarEditState(EDITAVATARSTATE.EDIT);
        setFileUploadError("Invalid file extensions. Upload only PNG or JPG format.");
        return;
      }

      const image = Object.assign(imageFile, {
        preview: URL.createObjectURL(imageFile),
        formattedSize: formatBytes(imageFile.size),
      });
      setAvatarImage(image);
      setAvatarEditState(EDITAVATARSTATE.UPDATE);
    }
  };

  const uploadNewAvatarImage = () => {
    dispatch(uploadProfileAvatar(avatarImage, () => {
      dispatch(fetchProfile({ history }));
    }));
  };

  const deleteProfileAvatarImage = () => {
    if (avatarImage.formattedSize) {
      if (fileInputRef && fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setAvatarImage(null);
      setAvatarEditState(EDITAVATARSTATE.EDIT);
    } else {
      dispatch(deleteAvatarImage(() => {
        setTimeout(() => dispatch(fetchProfile({ history })), 100);
      }));
    }
  };

  useEffect(() => {
    if (props.clientData && !props.clientData?.profileAvatar) {
      setTimeout(() => {
        setAvatarImage(null);
      }, 100);
      setAvatarEditState(EDITAVATARSTATE.EDIT);
    } else {
      setTimeout(() => {
        setAvatarImage({ preview: `${props.clientData?.profileAvatar}` });
      }, 100);
      setAvatarEditState(EDITAVATARSTATE.EDIT);
    }
  }, [props.clientData?.profileAvatar]);

  return (
    <>
      <div className="d-flex">
        {props.clientData.firstName ?
          <button type="button" className="btn btn-light position-relative p-0 avatar-lg rounded-circle shadow">
            {avatarImage && (<img className="avatar-title avatar-image bg-transparent text-reset fs-2" src={avatarImage.preview} />)}
            {!avatarImage && (<span className="avatar-title bg-transparent text-reset fs-2">
              {props.clientData.firstName[0]}{props.clientData.lastName?.[0]}
            </span>)}
          </button>
          : <Spinner></Spinner>}
        <div>
          <div className="btn btn-no-pointer d-flex fw-bold color-black fs-5" style={{ marginBottom: -15 }}>{`${props.clientData.firstName} ${props.clientData.lastName ? props.clientData.lastName : ""}`}</div>
          <div className="d-flex">
            <input hidden type="file" accept=".png, .jpg" ref={fileInputRef} onChange={onAvatarFileSelected} />
            {editAvatarState == EDITAVATARSTATE.EDIT && (<button className="btn btn-link color-fblue" onClick={editProfileAvatar}>{t(avatarImage ? "Edit" : "Upload")}</button>)}
            {editAvatarState == EDITAVATARSTATE.UPDATE && (<button className="btn btn-link color-fblue" onClick={uploadNewAvatarImage}>{t("Update")}</button>)}
            {avatarImage && (<button className="btn btn-link text-muted" onClick={deleteProfileAvatarImage}>{t("Delete")}</button>)}
          </div>
          {fileUploadError ? (<Alert color="danger">{fileUploadError}</Alert>) : null}
        </div>
      </div>
      <div className="mx-1">
        {props.clientData && props.clientData?.fx?.isDemo &&
          <button
            className="btn  w-md m-2 shadow color-bg-btn color-white border-0"
            onClick={convertClickHandler}
          >
            {t("Convert to live")}
          </button>
        }
      </div>
    </>
  );
}

export default ProfileAvatar;