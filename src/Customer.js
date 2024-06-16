import './Customers';
import React from 'react';
import { API_URL, request } from "./APIConnection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCheckCircle ,faEdit,faLock,faUnlock} from "@fortawesome/free-solid-svg-icons";


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
  customer_telephone2:this.props.customer.customer_telephone2,
  is_active:this.props.customer.is_active,
  isNIPValid:true,
  isREGONValid:true,
  isPESELValid:true
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
this.lockCustomer=this.lockCustomer.bind(this);
this.unlockCustomer=this.unlockCustomer.bind(this);
this.saveCustomer=this.saveCustomer.bind(this);
this.enter=this.enter.bind(this);
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

  if (sum === digit11) {
    return true;
  } else {
    return false;
  }
}
peselToDigits(value) { return value.split("").map(item => parseInt(item));}

validatePESEL(value) {
  const digits = this.peselToDigits(value);

  if (digits.length !== 11 && digits.every(item => !isNaN(item))) {
    return false;
  }

  return this.checkSumPesel(digits);
}

validateNIP(nip) {
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
  return nipArray[9] === checkSum;
}


validateREGON(regon) {
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
if (checkSum === 10) {
    checkSum = 0;
}
return regonArray[8] === checkSum;
}


  lockCustomer(customer){
    if (window.confirm("Czy zablokować klienta?")) {
      fetch(request(`${API_URL}/lockcustomer`, "POST", {"id": customer.id}))
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        this.props.refreshCustomers();
      } else {
        alert("SQL Erro - błędne wartości!")
      }
    })
    .catch((error) => {alert("Błąd zablokowania klienta"); return error});
    } else {
    }
  }

  unlockCustomer(customer){
    if (window.confirm("Czy odblokować klienta?")) {
      fetch(request(`${API_URL}/unlockcustomer`, "POST", {"id": customer.id}))
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        this.props.refreshCustomers();
      } else {
        alert("SQL Erro - błędne wartości!")
      }
    })
    .catch((error) => {alert("Błąd odblokowania klienta"); return error});
    } else {
    }
  }


  enableEditCustomer(){
    this.props.setSelectedCustomer(this.props.customer.id);
    this.setState({editCustomerEnabled: !this.state.editCustomerEnabled});
  }

  disableEdit(){
    this.setState({editCustomerEnabled: false});
  }

  handleCompanyName(event) {
    this.setState({ company_name: event.target.value });
  }

  handleNIP(event){
    const NIP=event.target.value;
    const isNIPValid=this.validateNIP(NIP);
    if (!isNIPValid) {
      event.target.setCustomValidity("Błędny NIP");
    } else {
      event.target.setCustomValidity('');
    }
    this.setState({ company_nip: NIP,isNIPValid:isNIPValid });
    }

  handleREGON(event){
    const REGON=event.target.value;
    const isREGONValid=this.validateREGON(REGON);
    if (!isREGONValid) {
      event.target.setCustomValidity("Błędny REGON");
    } else {
      event.target.setCustomValidity('');
    }
    this.setState({ company_regon: REGON,isREGONValid:isREGONValid});
    }

  handleCustomerAddress(event){
    this.setState({ customer_address: event.target.value });

  }


  handleCustomerPostcode(event){
    if(event.target.validity.patternMismatch){
      event.target.setCustomValidity("Błędny format kodu pocztowego");
    } else {
      event.target.setCustomValidity('');
    }
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
    const PESEL=event.target.value;
    const isPESELValid=this.validatePESEL(PESEL);
    if (!isPESELValid) {
      event.target.setCustomValidity("Błędny PESEL");
    } else {
      event.target.setCustomValidity('');
    }
    this.setState({ customer_pesel: PESEL,isPESELValid:isPESELValid });
}

  handleDeliveryAddress(event){
    this.setState({ delivery_address: event.target.value });
  }

  handleDeliveryPostcode(event){
    if(event.target.validity.patternMismatch){
      event.target.setCustomValidity("Błędny format kodu pocztowego");
    } else {
      event.target.setCustomValidity('');
    }
    this.setState({ delivery_postcode: event.target.value });
  }

  handleDeliveryLocation(event){
    this.setState({ delivery_location: event.target.value });
  }

