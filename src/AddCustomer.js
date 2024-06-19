import "./Customers.css";
import React from "react";
import { API_URL, request } from "./APIConnection";
import { validateNIP,validateREGON, validatePESEL } from "./CustomerCommon";
//import { isMobile } from 'react-device-detect';


class AddCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    companyName:'',
    NIP:'',
    REGON:'',
    customerAddress:'',
    customerPostcode:'',
    customerLocation:'',
    customerVoivodeship:'pomorskie',
    customerFullname:'',
    PESEL:'',
    deliveryAddress:'',
    deliveryPostcode:'',
    deliveryLocation:'',
    deliveryVoivodeship:'pomorskie',
    customerEmail:'',
    customerTelephone1:'',
    customerTelephone2:'',
    isPESELValid:true,
    isNIPValid:true,
    isREGONValid:true,
    isEmailValid:true,
    isTelNum1Valid:true,
    isTelNum2Valid:true,
    showCompanyForm:true
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
this.toggleCustomerType=this.toggleCustomerType.bind(this);
this.addCustomer=this.addCustomer.bind(this);
}


  componentDidMount(){
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
delete customerData.showCompanyForm;
    fetch(request(`${API_URL}/addcustomer`, "POST", customerData))
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
        alert("Klient został dodany do bazy danych!");
          this.props.refreshCustomers();
          this.props.showCustomersTab();
          this.setState({
            companyName:'',
            NIP:'',
            REGON:'',
            customerAddress:'',
            customerPostcode:'',
            customerLocation:'',
            customerVoivodeship:'pomorskie',
            customerFullname:'',
            PESEL:'',
            deliveryAddress:'',
            deliveryPostcode:'',
            deliveryLocation:'',
            deliveryVoivodeship:'pomorskie',
            customerEmail:'',
            customerTelephone1:'',
            customerTelephone2:'',
            isPESELValid:true,
            isNIPValid:true,
            isREGONValid:true,
            isEmailValid:true,
            isTelNum1Valid:true,
            isTelNum2Valid:true
          })
        } else {
          alert("SQL Error - powtarzające się nazwy lub błędne wartości!")
        }
      })
      .catch((error) => {alert("Błąd dodawania klienta!"); return error});
  }

  toggleLockedCustomersList(){
    this.setState({showLockedCustomers:!this.state.showLockedCustomers});
  }

  handleCompanyName(event) {
    this.setState({ companyName: event.target.value });
  }

  handleNIP(event){
    const NIP=event.target.value;
    const isNIPValid=validateNIP(NIP);
    if (!isNIPValid) {
      event.target.setCustomValidity("Błędny NIP");
    } else {
      event.target.setCustomValidity('');
    }
    this.setState({ NIP: NIP,isNIPValid:isNIPValid });
  }

  handleREGON(event){
    const REGON=event.target.value;
    const isREGONValid=validateREGON(REGON);
    if (!isREGONValid) {
      event.target.setCustomValidity("Błędny REGON");
    } else {
      event.target.setCustomValidity('');
    }
    this.setState({ REGON: REGON,isREGONValid:isREGONValid});
  }

  handleCustomerAddress(event){
    this.setState({ customerAddress: event.target.value });

  }


  handleCustomerPostcode(event){
    if(event.target.validity.patternMismatch){
      event.target.setCustomValidity("Błędny format kodu pocztowego");
    } else {
      event.target.setCustomValidity('');
    }
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
    const PESEL=event.target.value;
    const isPESELValid=validatePESEL(PESEL);
    if (!isPESELValid) {
      event.target.setCustomValidity("Błędny PESEL");
    } else {
      event.target.setCustomValidity('');
    }
    this.setState({ PESEL: PESEL,isPESELValid:isPESELValid });
  }

  handleDeliveryAddress(event){
    this.setState({ deliveryAddress: event.target.value });
  }

  handleDeliveryPostcode(event){
    if(event.target.validity.patternMismatch){
      event.target.setCustomValidity("Błędny format kodu pocztowego");
    } else {
      event.target.setCustomValidity('');
    }
    this.setState({ deliveryPostcode: event.target.value });
  }

  handleDeliveryLocation(event){
    this.setState({ deliveryLocation: event.target.value });
  }

handleDeliveryVoivodeship(event){
    this.setState({ deliveryVoivodeship: event.target.value });
}

handleCustomerEmail(event){
  const email=event.target.value;
  if(event.target.validity.patternMismatch){
    event.target.setCustomValidity("Błędny format e-mail");
  } else {
    event.target.setCustomValidity('');
  }
  this.setState({ customerEmail: email });
}

handleCustomerTelephone1(event){
  if(event.target.validity.patternMismatch){
    event.target.setCustomValidity("Błędny format numeru telefonu");
  } else {
    event.target.setCustomValidity('');
  }
    this.setState({ customerTelephone1: event.target.value});
}

