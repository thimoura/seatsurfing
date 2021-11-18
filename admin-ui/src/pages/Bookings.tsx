import React from 'react';
import FullLayout from '../components/FullLayout';
import Loading from '../components/Loading';
import { Booking, Formatting } from 'flexspace-commons';
import { Table, Form, Col, Row, Button } from 'react-bootstrap';
import { Search as IconSearch, Download as IconDownload } from 'react-feather';
import ExcellentExport from 'excellentexport';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

interface State {
  loading: boolean
  start: string
  end: string
}

interface Props {
  t: TFunction
}

class Bookings extends React.Component<Props, State> {
  data: Booking[];

  constructor(props: any) {
    super(props);
    this.data = [];
    this.state = {
      loading: true,
      start: Formatting.getISO8601(new Date()),
      end: Formatting.getISO8601(new Date())
    };
  }

  componentDidMount = () => {
    this.loadItems();
  }

  loadItems = () => {
    let end = new Date(this.state.end);
    end.setUTCHours(23, 59, 59);
    Booking.listFiltered(new Date(this.state.start), end).then(list => {
      this.data = list;
      this.setState({ loading: false });
    });
  }

  renderItem = (booking: Booking) => {
    return (
      <tr key={booking.id}>
        <td>{booking.user.email}</td>
        <td>{booking.space.location.name}</td>
        <td>{booking.space.name}</td>
        <td>{Formatting.getFormatterShort().format(booking.enter)}</td>
        <td>{Formatting.getFormatterShort().format(booking.leave)}</td>
      </tr>
    );
  }

  onFilterSubmit = (e: any) => {
    e.preventDefault();
    this.setState({ loading: true });
    this.loadItems();
  }

  exportTable = (e: any) => {
    return ExcellentExport.convert(
      { anchor: e.target, filename: "seatsurfing-bookings", format: "xlsx"},
      [{name: "Seatsurfing Bookings", from: {table: "datatable"}}]
    );
  }

  render() {
    let searchButton = <Button className="btn-sm" variant="outline-secondary" type="submit" form="form"><IconSearch className="feather" /> {this.props.t("search")}</Button>;
    // eslint-disable-next-line
    let downloadButton = <a download="seatsurfing-bookings.xlsx" href="#" className="btn btn-sm btn-outline-secondary" onClick={this.exportTable}><IconDownload className="feather" /> {this.props.t("download")}</a>;
    let buttons = (
      <>
        {this.data && this.data.length > 0 ? downloadButton : <></>}
        {searchButton}
      </>
    );
    let form = (
      <Form onSubmit={this.onFilterSubmit} id="form">
        <Form.Group as={Row}>
          <Form.Label column sm="2">{this.props.t("enter")}</Form.Label>
          <Col sm="4">
            <Form.Control type="date" value={this.state.start} onChange={(e: any) => this.setState({ start: e.target.value })} required={true} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">{this.props.t("leave")}</Form.Label>
          <Col sm="4">
            <Form.Control type="date" value={this.state.end} onChange={(e: any) => this.setState({ end: e.target.value })} required={true} />
          </Col>
        </Form.Group>
      </Form>
    );

    if (this.state.loading) {
      return (
        <FullLayout headline={this.props.t("bookings")}>
          {form}
          <Loading />
        </FullLayout>
      );
    }

    let rows = this.data.map(item => this.renderItem(item));
    if (rows.length === 0) {
      return (
        <FullLayout headline={this.props.t("bookings")} buttons={buttons}>
          {form}
          <p>{this.props.t("noRecords")}</p>
        </FullLayout>
      );
    }
    return (
      <FullLayout headline={this.props.t("bookings")} buttons={buttons}>
        {form}
        <Table striped={true} hover={true} className="clickable-table" id="datatable">
          <thead>
            <tr>
              <th>{this.props.t("user")}</th>
              <th>{this.props.t("area")}</th>
              <th>{this.props.t("space")}</th>
              <th>{this.props.t("enter")}</th>
              <th>{this.props.t("leave")}</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
      </FullLayout>
    );
  }
}

export default withTranslation()(Bookings as any);
