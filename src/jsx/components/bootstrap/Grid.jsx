import React, { Fragment } from "react";
import PageTitle from "../../layouts/PageTitle";
import { Row, Col, Card, Table } from "react-bootstrap";

const UiGrid = () => {
  return (
    <Fragment>
      <PageTitle activeMenu="Grid" pageContent="Grid" motherMenu="Bootstrap" />
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title>Grid options</Card.Title>
            </Card.Header>
            <Card.Body>
              <p>
                While Bootstrap u ses or for defining most sizes,are used for
                grid breakpoints and container widths. This is because the
                viewport width is in pixels and does not change with the font
                size. See how aspects of the Bootstrap grid system work across
                multiple devices with a handy table.
              </p>
              <Table bordered striped responsive>
                <thead>
                  <tr>
                    <th></th>
                    <th className="text-center text-black">
                      Extra small
                      <br />
                      <small className="text-black">&lt;576px</small>
                    </th>
                    <th className="text-center text-black">
                      Small
                      <br />
                      <small className="text-black">≥576px</small>
                    </th>
                    <th className="text-center text-black">
                      Medium
                      <br />
                      <small className="text-black">≥768px</small>
                    </th>
                    <th className="text-center text-black">
                      Large
                      <br />
                      <small className="text-black">≥992px</small>
                    </th>
                    <th className="text-center text-black">
                      Extra large
                      <br />
                      <small className="text-black">≥1200px</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="text-nowrap text-black" scope="row">
                      Max container width
                    </th>
                    <td>None (auto)</td>
                    <td>540px</td>
                    <td>720px</td>
                    <td>960px</td>
                    <td>1140px</td>
                  </tr>
                  <tr>
                    <th className="text-nowrap text-black" scope="row">
                      Class prefix
                    </th>
                    <td>
                      <code>.col-</code>
                    </td>
                    <td>
                      <code>.col-sm-</code>
                    </td>
                    <td>
                      <code>.col-md-</code>
                    </td>
                    <td>
                      <code>.col-lg-</code>
                    </td>
                    <td>
                      <code>.col-xl-</code>
                    </td>
                  </tr>
                  <tr>
                    <th className="text-nowrap text-black" scope="row">
                      # of columns
                    </th>
                    <td colSpan="5">12</td>
                  </tr>
                  <tr>
                    <th className="text-nowrap text-black" scope="row">
                      Gutter width
                    </th>
                    <td colSpan="5">24px (12px on each side of a column)</td>
                  </tr>
                  <tr>
                    <th className="text-nowrap text-black" scope="row">
                      Nestable
                    </th>
                    <td colSpan="5">Yes</td>
                  </tr>
                  <tr>
                    <th className="text-nowrap text-black" scope="row">
                      Column ordering
                    </th>
                    <td colSpan="5">Yes</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title>Grid Column</Card.Title>
            </Card.Header>
            <Card.Body>
              <p>
                Using a single set of grid classes, you can create a default
                grid system that starts out stacked on mobile devices and tablet
                devices (the extra small to small range) before becoming
                horizontal on desktop (medium) devices. Place grid columns in
                any
              </p>
              <Row>
                <Col lg={12}>
                  <div className="grid-col mb-4">.Col-lg-12</div>
                </Col>
              </Row>

              <Row>
                <Col xl={11}>
                  <div className="grid-col mb-4">.Col-lg-11</div>
                </Col>
                <Col xl={1}>
                  <div className="grid-col mb-4">.Col-lg-01</div>
                </Col>
              </Row>

              <Row>
                <Col xl={10}>
                  <div className="grid-col mb-4">.Col-lg-10</div>
                </Col>
                <Col xl={2}>
                  <div className="grid-col mb-4">.Col-lg-02</div>
                </Col>
              </Row>

              <Row>
                <Col xl={9}>
                  <div className="grid-col mb-4">.Col-lg-09</div>
                </Col>
                <Col xl={3}>
                  <div className="grid-col mb-4">.Col-lg-03</div>
                </Col>
              </Row>

              <Row>
                <Col xl={8}>
                  <div className="grid-col mb-4">.Col-lg-08</div>
                </Col>
                <Col xl={4}>
                  <div className="grid-col mb-4">.Col-lg-04</div>
                </Col>
              </Row>

              <Row>
                <Col xl={7}>
                  <div className="grid-col mb-4">.Col-lg-07</div>
                </Col>
                <Col xl={5}>
                  <div className="grid-col mb-4">.Col-lg-05</div>
                </Col>
              </Row>

              <Row>
                <Col xl={6}>
                  <div className="grid-col mb-4">.Col-lg-06</div>
                </Col>
                <Col xl={6}>
                  <div className="grid-col mb-4">.Col-lg-06</div>
                </Col>
              </Row>

              <Row>
                <Col xl={5}>
                  <div className="grid-col mb-4">.Col-lg-05</div>
                </Col>
                <Col xl={7}>
                  <div className="grid-col mb-4">.Col-lg-07</div>
                </Col>
              </Row>

              <Row>
                <Col xl={4}>
                  <div className="grid-col mb-4">.Col-lg-04</div>
                </Col>
                <Col xl={8}>
                  <div className="grid-col mb-4">.Col-lg-08</div>
                </Col>
              </Row>

              <Row>
                <Col xl={3}>
                  <div className="grid-col mb-4">.Col-lg-03</div>
                </Col>
                <Col xl={9}>
                  <div className="grid-col mb-4">.Col-lg-09</div>
                </Col>
              </Row>

              <Row>
                <Col xl={2}>
                  <div className="grid-col mb-4">.Col-lg-02</div>
                </Col>
                <Col xl={10}>
                  <div className="grid-col mb-4">.Col-lg-10</div>
                </Col>
              </Row>

              <Row>
                <Col xl={1}>
                  <div className="grid-col mb-4">.Col-lg-01</div>
                </Col>
                <Col xl={11}>
                  <div className="grid-col mb-4">.Col-lg-11</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default UiGrid;
