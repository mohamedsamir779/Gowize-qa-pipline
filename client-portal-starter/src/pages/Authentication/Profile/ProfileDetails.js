import CardWrapper from "components/Common/CardWrapper";
import { useEffect, useState } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import {
  Col, Form as ReactStrapForm, Label, Row, Spinner, Button
} from "reactstrap";
import ChangePassword from "./ChangePassword";
import {
  Formik, Field as FormikField, Form as FormikForm
} from "formik";
import * as Yup from "yup";
import {
  editProfile,
  fetchProfile,
} from "../../../store/general/auth/profile/actions";
import { COUNTRIES } from "../../../helpers/countries";
import { NATIONALITIES } from "../../../helpers/nationalitites";
import { CustomInput } from "../../../components/Common/CustomInput";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";

const phoneRegExp = /(\+|00)(297|93|244|1264|358|355|376|971|54|374|1684|1268|61|43|994|257|32|229|226|880|359|973|1242|387|590|375|501|1441|591|55|1246|673|975|267|236|1|61|41|56|86|225|237|243|242|682|57|269|238|506|53|5999|61|1345|357|420|49|253|1767|45|1809|1829|1849|213|593|20|291|212|34|372|251|358|679|500|33|298|691|241|44|995|44|233|350|224|590|220|245|240|30|1473|299|502|594|1671|592|852|504|385|509|36|62|44|91|246|353|98|964|354|972|39|1876|44|962|81|76|77|254|996|855|686|1869|82|383|965|856|961|231|218|1758|423|94|266|370|352|371|853|590|212|377|373|261|960|52|692|389|223|356|95|382|976|1670|258|222|1664|596|230|265|60|262|264|687|227|672|234|505|683|31|47|977|674|64|968|92|507|64|51|63|680|675|48|1787|1939|850|351|595|970|689|974|262|40|7|250|966|249|221|65|500|4779|677|232|503|378|252|508|381|211|239|597|421|386|46|268|1721|248|963|1649|235|228|66|992|690|993|670|676|1868|216|90|688|886|255|256|380|598|1|998|3906698|379|1784|58|1284|1340|84|678|681|685|967|27|260|263)(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{4,20}$/im;

function ProfileDetails({ clientData, loading }) {
  const { t } = useTranslation();
  const { isCorporate, corporateInfo } = clientData;
  const { hqAddress, authorizedPerson, shareholders, directors } = corporateInfo;
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, t("Too Short!"))
      .max(15, t("Too Long!"))
      .required(t("Required")),
    lastName: Yup.string()
      .min(2, t("Too Short!"))
      .max(15, t("Too Long!"))
      .required(t("Required")),
    phone: Yup.string(t("Enter your Phone")).matches(phoneRegExp, t("Phone is not valid")).required(t("Phone is required")),
    city: Yup.string(t("Enter City")).required(t("City is required")),
    gender: Yup.string(t("Enter gender")).required(t("gender is required")),
    dob: Yup.date().max(new Date(Date.now() - 567648000000), t("You must be at least 18 years")).required(t("Required")),
    country: Yup.string(t("Select your country of residence")).required(t("Country of residence is required")),
    nationality: Yup.string(t("Select your nationality")).required(t("nationality is required")),

  });
  const dispatch = useDispatch();
  const history = useHistory();
  // const { clientData, loading, editLoading, editSuccess, error } = props.Profile;

  useEffect(() => {
    dispatch(fetchProfile({ history }));
  }, []);

  const [changePasswordModal, setChangePasswordModal] = useState(false);

  return (<>
    <CardWrapper className="glass-card" style={{ height: "100%" }}>
      {loading ? <Spinner animation="border" /> :
        <>
          {Object.keys(clientData || {}).length > 0 && <>
            <ProfileAvatar clientData={clientData}></ProfileAvatar>
            <Formik
              initialValues={{
                firstName: clientData.firstName,
                lastName: clientData.lastName,
                country: clientData.country,
                nationality: clientData.nationality,
                city: clientData.city,
                address: clientData.address,
                phone: clientData.phone,
                dob: clientData.dob,
                gender: clientData.gender,
                email: clientData.email,
                hqAddress,
                authorizedPerson,
                shareholders,
                directors
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                dispatch(editProfile(values));
              }}>
              {({ values, setFieldValue }) => (
                <ReactStrapForm tag={FormikForm}>
                  <Row className="mt-2">
                    <Col md={4}>
                      <div className="mb-3">
                        <Label htmlFor="firstName">{t(`${isCorporate ? "Company" : "First"} Name`)}</Label>
                        <FormikField
                          component={CustomInput}
                          name="firstName"
                          id="firstName"
                          type={"text"}
                          value={values.firstName}
                          disabled={true}
                        >
                        </FormikField>
                      </div>
                    </Col>
                    {!isCorporate && <Col md={4}>
                      <div className="mb-3">
                        <Label htmlFor="lastName">{t("Last Name")}</Label>
                        <FormikField
                          component={CustomInput}
                          name="lastName"
                          id="lastName"
                          type={"text"}
                          value={values.lastName}
                          disabled={true}
                        >
                        </FormikField>
                      </div>
                    </Col>}
                    <Col md={4}>
                      <div className="mb-3">
                        <Label htmlFor="email">{t("Email")}</Label>
                        <FormikField
                          component={CustomInput}
                          name="email"
                          id="email"
                          type={"text"}
                          value={values.email}
                          disabled={true}
                        >
                        </FormikField>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3">
                        <Label for="country">{t("Country")}</Label>
                        <FormikField
                          component={CustomInput}
                          name="country"
                          type="text"
                          value={values.country}
                          disabled={true}
                          onChange={(e) => {
                            const value = JSON.parse(e.target.value);
                            setFieldValue("country", value.countryEn);
                          }}
                        >
                          {COUNTRIES.map((c, key) => {
                            return <option key={key} value={JSON.stringify(c)}>{c.countryEn}</option>;
                          }
                          )}
                        </FormikField>
                      </div>
                    </Col>
                    {!isCorporate && <Col md={4}>
                      <div className="mb-3">
                        <Label for="nationality">{t("Nationality")}</Label>
                        <FormikField
                          component={CustomInput}
                          name="nationality"
                          type={"text"}
                          value={values.nationality}
                          disabled={true}
                        >
                          {NATIONALITIES.map((n, key) => {
                            return <option key={key} value={n.Nationality}>{n.Nationality}</option>;
                          }
                          )}
                        </FormikField>
                      </div>
                    </Col>}
                    <Col md={4}>
                      <div className="mb-3">
                        <Label for="phone">{t("Phone")}</Label>
                        <FormikField
                          component={CustomInput}
                          name="phone"
                          className={"form-control"}
                          value={values.phone}
                          disabled={true}
                        >
                        </FormikField>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3">
                        <Label for="dob">{t(`Date of ${isCorporate ? "Incorpration" : "Birth"}`)}</Label>
                        <FormikField
                          component={CustomInput}
                          name="dob"
                          type={"date"}
                          value={values.dob}
                          disabled={true}
                        >
                        </FormikField>
                      </div>
                    </Col>
                    {!isCorporate && <Col md={4}>
                      <div className="mb-3">
                        <Label for="gender">{t("Gender")}</Label>
                        <FormikField
                          component={CustomInput}
                          name="gender"
                          type={"text"}
                          disabled={true}
                        >
                          {/* {["Male", "Female"].map((n, key) => {
                            return <option key={key} value={n}>{n}</option>;
                          }
                          )} */}
                        </FormikField>
                      </div>
                    </Col>}
                    {!isCorporate && <Col md={4}>
                      <div className="mb-3">
                        <Label htmlFor="city">{t("City")}</Label>
                        <FormikField
                          component={CustomInput}
                          name="city"
                          id="city"
                          type="text"
                          value={values.city}
                          disabled={true}
                        >
                        </FormikField>
                      </div>
                    </Col>}
                  </Row>
                  {isCorporate &&
                    <>
                      <p className="fs-5 fw-bold">{t("Registered Address")}</p>
                      <Row>
                        <Col md={4}>
                          <div className="mb-3">
                            <Label htmlFor="registeredAddress">{t("Address")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="registeredAddress"
                              id="registeredAddress"
                              type="text"
                              value={values.address}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="mb-3">
                            <Label htmlFor="registeredCity">{t("City")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="registeredCity"
                              id="registeredCity"
                              type="text"
                              value={values.city}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="mb-3">
                            <Label htmlFor="registeredCountry">{t("Country")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="registeredCountry"
                              id="registeredCountry"
                              type="text"
                              value={values.country}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                      </Row>
                      <p className="fs-5 fw-bold">{t("HQ Address")}</p>
                      <Row>
                        <Col md={4}>
                          <div className="mb-3">
                            <Label htmlFor="hqAddress">{t("Address")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="hqAddress"
                              id="hqAddress"
                              type="text"
                              value={values.hqAddress.address}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="mb-3">
                            <Label htmlFor="hqCity">{t("City")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="hqCity"
                              id="hqCity"
                              type="text"
                              value={values.hqAddress.city}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="mb-3">
                            <Label htmlFor="hqCountry">{t("Country")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="hqCountry"
                              id="hqCountry"
                              type="text"
                              value={values.hqAddress.country}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                      </Row>
                      <p className="fs-5 fw-bold">{t("Shareholders")}</p>
                      {values.shareholders.map((shareholder) =>
                        <Row key={shareholder._id}>
                          <Col md={4} className="mb-2">
                            <Label htmlFor="firstNameSH">{t("First Name")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="firstNameSH"
                              id="firstNameSH"
                              type={"text"}
                              value={shareholder.firstName}
                              disabled={true}
                            >
                            </FormikField>
                          </Col>
                          <Col md={4} className="mb-2">
                            <Label htmlFor="lastNameSH">{t("Last Name")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="lastNameSH"
                              id="lastNameSH"
                              type={"text"}
                              value={shareholder.lastName}
                              disabled={true}
                            >
                            </FormikField>
                          </Col>
                          <Col md={4} className="mb-2">
                            <Label htmlFor="shares">{t("Shares %")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="shares"
                              id="shares"
                              type={"text"}
                              value={shareholder.sharesPercentage}
                              disabled={true}
                            >
                            </FormikField>
                          </Col>
                        </Row>)}
                      <p className="fs-5 fw-bold mt-1">{t("Directors")}</p>
                      {values.directors.map((director) =>
                        <Row className="mb-2" key={director._id}>
                          <Col md={4}>
                            <div>
                              <Label htmlFor="firstNameSH">{t("First Name")}</Label>
                              <FormikField
                                component={CustomInput}
                                name="firstNameSH"
                                id="firstNameSH"
                                type={"text"}
                                value={director.firstName}
                                disabled={true}
                              >
                              </FormikField>
                            </div>
                          </Col>
                          <Col md={4}>
                            <div>
                              <Label htmlFor="lastNameSH">{t("Last Name")}</Label>
                              <FormikField
                                component={CustomInput}
                                name="lastNameSH"
                                id="lastNameSH"
                                type={"text"}
                                value={director.lastName}
                                disabled={true}
                              >
                              </FormikField>
                            </div>
                          </Col>
                        </Row>)}
                      <p className="fs-5 fw-bold mt-1">{t("Authorized Person")}</p>
                      <Row className="mb-2">
                        <Col md={3}>
                          <div className="mb-3">
                            <Label htmlFor="firstNameAP">{t("First Name")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="firstNameAP"
                              id="firstNameAP"
                              type={"text"}
                              value={values.authorizedPerson.firstName}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="mb-3">
                            <Label htmlFor="lastNameAP">{t("Last Name")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="lastNameAP"
                              id="lastNameAP"
                              type={"text"}
                              value={values.authorizedPerson.lastName}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="mb-3">
                            <Label htmlFor="mobileAP">{t("Mobile")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="mobileAP"
                              id="mobileAP"
                              type={"text"}
                              value={values.authorizedPerson.phone}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="mb-3">
                            <Label htmlFor="titleAP">{t("Job Title")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="titleAP"
                              id="titleAP"
                              type={"text"}
                              value={values.authorizedPerson.jobTitle}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                      </Row>
                    </>}
                  {/* {editLoading && <Spinner animation="border" />} */}
                  {/* {!editLoading && <div className="mt-4">
                        <Button type="submit" className="btn w-lg blue-gradient-color">{t("Update Profile")}</Button>
                      </div>} */}
                  {/* {editSuccess && <Alert color="success my-2">{t(editSuccess)}</Alert>}
                  {!editLoading && error.length > 0 && <Alert color="danger my-2">{t(error)}</Alert>} */}
                </ReactStrapForm>)}
            </Formik>
            <Col md={2} className="my-auto">
              <Button type="button" onClick={(e) => {
                e.preventDefault();
                setChangePasswordModal(true);
                return false;
              }} className="border-0 color-bg-btn w-100 mt-2">
                {t("Edit Password")}
              </Button>
            </Col>
          </>}
        </>}
    </CardWrapper>
    <ChangePassword
      isOpen={changePasswordModal}
      toggle={() => {
        setChangePasswordModal(!changePasswordModal);
      }}
    ></ChangePassword>
  </>);
}
export default withTranslation()(ProfileDetails); 