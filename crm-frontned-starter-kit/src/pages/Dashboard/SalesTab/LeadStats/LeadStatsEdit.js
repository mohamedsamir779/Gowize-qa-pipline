import React, { useEffect, useState } from "react";
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Row, Col
} from "reactstrap";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { startCase } from "lodash";
import { editProfileSettingsStart } from "store/actions";
import TableLoader from "components/Common/Loader";
import { useTranslation } from "react-i18next";
import { Accordion } from "react-bootstrap";

const LeadStageEditModal = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isOpen, toggle } = props;
  const {
    callStatus,
    defaultColors,
    settings,
    settingsClearingCounter,
    settingsLoading,
  } = useSelector(state => ({
    callStatus: state.dictionaryReducer.callStatus || [],
    defaultColors: state.dictionaryReducer.defaultCallStatusColors || [],
    settings: state.Profile.settings,
    settingsLoading: state.Profile.settingsLoading,
    settingsClearingCounter: state.Profile.settingsClearingCounter,
  }));
  const [selected, setSelected] = useState([]);
  const [limit, setLimit] = useState(5);
  const [enableColors, setEnableColors] = useState(false);
  const [colors, setColors] = useState({});
  const optionMulti = Object.keys(callStatus)?.map((stage) => ({
    value: stage,
    label: startCase(stage),
  })) || [];

  useEffect(() => {
    if (settings?.salesDashboard) {
      const defaultOptions = settings?.salesDashboard?.map((stage) => ({
        value: stage,
        label: startCase(stage),
      })) || [];
      setSelected(() => ([
        ...defaultOptions
      ]));
    }
    if (settings?.salesDashboardLimit) {
      setLimit(settings.salesDashboardLimit);
    }
  }, [settings.salesDashboard, settings.salesDashboardLimit]);

  useEffect(() => {
    if (settingsClearingCounter > 0 && isOpen) {
      toggle();
    }
  }, [settingsClearingCounter]);

  useEffect(() => {
    setEnableColors(settings.enableCallStatusColors);
    setColors(settings.callStatusColors);
  }, [settings.callStatusColors, settings.enableCallStatusColors]);
  
  useEffect(() => {
    if (!colors) {
      setColors(defaultColors);
    } else
    // if there is more colors in defaultColors than in colors, add the missing colors
    if (Object.keys(defaultColors).length > Object.keys(colors).length) {
      const newColors = { ...colors };
      Object.keys(callStatus).forEach((status) => {
        if (!newColors[status]) {
          newColors[status] = defaultColors[status];
        }
      });
      setColors(newColors);
    }
  }, [colors, defaultColors]);

  const saveUserSettings = () => {
    const selectedStages = selected.map((stage) => stage.value);
    dispatch(editProfileSettingsStart({
      settings: {
        salesDashboard: selectedStages,
        salesDashboardLimit: limit,
        callStatusColors: colors,
        enableCallStatusColors: enableColors,
      },
    }));
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{props.t("Edit Lead Stage View")}</ModalHeader>
      <ModalBody>
        {settingsLoading && <TableLoader />}
        {!settingsLoading && (
          <>
            <label id="aria-label" htmlFor="aria-example-input">
              {t("Lead Stage")}
            </label>
            <Select
              closeMenuOnSelect={false}
              defaultValue={[...selected]}
              onChange={setSelected}
              isMulti
              options={optionMulti}
              isOptionDisabled={() => selected.length >= 4}
              className="basic-multi-select mb-2"
              classNamePrefix="select"
            />
            <label id="aria-label" htmlFor="aria-example-input">
              {t("Limit")}
            </label>
            <Select
              label={t("Limit")}
              closeMenuOnSelect={true}
              defaultValue={{
                value: limit,
                label: limit,
              }}
              onChange={(e) => setLimit(e.value)}
              options={[{
                value: 5,
                label: 5,
              }, {
                value: 10,
                label: 10,
              }]}
              className="basic-select mb-3"
              classNamePrefix="select"
            />
            <label className="d-flex align-items-center">
              <input type="checkbox" checked={enableColors} onChange={(e) => {
                setEnableColors(e.target.checked);
              }}/>
              <b className="ms-2">{t("Enable Call Status Colors")}</b>
            </label>
            {enableColors && <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>{t("Colors")}</Accordion.Header>
                <Accordion.Body>
                  <Row>
                    {Object.keys(callStatus)?.map((stage) => (
                      <Col md="6" className="d-flex justify-content-between mb-2" key={stage}>
                        <span>{startCase(stage.toLowerCase())}</span>
                        <input type="color" value={colors[stage]} onChange={(e) => {
                          setColors((prev) => ({
                            ...prev,
                            [stage]: e.target.value,
                          }));
                        }}/>
                      </Col>
                    ))
                    }
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>}
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" disabled={settingsLoading} onClick={saveUserSettings}>Save</button>
        <button className="btn btn-secondary" onClick={toggle}>Cancel</button>
      </ModalFooter>
    </Modal>
  );
};

export default LeadStageEditModal;