handleDeliveryVoivodeship(event){
    this.setState({ delivery_voivodeship: event.target.value });
}

handleCustomerEmail(event){
  const email=event.target.value;
  if(event.target.validity.patternMismatch){
    event.target.setCustomValidity("Błędny format e-mail");
  } else {
    event.target.setCustomValidity('');
  }
    this.setState({ customer_email: email});
}

handleCustomerTelephone1(event){
  if(event.target.validity.patternMismatch){
    event.target.setCustomValidity("Błędny format numeru telefonu");
  } else {
    event.target.setCustomValidity('');
  }
    this.setState({ customer_telephone1: event.target.value});
  }

  handleCustomerTelephone2(event){
    if(event.target.validity.patternMismatch){
      event.target.setCustomValidity("Błędny format numeru telefonu");
    } else {
      event.target.setCustomValidity('');
    }
      this.setState({ customer_telephone2: event.target.value});
    }
  
handleCustomerTelephone1(event){
  if(event.target.validity.patternMismatch){
    event.target.setCustomValidity("Błędny format numeru telefonu");
  } else {
    event.target.setCustomValidity('');
  }
    this.setState({ customer_telephone1: event.target.value });
}


saveCustomer(event){
  event.preventDefault();
  const customerData=this.state;
  delete customerData.editCustomerEnabled;
  delete customerData.is_active;
  delete customerData.isNIPValid;
  delete customerData.isREGONValid;
  delete customerData.isPESELValid;
  this.props.editCustomer(customerData);
  this.setState({editCustomerEnabled:false});
}

enter(e){
  if (e.key === 'Enter') {
this.saveCustomer();
  }
}


renderVoivodeshipSelection(handler,value) {
  return <select onChange={handler} value={value} required>
  <option value="dolnośląskie">dolnośląskie</option>
  <option value="kujawsko-pomorskie">kujawsko-pomorskie</option>
  <option  value="lubelskie">lubelskie</option>
  <option  value="lubuskie">lubuskie</option>
  <option value="łódzkie">łódzkie</option>
  <option  value="małopolskie">małopolskie</option>
  <option  value="mazowieckie">mazowieckie</option>
  <option  value="opolskie">opolskie</option>
  <option  value="podkarpackie">podkarpackie</option>
  <option value="podlaskie">podlaskie</option>
  <option value="pomorskie">pomorskie</option>
  <option  value="śląskie">śląskie</option>
  <option value="świętokrzyskie">świętokrzyskie</option>
  <option value="warmińsko-mazurskie">warmińsko-mazurskie</option>
  <option  value="wielkopolskie">wielkopolskie</option>
  <option  value="zachodniopomorskie">zachodniopomorskie</option>
  </select>
  }



