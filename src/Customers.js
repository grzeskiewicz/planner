import "./Customers.css";
import React from "react";
import { API_URL, request } from "./APIConnection";
import Customer from "./Customer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit,faLock,faUnlock } from "@fortawesome/free-solid-svg-icons";
//import { isMobile } from 'react-device-detect';


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

    const head=<div className="head">
    <div className='companyNameField'>Firma</div><div className='NIPField'>NIP</div><div className='REGONField'>REGON</div><div className='customerAddressField'>Adres</div>
    <div className='customerPostcodeField'>Kod pocztowy</div><div className='customerLocationField'>Miejscowość</div><div className='customerVoivodeshipField'>Województwo</div>
    <div className='customerFullnameField'>Imię i nazwisko</div><div className='PESELField'>PESEL</div>
    <div className='deliveryAddressField'>Adres dostawa</div><div className='deliveryPostcodeField'>Kod poczt. dostawa</div><div className='deliveryLocationField'>Miejscowość dostawa</div>
    <div className='deliveryVoivodeshipField'>Woj. dostawa</div>
    <div className='emailField'>E-mail</div><div className='telField'>Telefon 1</div><div className='telField'>Telefon 2</div>
    <div className="iconTD">
     <FontAwesomeIcon icon={faEdit} size="lg" />
   </div>
   <div className="iconTD">
     <FontAwesomeIcon icon={this.state.showLockedCustomers ? faUnlock:faLock} size="lg" />
   </div>
   </div>;

    const customersListTable = <div id="customers-list">
      <button onClick={this.toggleLockedCustomersList}>Zablokowani</button>
{head}
        <div className="body">
          {customersTable}
        </div>
    </div>;
const lockedCustomersListTable=<div id="customers-list">
<button onClick={this.toggleLockedCustomersList}>Aktywni</button>
{head}
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
