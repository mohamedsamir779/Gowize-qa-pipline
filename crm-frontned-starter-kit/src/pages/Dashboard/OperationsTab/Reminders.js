import React, { useEffect, useState } from "react";
import {
  Card, CardBody, CardTitle, Row, Col
} from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import Loader from "components/Common/Loader";


const RemindersStats = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(props.type === 0
      ? props.todos
      : props.reminders
    );
  }, [props.todos, props.reminders]);

  return (
    <React.Fragment>
      <Card className="card-animate">
        <CardBody className="d-flex flex-column">
          <CardTitle className="color-primary">
            <h5 className="color-primary">{`${props.type === 0 ? "Tasks" : "Reminders"}`}</h5>
          </CardTitle>
          {props.loading && <Col sm={12}>
            <Loader />
          </Col>}
          {!props.loading && data.map((obj, index) => <div className="note-row py-2 px-3" key={index}>
            <div className="d-flex align-items-center">
              <i className="bx bx-message-alt-dots font-size-18"></i>
              <b className="ms-1 text-truncate">{obj.note}</b>
            </div>
            <p className="mb-0">
              <Link to={`/clients/${obj.customerId?._id}/notes`}>
                {`${obj.customerId?.firstName} ${obj.customerId?.lastName}`}
              </Link>
            </p>
            {props.type === 1 && <small>{new Date(obj.timeEnd).toUTCString()}</small>}
          </div>
          )}
          <div className="text-center mt-auto">
            <Link to={"/calendar"}>
              <h6 className="text-decoration-underline">More</h6>
            </Link>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  reminders: state.todosReducer.reminders && state.todosReducer.reminders.docs || [],
  todos: state.todosReducer.todos && state.todosReducer.todos.docs || [],
  loading: state.todosReducer.loading || false,
});

export default connect(mapStateToProps, null)(withTranslation()(RemindersStats));