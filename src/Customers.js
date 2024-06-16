import "./Customers.css";
import React from "react";
import { API_URL, request } from "./APIConnection";
import { isMobile } from 'react-device-detect';
import Customer from "./Customer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCheckCircle, faEdit,faLock,faUnlock } from "@fortawesome/free-solid-svg-icons";


class Customers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    selectedCustomer:'',
    showLockedCustomers:false,
    };
this.editCustomer=this.editCustomer.bind(this);
this.setSelectedCustomer=this.setSelectedCustomer.bind(this);
this.toggleLockedCustomersList=this.toggleLockedCustomersList.bind(this);
  }


  componentDidMount(){
  }
  
  refreshCustomers() {
    this.props.refreshCustomers();
  }

  setSelectedCustomer(id) {
    this.setState({ selectedCustomer: id });
  }


  toggleLockedCustomersList(){
    this.setState({showLockedCustomers:!this.state.showLockedCustomers});
  }

  editCustomer(customerData) {
    fetch(request(`${API_URL}/editcustomer`, "POST", customerData))
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
            this.props.refreshCustomers();
            this.setState({ selectedCustomer: '' });
        } else {
            console.log(result.msg)
          alert("SQL Error - powtarzające się nazwy lub błędne wartości!")
        }
      })
      .catch((error) => {alert("Błąd edycji klienta!"); return error});
  }



  renderCustomersTable() {
    return this.props.customers.map((customer, index) => {
      if (customer.is_active) {
        return <Customer refreshCustomers={this.props.refreshCustomers} editCustomer={this.editCustomer} selectedCustomer={this.state.selectedCustomer} setSelectedCustomer={this.setSelectedCustomer} customer={customer} key={index} index={index}></Customer>
      } else {
        return null;
      }
    });
  }
  

  renderLockedCustomersTable() {
    return this.props.customers.map((customer, index) => {
      if (!customer.is_active) {
        return <Customer refreshCustomers={this.props.refreshCustomers} editCustomer={this.editCustomer} selectedCustomer={this.state.selectedCustomer} setSelectedCustomer={this.setSelectedCustomer} customer={customer} key={index} index={index}></Customer>
      } else {
        return null;
      }
    });
  }
  

  render() {
    let customersTable;
    let lockedCustomersTable;
    if (this.props.customers !== '') customersTable = this.renderCustomersTable();
    if (this.props.customers !== '') lockedCustomersTable = this.renderLockedCustomersTable();

    const customersListTable = <div id="customers-list">
      <button onClick={this.toggleLockedCustomersList}>Zablokowani</button>
        <div className="head">
         <div>Nazwa firmy</div><div>NIP</div><div>REGON</div><div>Adres</div><div>Kod pocztowy</div><div>Miejscowość</div><div>Województwo</div>
         <div>Imię i nazwisko</div><div>PESEL</div>
         <div>Adres dostawa</div><div>Kod poczt. dostawa</div><div>Miejscowość dostawa</div><div>Woj. dostawa</div>
         <div>E-mail</div><div>Telefon 1</div><div>Telefon 2</div>
         <div className="iconTD">
          <FontAwesomeIcon icon={faEdit} size="lg" />
        </div>
        <div className="iconTD">
          <FontAwesomeIcon icon={faLock} size="lg" />
        </div>
        </div>
        <div className="body">
          {customersTable}
        </div>
    </div>;
const lockedCustomersListTable=<div id="customers-list">
<button onClick={this.toggleLockedCustomersList}>Aktywni</button>
  <div className="head">
   <div>Nazwa firmy</div><div>NIP</div><div>REGON</div><div>Adres</div><div>Kod pocztowy</div><div>Miejscowość</div><div>Województwo</div>
   <div>Imię i nazwisko</div><div>PESEL</div>
   <div>Adres dostawa</div><div>Kod poczt. dostawa</div><div>Miejscowość dostawa</div><div>Woj. dostawa</div>
   <div>E-mail</div><div>Telefon 1</div><div>Telefon 2</div>
   <div className="iconTD">
    <FontAwesomeIcon icon={faEdit} size="lg" />
  </div>
  <div className="iconTD">
    <FontAwesomeIcon icon={faUnlock} size="lg" />
  </div>
  </div>
  <div className="body">
    {lockedCustomersTable}
  </div>
</div>;
    return <div className="Customers">
      {!this.state.showLockedCustomers ? customersListTable: lockedCustomersListTable}
    </div>;
  }
}

export default Customers;