render(){

  const customer=this.props.customer;
  const isEditEnabled=this.state.editCustomerEnabled;
  const selectedCustomer=this.props.selectedCustomer;
  const amISelectedToEdit=isEditEnabled && selectedCustomer===customer.id;
  const isCompany=customer.company_nip.length>0;
const editCustomer=<form className="editCustomer" onSubmit={this.saveCustomer} onKeyDown={this.enter}>
{isCompany ? <div className='editCustomerField'><p>Nazwa firmy:</p><input value={this.state.company_name} onChange={this.handleCompanyName}></input></div>:''}
{isCompany ? <div className='editCustomerField'><p>NIP</p><input className={this.state.isNIPValid ? 'valid':'invalid'}  value={this.state.company_nip} onChange={this.handleNIP}></input></div>:''}
{isCompany ? <div className='editCustomerField'><p>REGON:</p><input className={this.state.isREGONValid ? 'valid':'invalid'} value={this.state.company_regon} onChange={this.handleREGON}></input></div>:''}
<div className='editCustomerField'><p>Adres:</p><input  value={this.state.customer_address} onChange={this.handleCustomerAddress} required></input></div>
<div className='editCustomerField'><p>Kod pocztowy:</p><input maxLength="6" placeholder='Kod pocztowy XX-XXX' type="text"  pattern="^\d{2}-\d{3}$" value={this.state.customer_postcode} onChange={this.handleCustomerPostcode} required></input></div>
<div className='editCustomerField'><p>Miejscowość</p><input  value={this.state.customer_location} onChange={this.handleCustomerLocation} required></input></div>
<div className='editCustomerField'><p>Województwo:</p>{this.renderVoivodeshipSelection(this.handleCustomerVoivodeship,this.state.customer_voivodeship)}</div>
{!isCompany ? <div className='editCustomerField'><p>Imię i nazwisko</p><input  value={this.state.customer_fullname} onChange={this.handleCustomerFullname}></input></div>:''}
{!isCompany ? <div className='editCustomerField'><p>PESEL</p><input value={this.state.customer_pesel} onChange={this.handlePESEL}></input></div>:''}
<div className='editCustomerField'><p>Adres dostawa:</p><input  value={this.state.delivery_address} onChange={this.handleDeliveryAddress} required></input></div>
<div className='editCustomerField'><p>Kod dostawa:</p><input type="text" maxLength="6" placeholder='Kod dostawa XX-XXX' pattern="[0-9]{2}-[0-9]{3}" value={this.state.delivery_postcode} onChange={this.handleDeliveryPostcode} required></input></div>
<div className='editCustomerField'><p>Miejscowość dostawa:</p><input value={this.state.delivery_location} onChange={this.handleDeliveryLocation} required></input></div>
<div className='editCustomerField'><p>Województwo dostawa:</p>{this.renderVoivodeshipSelection(this.handleDeliveryVoivodeship,this.state.delivery_voivodeship)}</div>
<div className='editCustomerField'><p>E-mail</p><input pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$" value={this.state.customer_email} onChange={this.handleCustomerEmail} required></input></div>
<div className='editCustomerField'><p>Telefon 1:</p><input type="text" maxLength="9" pattern="\d{9}"  value={this.state.customer_telephone1} onChange={this.handleCustomerTelephone1} required></input></div>
<div className='editCustomerField'><p>Telefon 2:</p><input type="text" maxLength="9" pattern="\d{9}"  value={this.state.customer_telephone2} onChange={this.handleCustomerTelephone2}></input></div>
{ amISelectedToEdit ? <button type='submit'>ZAPISZ</button>:null}
</form>;

  return (
    <div className='customerEntryWrapper'>
    <div className={"customerEntry " + (amISelectedToEdit ? "edit":"") } onKeyDown={this.enter}>
    <div className='companyNameField'>{customer.company_name}</div>
    <div className='NIPField'>{customer.company_nip}</div>
    <div className='REGONField'>{customer.company_regon}</div>
    <div className='customerAddressField'>{customer.customer_address}</div>
    <div className='customerPostcodeField'>{customer.customer_postcode}</div>
    <div className='customerLocationField'>{customer.customer_location}</div>
    <div className='customerVoivodeshipField'>{ customer.customer_voivodeship}</div>
    <div className='customerFullnameField'>{ customer.customer_fullname}</div>
    <div className='PESELField'>{customer.customer_pesel}</div>
    <div className='deliveryAddressField'>{ customer.delivery_address}</div>
    <div className='deliveryPostcodeField'>{customer.delivery_postcode}</div>
    <div className='deliveryLocationField'>{customer.delivery_location}</div>
    <div className='deliveryVoivodeshipField'>{customer.delivery_voivodeship}</div>
    <div className='emailField'>{ customer.customer_email}</div>
    <div className='telField'>{ customer.customer_telephone1}</div>
    <div className='telField'>{ customer.customer_telephone2}</div>
    <div className="iconTD" onClick={this.enableEditCustomer}>
          <FontAwesomeIcon icon={faEdit} size="lg" />
        </div>
        {this.props.customer.is_active ?
        <div className="iconTD" onClick={()=>this.lockCustomer(customer)}>
          <FontAwesomeIcon icon={faLock} size="lg" />
        </div>: <div className="iconTD" onClick={()=>this.unlockCustomer(customer)}>
          <FontAwesomeIcon icon={faUnlock} size="lg" />
        </div>}
        </div>
{amISelectedToEdit ? editCustomer: ''}
</div>);}
}


export default Customer;