handleCustomerTelephone2(event){
  if(event.target.validity.patternMismatch){
    event.target.setCustomValidity("Błędny format numeru telefonu");
  } else {
    event.target.setCustomValidity('');
  }
  this.setState({ customerTelephone2: event.target.value});
}

toggleCustomerType(){
  this.setState({ showCompanyForm: !this.state.showCompanyForm,PESEL:'',NIP:'',REGON:'',companyName:'',customerFullname:''});
}



renderVoivodeshipSelection(handler,value) {
return <select onChange={handler} value={value} required>
<option key={0} value="dolnośląskie">dolnośląskie</option>
<option key={1} value="kujawsko-pomorskie">kujawsko-pomorskie</option>
<option key={2} value="lubelskie">lubelskie</option>
<option key={3} value="lubuskie">lubuskie</option>
<option key={4} value="łódzkie">łódzkie</option>
<option key={5} value="małopolskie">małopolskie</option>
<option key={6} value="mazowieckie">mazowieckie</option>
<option key={7} value="opolskie">opolskie</option>
<option key={8} value="podkarpackie">podkarpackie</option>
<option key={9} value="podlaskie">podlaskie</option>
<option key={10} value="pomorskie">pomorskie</option>
<option key={11} value="śląskie">śląskie</option>
<option key={12} value="świętokrzyskie">świętokrzyskie</option>
<option key={13} value="warmińsko-mazurskie">warmińsko-mazurskie</option>
<option key={14} value="wielkopolskie">wielkopolskie</option>
<option key={15} value="zachodniopomorskie">zachodniopomorskie</option>
</select>;
}

  

  render() {
    return  <div id="addCustomer">
    <form className="addCustomerForm" onSubmit={this.addCustomer}>
    <div><input type="radio" id="company-option" checked={this.state.showCompanyForm} onChange={this.toggleCustomerType} name="customerTypeSelect"></input><label>FIRMA</label></div>
    <div><input type="radio" id="person-option" checked={!this.state.showCompanyForm} onChange={this.toggleCustomerType} name="customerTypeSelect"></input><label>OSOBA FIZYCZNA</label></div>
    {!this.state.showCompanyForm ? <input placeholder='Imię i nazwisko' value={this.state.customerFullname} onChange={this.handleCustomerFullname}></input>:''}
    {!this.state.showCompanyForm ?<input id="PESEL-field" className={this.state.isPESELValid ? 'valid':'invalid'} placeholder='PESEL' value={this.state.PESEL} onChange={this.handlePESEL}></input>:''}
   {this.state.showCompanyForm ? <input placeholder='Nazwa firmy' value={this.state.companyName} onChange={this.handleCompanyName}></input> :''}
   {this.state.showCompanyForm ? <input id="NIP-field" className={this.state.isNIPValid ? 'valid':'invalid'} placeholder='NIP' value={this.state.NIP} onChange={this.handleNIP}></input>:''}
   {this.state.showCompanyForm ? <input id="REGON-field" className={this.state.isREGONValid ? 'valid':'invalid'} placeholder='REGON' value={this.state.REGON} onChange={this.handleREGON}></input> :''}
    <input placeholder='Adres' value={this.state.customerAddress} onChange={this.handleCustomerAddress} required></input>
    <input id="postcode-field" maxLength="6" placeholder='Kod pocztowy XX-XXX' type="text"  pattern="^\d{2}-\d{3}$" value={this.state.customerPostcode} onChange={this.handleCustomerPostcode} required></input>
    <input placeholder='Miejscowość' value={this.state.customerLocation} onChange={this.handleCustomerLocation} required></input>
    {this.renderVoivodeshipSelection(this.handleCustomerVoivodeship,this.state.customerVoivodeship)}
    <input placeholder='Adres dostawa' value={this.state.deliveryAddress} onChange={this.handleDeliveryAddress} required></input>
    <input type="text" maxLength="6" id="deliveryPostcode-field" placeholder='Kod dostawa XX-XXX' pattern="[0-9]{2}-[0-9]{3}" value={this.state.deliveryPostcode} onChange={this.handleDeliveryPostcode} required></input>
    <input placeholder='Miejscowość dostawa' value={this.state.deliveryLocation} onChange={this.handleDeliveryLocation} required></input>
    {this.renderVoivodeshipSelection(this.handleDeliveryVoivodeship,this.state.deliveryVoivodeship)}
    <input placeholder='E-mail' pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$" value={this.state.customerEmail} onChange={this.handleCustomerEmail} required></input>
    <input id="tel1-field" type="text" maxLength="9" pattern="\d{9}" placeholder='Telefon 1' value={this.state.customerTelephone1} onChange={this.handleCustomerTelephone1} required></input>
    <input id="tel2-field" type="text" maxLength="9" pattern="\d{9}" placeholder='Telefon 2' value={this.state.customerTelephone2} onChange={this.handleCustomerTelephone2}></input>
    <button type='submit'>DODAJ</button>
    {this.state.error !== '' ? <p className="error">{this.state.error}</p> : ''}
  </form>
    </div>;
  }
}

export default AddCustomer;
