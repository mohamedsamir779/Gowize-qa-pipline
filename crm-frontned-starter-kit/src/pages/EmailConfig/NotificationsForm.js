import CustomCreatableSelect from "components/Common/CustomCreatableSelect";
import TableLoader from "components/Common/Loader";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Label,
  Row
} from "reactstrap";
import { fetchNotificationGroups, updateNotificationGroups } from "store/actions";

export default function NotificationsForm(props) {
  const { t } = props;

  const { loading, groups } = useSelector((state) => state.systemEmailConfigReducer.notificationGroups);
  // const keys = Object.keys(groups);

  const dispatch = useDispatch();
  const loadNotificationGroups = () => {
    dispatch(fetchNotificationGroups());
  };

  const [state, dispatchState] = React.useReducer((state, action) => {
    console.log(action);
    switch (action.type) {
      case "KYC":
        return {
          ...state,
          KYC: action.KYC,
        };
      case "ACCOUNT":
        return {
          ...state,
          ACCOUNT: action.ACCOUNT,
        };
      case "TRANSACTIONS":
        return {
          ...state,
          TRANSACTIONS: action.TRANSACTIONS,
        };
      case "REQUESTS":
        return {
          ...state,
          REQUESTS: action.REQUESTS,
        };
      case "INIT":
        return {
          ...state,
          ...action.groups,
        };
      default:
        return state;
    }
  }, groups);

  React.useEffect(() => {
    loadNotificationGroups();
  }, []);

  useEffect(() => {
    dispatchState({
      type: "INIT",
      groups,
    });
  }, [groups]);
  
  
  return (
    <Row>
      <Col className="col-12">
        <Card>
          <CardTitle className="p-3">
            <h4 className="card-title color-primary">{t("Notifications")}</h4>
          </CardTitle>
          <CardBody>
            {
              loading ? <TableLoader /> : (
                <>
                  <div className="d-flex flex-row-reverse">
                    <Button color="primary" className="mb-3" onClick={() => {
                      dispatch(updateNotificationGroups(state));
                    }}>Update</Button>
                  </div>
                  {state && Object.keys(state).map((key) => {
                    return (<>
                      <Row className="px-5 py-2">
                        <Label>{t(`${key} GROUP`)}</Label>
                        <CustomCreatableSelect
                          isMulti
                          isClearable
                          placeholder={t(`${key} GROUP`)}
                          dispatchState={(passedData) => dispatchState({
                            type: key,
                            [key]: passedData,
                          })}
                          value={state && state[key]?.map((item) => {
                            return {
                              value: item,
                              label: item,
                            };
                          })}
                        />
                      </Row>
                    </>
                    );
                  })}
                </>
              )
            }
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}
