import './Customers';
import React from 'react';
import { API_URL, request } from "./APIConnection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCheckCircle } from "@fortawesome/free-solid-svg-icons";




class Customer extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      editCustomerEnabled:false,
      id:this.props.customer.id,
      company_name:this.props.customer.company_name,
      company_nip:this.props.customer.company_nip,
      company_regon:this.props.customer.company_regon,
      customer_address:this.props.customer.customer_address,
      customer_postcode:this.props.customer.customer_postcode,
      customer_location:this.props.customer.customer_location,
      customer_voivodeship:this.props.customer.customer_voivodeship,
  customer_fullname:this.props.customer.customer_fullname,
  customer_pesel:this.props.customer.customer_pesel,
  delivery_address:this.props.customer.delivery_address,
  delivery_postcode:this.props.customer.delivery_postcode,
  delivery_location:this.props.customer.delivery_location,
  delivery_voivodeship:this.props.customer.delivery_voivodeship,
  customer_email:this.props.customer.customer_email,
  customer_telephone1:this.props.customer.customer_telephone1,
  customer_telephone2:this.props.customer.customer_telephone2
    }

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
this.enableEditCustomer=this.enableEditCustomer.bind(this);
this.deleteCustomer=this.deleteCustomer.bind(this);
this.saveCustomer=this.saveCustomer.bind(this);
this.enter=this.enter.bind(this);
}


  deleteCustomer(customer){
    if (window.confirm("Czy usunąć klienta?")) {
      fetch(request(`${API_URL}/deletecustomer`, "POST", {"id": customer.id}))
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      if (result.success) {
        this.props.refreshCustomers();
      } else {
        alert("SQL Erro - błędne wartości!")
      }
    })
    .catch((error) => Promise.reject(new Error(error)));
    } else {
    }

  }


  enableEditCustomer(){
    this.props.setSelectedCustomer(this.props.customer.id);
    this.setState({editCustomerEnabled: true});
  }

  disableEdit(){
    this.setState({editCustomerEnabled: false});
  }

  handleCompanyName(event) {
    this.setState({ company_name: event.target.value });
  }

  handleNIP(event){
    this.setState({ NIP: event.target.value });
  }

  handleREGON(event){
    this.setState({ REGON: event.target.value });
  }

  handleCustomerAddress(event){
    this.setState({ customer_address: event.target.value });

  }


  handleCustomerPostcode(event){
    this.setState({ customer_postcode: event.target.value });

  }

  handleCustomerLocation(event){
    this.setState({ customer_location: event.target.value });

  }
  handleCustomerVoivodeship(event){
    this.setState({ customer_voivodeship: event.target.value });

  }

  handleCustomerFullname(event){
    this.setState({ customer_fullname: event.target.value });

  }

  handlePESEL(event){
    this.setState({ PESEL: event.target.value });
  }

  handleDeliveryAddress(event){
    this.setState({ delivery_address: event.target.value });
  }

  handleDeliveryPostcode(event){
    this.setState({ delivery_postcode: event.target.value });
  }

  handleDeliveryLocation(event){
    this.setState({ delivery_location: event.target.value });
  }

handleDeliveryVoivodeship(event){
    this.setState({ delivery_voivodeship: event.target.value });
}

handleCustomerEmail(event){
    this.setState({ customer_email: event.target.value });
}

handleCustomerTelephone1(event){
    this.setState({ customer_telephone1: event.target.value });
}

handleCustomerTelephone2(event){
    this.setState({ customer_telephone2: event.target.value });
}
saveCustomer(){
  const customerData=this.state;
  delete customerData.editCustomerEnabled;
  this.props.editCustomer(customerData);
  this.setState({editCustomerEnabled:false});
}

enter(e){
  if (e.key === 'Enter') {
this.saveCustomer();
  }
}



render(){
  
const customer=this.props.customer;
const isEditEnabled=this.state.editCustomerEnabled;
const selectedCustomer=this.props.selectedCustomer;
const amISelectedToEdit=isEditEnabled && selectedCustomer===customer.id;
  return (
    <div className={"customerEntry " + (amISelectedToEdit ? "edit":"") } onClick={this.enableEditCustomer} key={this.props.index} onKeyDown={this.enter}>
    <div>{ amISelectedToEdit ? <input placeholder='Nazwa firmy' value={this.state.company_name} onChange={this.handleCompanyName}></input>:customer.company_name}</div>
    <div>{ amISelectedToEdit ?  <input placeholder='NIP' value={this.state.NIP} onChange={this.handleNIP}></input>:customer.NIP}</div>
    <div>{ amISelectedToEdit ?  <input placeholder='REGON' value={this.state.REGON} onChange={this.handleREGON}></input>:customer.REGON}</div>
    <div>{ amISelectedToEdit ?  <input placeholder='Adres' value={this.state.customer_address} onChange={this.handleCustomerAddress} required></input>:customer.customer_address}</div>
    <div>{ amISelectedToEdit ?  <input placeholder='Kod pocztowy' value={this.state.customer_postcode} onChange={this.handleCustomerPostcode} required></input>:customer.customer_postcode}</div>
    <div>{ amISelectedToEdit ? <input placeholder='Miejscowość' value={this.state.customer_location} onChange={this.handleCustomerLocation} required></input>:customer.customer_location}</div>
    <div>{ amISelectedToEdit ? <input placeholder='Województwo' value={this.state.customer_voivodeship} onChange={this.handleCustomerVoivodeship} required></input>:customer.customer_voivodeship}</div>
    <div>{ amISelectedToEdit ? <input placeholder='Imię i nazwisko' value={this.state.customer_fullname} onChange={this.handleCustomerFullname}></input>:customer.customer_fullname}</div>
    <div>{ amISelectedToEdit ? <input placeholder='PESEL' value={this.state.PESEL} onChange={this.handlePESEL} required></input>:customer.PESEL}</div>
    <div>{ amISelectedToEdit ?  <input placeholder='Adres dostawa' value={this.state.delivery_address} onChange={this.handleDeliveryAddress} required></input>:customer.delivery_address}</div>
    <div>{ amISelectedToEdit ?  <input placeholder='Kod dostawa' value={this.state.delivery_postcode} onChange={this.handleDeliveryPostcode} required></input>:customer.delivery_postcode}</div>
    <div>{ amISelectedToEdit ? <input placeholder='Miejscowość dostawa' value={this.state.delivery_location} onChange={this.handleDeliveryLocation} required></input>:customer.delivery_location}</div>
    <div>{ amISelectedToEdit ? <input placeholder='Województwo dostawa' value={this.state.delivery_voivodeship} onChange={this.handleDeliveryVoivodeship} required></input>:customer.delivery_voivodeship}</div>
    <div>{ amISelectedToEdit ? <input placeholder='E-mail' value={this.state.customer_email} onChange={this.handleCustomerEmail} required></input>:customer.customer_email}</div>
    <div>{ amISelectedToEdit ?  <input placeholder='Telefon 1' value={this.state.customer_telephone1} onChange={this.handleCustomerTelephone1} required></input>:customer.customer_telephone1}</div>
    <div>{ amISelectedToEdit ?  <input placeholder='Telefon 2' value={this.state.customer_telephone2} onChange={this.handleCustomerTelephone2} ></input>:customer.customer_telephone2}</div>
    { amISelectedToEdit ? <div onClick={this.saveCustomer}><FontAwesomeIcon icon={faCheckCircle} size="lg"/></div>:null}
</div>);}
}


export default Customer;
