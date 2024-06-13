import "./Customers.css";
import React from "react";
import { API_URL, request } from "./APIConnection";
import { isMobile } from 'react-device-detect';
import Customer from "./Customer";


class Customers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    showACF:false,
    selectedCustomer:'',
    companyName:'',
    NIP:'',
    REGON:'',
    customerAddress:'',
    customerPostcode:'',
    customerLocation:'',
    customerVoivodeship:'',
    customerFullname:'',
    PESEL:'',
    deliveryAddress:'',
    deliveryPostcode:'',
    deliveryLocation:'',
    deliveryVoivodeship:'',
    customerEmail:'',
    customerTelephone1:'',
    customerTelephone2:''
    };

    this.handleCompanyName=this.handleCompanyName.bind(this);
this.handleNIP=this.handleNIP.bind(this);
this.handleREGON=this.handleREGON.bind(this);
this.handleCustomerAddress=this.handleCustomerAddress.bind(this);
this.handleCustomerPostcode=this.handleCustomerPostcode.bind(this);
this.handleCustomerLocation=this.handleCustomerLocation.bind(this);
this.handleCustomerVoivodeship=this.handleCustomerVoivodeship.bind(this);
this.handleCustomerFullname=this.handleCustomerFullname.bind(this);
this.handlePESEL=this.handlePESEL.bind(this);
this.handleDeliveryAddress=this.handleDeliveryAddress.bind(this);
this.handleDeliveryPostcode=this.handleDeliveryPostcode.bind(this);
this.handleDeliveryLocation=this.handleDeliveryLocation.bind(this);
this.handleDeliveryVoivodeship=this.handleDeliveryVoivodeship.bind(this);
this.handleCustomerEmail=this.handleCustomerEmail.bind(this);
this.handleCustomerTelephone1=this.handleCustomerTelephone1.bind(this);
this.handleCustomerTelephone2=this.handleCustomerTelephone2.bind(this);
this.addCustomer=this.addCustomer.bind(this);
this.editCustomer=this.editCustomer.bind(this);
this.setSelectedCustomer=this.setSelectedCustomer.bind(this);
  }

  refreshCustomers() {
    this.props.refreshCustomers();
  }

  setSelectedCustomer(id) {
    this.setState({ selectedCustomer: id });
  }

  addCustomer(event) {
    event.preventDefault();
   const customerData = JSON.parse(JSON.stringify(this.state));
delete customerData.showACF;
delete customerData.selectedCustomer
    fetch(request(`${API_URL}/addcustomer`, "POST", customerData))
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          this.props.refreshCustomers();
        } else {
            console.log(result.err)
          alert("SQL Error - powtarzające się nazwy lub błędne wartości!")
        }
      })
      .catch((error) => Promise.reject(new Error(error))); //Promise.reject(new Error(error))
  }


 checkSumPesel(digits) {
    const digit11 = digits[10];
    digits.pop();
  
    const times = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    const reducer = (accumulator, currentValue, index) => accumulator + (currentValue * times[index]);
  
    let sum = digits.reduce(reducer);
  
    sum %= 10;
    sum = 10 - sum;
    sum %= 10;
  
    if (sum == digit11) {
      return true;
    } else {
      return false;
    }
  }
 peselToDigits(value) { return value.split("").map(item => parseInt(item));}
  
validatePesel(value) {
    const digits = this.peselToDigits(value);
  
    if (digits.length !== 11 && digits.every(item => !isNaN(item))) {
      return false;
    }
  
    return this.checkSumPesel(digits);
  }

 validatenip(nip) {
    if (typeof nip === "number") {
        nip = nip.toString();
    } else {
        nip = nip.replace(/-/g, "");
    }

    if (nip.length !== 10) {
        return false;
    }

    const nipArray= nip.split("").map(value => parseInt(value));
    const checkSum = (6 * nipArray[0] + 5 * nipArray[1] + 7 * nipArray[2] + 2 * nipArray[3] + 3 * nipArray[4] + 4 * nipArray[5] + 5 * nipArray[6] + 6 * nipArray[7] + 7 * nipArray[8])%11;
    return nipArray[9] == checkSum;
}


validateregon(regon) {
  if (typeof regon === "number") {
      regon = regon.toString();
  } else {
      regon = regon.replace(/-/g, "");
  }

  if (regon.length !== 9) {
      return false;
  }

  const regonArray= regon.split("").map(value => parseInt(value));
  let checkSum = (8 * regonArray[0] + 9 * regonArray[1] + 2 * regonArray[2] + 3 * regonArray[3] + 4 * regonArray[4] + 5 * regonArray[5] + 6 * regonArray[6] + 7 * regonArray[7])%11;
  if (checkSum == 10) {
      checkSum = 0;
  }
  return regonArray[8] == checkSum;
}


  editCustomer(customerData) {
    fetch(request(`${API_URL}/editcustomer`, "POST", customerData))
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
            this.props.refreshCustomers();
            this.setState({ selectedCustomer: '' });
        } else {
            console.log(result.msg)
          alert("SQL Error - powtarzające się nazwy lub błędne wartości!")
        }
      })
      .catch((error) => Promise.reject(new Error(error))); //Promise.reject(new Error(error)) */
  }

  handleCompanyName(event) {
    this.setState({ companyName: event.target.value });
  }

  handleNIP(event){
    this.setState({ NIP: event.target.value });
  }

  handleREGON(event){
    this.setState({ REGON: event.target.value });
  }

  handleCustomerAddress(event){
    this.setState({ customerAddress: event.target.value });

  }


  handleCustomerPostcode(event){
    this.setState({ customerPostcode: event.target.value });

  }

  handleCustomerLocation(event){
    this.setState({ customerLocation: event.target.value });

  }
  handleCustomerVoivodeship(event){
    this.setState({ customerVoivodeship: event.target.value });

  }

  handleCustomerFullname(event){
    this.setState({ customerFullname: event.target.value });

  }

  handlePESEL(event){
    this.setState({ PESEL: event.target.value });
  }

  handleDeliveryAddress(event){
    this.setState({ deliveryAddress: event.target.value });
  }

  handleDeliveryPostcode(event){
    this.setState({ deliveryPostcode: event.target.value });
  }

  handleDeliveryLocation(event){
    this.setState({ deliveryLocation: event.target.value });
  }

