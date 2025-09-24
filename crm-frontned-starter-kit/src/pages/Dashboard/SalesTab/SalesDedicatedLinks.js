import React from "react";
import salesDedicatedLinks from "common/salesDedicatedLinks";
import { useDispatch, useSelector } from "react-redux";
import { showSuccessNotification } from "store/notifications/actions";
import {
  Card,
  Col,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom";
import TableLoader from "components/Common/Loader";

const SalesDedicatedLinks = () => {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state) => state.Profile);
  return (
    <Card className="card-animate mb-2">
      <Row className="justify-content-center">
        <Col className="text-center" lg={12}>
          <div className="card-header">
            <div className="card-title">
              <h4 className="color-primary"> Dedicated Links</h4>
            </div>
            {loading && (
              <TableLoader />
            )}
            {!loading && userData.userId && salesDedicatedLinks.map((link) => {
              return (
                <>
                  <div>
                    <Link to="#"
                      className="mdi mdi-clipboard-check-multiple-outline font-size-20 me-2"
                      onClick={() => {
                        navigator.clipboard.writeText(`${link}?salesRef=${userData.userId}`);
                        dispatch(showSuccessNotification("Link copied to clipboard"));
                      }}
                    ></Link>
                    <span>{`${link}?salesRef=${userData.userId}`}</span>
                  </div>
                </>
              );
            })}
            {!loading && !userData.userId && (
              <div className="mt-4">
                <h5 className="text-danger">
                  Failed to generate dedicated links. Please contact support.
                </h5>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default SalesDedicatedLinks;