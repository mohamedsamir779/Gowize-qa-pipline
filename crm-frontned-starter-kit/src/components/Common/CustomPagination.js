import React, { useEffect, useState } from "react";
import _ from "lodash";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  Col,
  Row,
} from "reactstrap";
import getWindowDimensions from "common/utils/windowResize";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";

function PaginationComponent({
  totalPages = 0,
  docs = [],
  sizePerPage = 10,
  page = 1,
  totalDocs = 0,
  hasNextPage = false,
  hasPrevPage = false,
  //   limit = 10,
  //   pagingCounter = 0,
  nextPage,
  prevPage,
  setSizePerPage = () => {},
  onChange = () => {},
  ...props
}) {
  const [dimensions, setDimension] = useState(getWindowDimensions() || {});
  const [navigationObj, setNavigationObj] = useState({
    prevGroup: {
      hasItems: false,
      startIndex: 0,
      endIndex: 0,
    },
    currentGroup: {
      currentPaginationIndex: 1,
      startIndex: 0,
      endIndex: 0,
      content: [],
    },
    nextGroup: {
      hasItems: true,
      startIndex: 0,
      endIndex: 0,
    },
  });

  const filterByWidth = (width) => {
    if (width < 700) {
      return 4;
    } else if (width < 1200) {
      return 7;
    } else if (width < 1300) {
      return 12;
    } else if (width < 1500) {
      return 15;
    } else if (width < 1800) {
      return 20;
    } else {
      return 25;
    }
  };

  let DISPLAYLIMIT = filterByWidth(dimensions.width);
  const { layoutMode } = useSelector(state => state.Layout);

  const processCurrentGroup = (newPage) => {
    if (totalPages == 0) {
      return;
    }
    const pageGroups = _.chunk(
      Array.from(Array(totalPages), (_, i) => i + 1),
      DISPLAYLIMIT
    );

    if (page) {
      navigationObj.currentGroup.currentPaginationIndex =
        pageGroups.findIndex((item) => item.indexOf(parseInt(page)) > -1) + 1;
    }

    if (newPage) {
      navigationObj.currentGroup.currentPaginationIndex = newPage;
    }

    const currentGroup =
      pageGroups[navigationObj.currentGroup.currentPaginationIndex - 1];
    navigationObj.currentGroup.content = currentGroup;
    navigationObj.currentGroup.startIndex = currentGroup[0];
    navigationObj.currentGroup.endIndex = currentGroup[currentGroup.length - 1];

    if (navigationObj.currentGroup.currentPaginationIndex - 1 > 0) {
      navigationObj.prevGroup.hasItems = true;
    } else {
      navigationObj.prevGroup.hasItems = false;
    }

    if (
      navigationObj.currentGroup.currentPaginationIndex + 1 <=
      pageGroups.length
    ) {
      navigationObj.nextGroup.hasItems = true;
    } else {
      navigationObj.nextGroup.hasItems = false;
    }

    setNavigationObj({
      ...navigationObj,
    });
  };

  useEffect(() => {
    processCurrentGroup();
  }, [totalPages, page, dimensions]);

  const prevPageGroup = () => {
    processCurrentGroup(navigationObj.currentGroup.currentPaginationIndex - 1);
  };

  const nextPageGroup = () => {
    processCurrentGroup(navigationObj.currentGroup.currentPaginationIndex + 1);
  };

  useEffect(() => {
    const handleResize = () => {
      setDimension(getWindowDimensions());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const location = useLocation();

  return (
    <React.Fragment>
      {
        <div
          className="align-items-md-center mt-30"
          style={{ overflow: "hidden" }}
        >
          <div className="p-2 border">
            <Row>
              <Col className="pagination pagination-rounded gap-4 d-flex align-items-md-center">
                <div className="custom-div">
                  {totalDocs > 0 && totalPages > 1 && (
                    <Pagination
                      aria-label="Page navigation example"
                      listClassName="justify-content-center"
                      // className="pagination pagination-rounded gap-4 d-flex align-items-md-center"
                    >
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => {
                            onChange(1, sizePerPage);
                            const previous = JSON.parse(
                              localStorage.getItem(location.pathname)
                            );
                            localStorage.setItem(
                              location.pathname,
                              JSON.stringify({
                                ...previous,
                                page: 1,
                              })
                            );
                          }}
                        >
                          {"<<"}
                        </PaginationLink>
                      </PaginationItem>
                      {hasPrevPage && (
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => {
                              onChange(prevPage, sizePerPage);
                              const previous = JSON.parse(
                                localStorage.getItem(location.pathname)
                              );
                              localStorage.setItem(
                                location.pathname,
                                JSON.stringify({
                                  ...previous,
                                  page: prevPage,
                                })
                              );
                            }}
                          >
                            {"<"}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      {navigationObj.prevGroup.hasItems && (
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => prevPageGroup()}
                            key={0}
                          >
                            {"..."}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      {navigationObj.currentGroup.content.map((index, i) => (
                        <PaginationItem
                          key={index}
                          active={index === page ? true : undefined}
                        >
                          <PaginationLink
                            onClick={() => {
                              onChange(index, sizePerPage);
                              const previous = JSON.parse(
                                localStorage.getItem(location.pathname)
                              );
                              localStorage.setItem(
                                location.pathname,
                                JSON.stringify({
                                  ...previous,
                                  page: index,
                                })
                              );
                            }}
                            key={index}
                            style={index === page ? {
                              backgroundColor: layoutMode === "dark" ? "#F89622" : "#426A9E",
                              borderColor: layoutMode === "dark" ? "#F89622" : "#426A9E",
                            } : {}}
                          >
                            {index}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      {navigationObj.nextGroup.hasItems && (
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => nextPageGroup()}
                            key={0}
                          >
                            {"..."}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      {hasNextPage && (
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => {
                              onChange(nextPage, sizePerPage);
                              const previous = JSON.parse(
                                localStorage.getItem(location.pathname)
                              );
                              localStorage.setItem(
                                location.pathname,
                                JSON.stringify({
                                  ...previous,
                                  page: nextPage,
                                })
                              );
                            }}
                          >
                            {">"}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => {
                            onChange(totalPages, sizePerPage);
                            const previous = JSON.parse(
                              localStorage.getItem(location.pathname)
                            );
                            localStorage.setItem(
                              location.pathname,
                              JSON.stringify({
                                ...previous,
                                page: totalPages,
                              })
                            );
                          }}
                        >
                          {">>"}
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  )}
                </div>
              </Col>
              <Col
                xs="6"
                sm="2"
                md="2"
                className="d-flex justify-content-md-end"
              >
                <div>Records:{docs.length}</div>
              </Col>
              <Col xs="6" sm="1" md="1" className="d-flex justify-content-end">
                <div>
                  <select
                    value={sizePerPage || 10}
                    onChange={(e) => {
                      setSizePerPage(e.target.value);
                    }}
                    className="p-1"
                    aria-label="Default select example"
                  >
                    <option defaultValue value={10}>
                      10
                    </option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={25}>25</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      }
    </React.Fragment>
  );
}

export default PaginationComponent;