handleDeliveryVoivodeship(event){
    this.setState({ deliveryVoivodeship: event.target.value });
}

handleCustomerEmail(event){
    this.setState({ customerEmail: event.target.value });
}

handleCustomerTelephone1(event){
    this.setState({ customerTelephone1: event.target.value });
}

handleCustomerTelephone2(event){
    this.setState({ customerTelephone2: event.target.value });
}


  renderCustomersTable() {
    return this.props.customers.map((customer, index) => {
      return <Customer editCustomer={this.editCustomer} selectedCustomer={this.state.selectedCustomer} setSelectedCustomer={this.setSelectedCustomer} customer={customer} key={index} index={index}></Customer>
    });
  }




  render() {
    let customersTable;
    if (this.props.customers !== '') customersTable = this.renderCustomersTable();
    const customersListTable = <div id="customers-list">
        <div className="head">
         <div>Nazwa firmy</div><div>NIP</div><div>REGON</div><div>Adres</div><div>Kod pocztowy</div><div>Miejscowość</div><div>Województwo</div>
         <div>Imię i nazwisko</div><div>PESEL</div>
         <div>Adres dostawa</div><div>Kod poczt. dostawa</div><div>Miejscowość dostawa</div><div>Woj. dostawa</div>
         <div>E-mail</div><div>Telefon 1</div><div>Telefon 2</div>
        </div>
        <div className="body">
          {customersTable}
        </div>
    </div>;
    const addCustomerForm = <form className="" onSubmit={this.addCustomer}>
      <input placeholder='Nazwa firmy' value={this.state.companyName} onChange={this.handleCompanyName}></input>
      <input placeholder='NIP' value={this.state.NIP} onChange={this.handleNIP}></input>
      <input placeholder='REGON' value={this.state.REGON} onChange={this.handleREGON}></input>
      <input placeholder='Adres' value={this.state.customerAddress} onChange={this.handleCustomerAddress} required></input>
      <input placeholder='Kod pocztowy' value={this.state.customerPostcode} onChange={this.handleCustomerPostcode} required></input>
      <input placeholder='Miejscowość' value={this.state.customerLocation} onChange={this.handleCustomerLocation} required></input>
      <input placeholder='Województwo' value={this.state.customerVoivodeship} onChange={this.handleCustomerVoivodeship} required></input>
      <input placeholder='Imię i nazwisko' value={this.state.customerFullname} onChange={this.handleCustomerFullname}></input>
      <input placeholder='PESEL' value={this.state.PESEL} onChange={this.handlePESEL}></input>
      <input placeholder='Adres dostawa' value={this.state.deliveryAddress} onChange={this.handleDeliveryAddress} required></input>
      <input placeholder='Kod dostawa' value={this.state.deliveryPostcode} onChange={this.handleDeliveryPostcode} required></input>
      <input placeholder='Miejscowość dostawa' value={this.state.deliveryLocation} onChange={this.handleDeliveryLocation} required></input>
      <input placeholder='Województwo dostawa' value={this.state.deliveryVoivodeship} onChange={this.handleDeliveryVoivodeship} required></input>
      <input placeholder='E-mail' value={this.state.customerEmail} onChange={this.handleCustomerEmail} required></input>
      <input placeholder='Telefon 1' value={this.state.customerTelephone1} onChange={this.handleCustomerTelephone1} required></input>
      <input placeholder='Telefon 2' value={this.state.customerTelephone2} onChange={this.handleCustomerTelephone2} ></input>

      <button type='submit'>DODAJ</button>
      {this.state.error !== '' ? <p className="error">{this.state.error}</p> : ''}
    </form>;

    return <div className="Customers">
      <div id="addCustomer">
        {isMobile ? <div className="acfWrapper"><button onClick={() => this.setState({ showAMF: !this.state.showACF })}>{this.state.showACF ? "ANULUJ" : "DODAJ KLIENTA"}</button>{this.state.showACF ? <div>{addCustomerForm}</div> : ''}</div> : <div>{addCustomerForm }</div>}
      </div>

      {!isMobile ? customersListTable: ''}
      {isMobile && !this.state.showAMF? customersListTable:''}
    </div>;
  }
}

export default Customers;
