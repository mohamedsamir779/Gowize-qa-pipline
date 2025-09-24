import React from "react";
import { useTranslation } from "react-i18next";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  Col,
} from "reactstrap";

function PaginationComponent({
  totalPages = 0,
  sizePerPage = 10,
  page = 1,
  totalDocs = 0,
  hasNextPage = false,
  hasPrevPage = false,
  //   limit = 10,
  //   pagingCounter = 0,
  nextPage,
  prevPage,
  setSizePerPage = () => { },
  onChange = () => { },
  isClientSide = false,
}) {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      {
        <div className="align-items-md-center">
          <div className="mb-3">
            <Col className="pagination-rounded gap-4 d-flex align-items-center justify-content-between" style={{ position:"relative" }}>
              <div className="mx-auto">
                {totalDocs > 0 && totalPages > 1 &&
                  <Pagination aria-label="Page navigation example" listClassName="justify-content-center"
                  // className="pagination pagination-rounded gap-4 d-flex align-items-md-center"
                  >

                    {hasPrevPage && <PaginationItem>
                      <PaginationLink onClick={() => { !isClientSide ? onChange(prevPage, sizePerPage) : onChange(page - 1) }}>{"<"}</PaginationLink>
                    </PaginationItem>}
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i} active={i + 1 === page ? true : undefined}>
                        <PaginationLink onClick={() => { onChange(i + 1, sizePerPage) }} key={i} >{i + 1}</PaginationLink>
                      </PaginationItem>
                    ))}
                    {hasNextPage && <PaginationItem>
                      <PaginationLink onClick={() => { !isClientSide ? onChange(nextPage, sizePerPage) : onChange(page + 1) }}>{">"}</PaginationLink>
                    </PaginationItem>}
                  </Pagination>
                }
              </div>
              <div className="d-flex align-items-center" style={{
                position:"absolute",
                right:"10px" 
              }}>
                <div className="me-2">{t("Records")}: {totalDocs}</div>
                <div>
                  <select onChange={(e) => setSizePerPage(parseInt(e.target.value, 10))} aria-label="Default select example">
                    <option defaultValue value={sizePerPage}>{sizePerPage}</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={25}>25</option>
                    <option value={30}>30</option>
                  </select>
                </div>
              </div>
            </Col>
          </div>
        </div>
      }

    </React.Fragment>);
}

export default PaginationComponent;