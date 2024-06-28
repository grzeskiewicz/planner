import React from 'react';
import Order from "./Order";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import { API_URL, request } from "./APIConnection";

class OrdersDay extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
ordersListed:false,
showCropsToLink:false,
linkedOrderCrop:new Map()
    }
    this.myRef = React.createRef();
    this.unwrapOrdersDay=this.unwrapOrdersDay.bind(this);
    this.toggleShowCropsToLink=this.toggleShowCropsToLink.bind(this);
    this.editOrder=this.editOrder.bind(this);
    this.setSelectedOrder=this.setSelectedOrder.bind(this);
this.handleCropToLink=this.handleCropToLink.bind(this);
this.linkCropsToOrders=this.linkCropsToOrders.bind(this);

}

setSelectedOrder(id) {
  this.setState({ selectedOrder: id });
}


editOrder(orderData) {
  fetch(request(`${API_URL}/editorder`, "POST", orderData))
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        this.props.refreshOrders();
        this.setState({ selectedOrder: '' });
      } else {
        alert("SQL Error - powtarzające się nazwy lub błędne wartości!")
      }
    })
    .catch((error) => {alert("Edycja zamówienia nieudana"); return error});
}



unwrapOrdersDay(){
  this.setState({ordersListed: !this.state.ordersListed});

  setTimeout(() => {
    this.myRef.current.scrollIntoView({behavior: "smooth", block: "end" });
  }, "500");
}

linkCropsToOrders(){
const linkedOrderCrop = this.state.linkedOrderCrop;
const linkedOrderCropArr=[];
for (const [key,arr] of linkedOrderCrop){
  linkedOrderCropArr.push({order:key, crop: Number(arr.crop)});
}
    fetch(request(`${API_URL}/linkcrops`, "POST", {linkedOrderCrop:linkedOrderCropArr}))
    .then((res) => res.json())
    .then((result) => {
      console.log(result)
      if (result.success) {
        this.props.refreshOrders();
        this.setState({ selectedOrder: '' });
        alert("Zamówienia powiązane z zasiewami.")
      } else {
        alert("SQL Error - powtarzające się nazwy lub błędne wartości!")
      }
    })
    .catch((error) => {alert("Powiązanie zasiewów nieudane!"); return error});
}

toggleShowCropsToLink(){
  this.setState({showCropsToLink:!this.state.showCropsToLink});
}


handleCropToLink(order,crop){
//console.log(order,crop);
const linkedOrderCrop=this.state.linkedOrderCrop;
linkedOrderCrop.set(order,{crop:crop});
this.setState({linkedOrderCrop:linkedOrderCrop});
}


renderOrdersDay(byDay){

  const ordersDay=[];

  for (let i=0;i<byDay.length;i++){ //i=customer_id
      let mappedCustomersOrdersDay=undefined;
      if (byDay[i]!==undefined) {   

             mappedCustomersOrdersDay = byDay[i].map((order, index) => {
          //    console.log(order);
          return <Order customers={this.props.customers} microgreens={this.props.microgreens} editOrder={this.editOrder} selectedOrder={this.state.selectedOrder} showCropsToLink={this.state.showCropsToLink}
          setSelectedOrder={this.setSelectedOrder} order={order} key={index} index={index} handleCropToLink={this.handleCropToLink}></Order>
        });
      
      }

        if (mappedCustomersOrdersDay!==undefined) {
        ordersDay.push(<fieldset className="customerGroup">
        <legend>Klient ID:{i}</legend>
        <div className="customerGroupOrdersWrapper">
        <div className="head"><div>MICROGREENS</div><div>WAGA[G]</div>{this.state.showCropsToLink ? <div>Link?</div>:''}</div>
        {mappedCustomersOrdersDay}
        <fieldset className="orderNotes" ><legend>Notatki</legend>{byDay[i][0].notes}</fieldset></div>
        <div className="iconTD" onClick={() => this.deleteCustomerOrder(i,byDay[i][0].delivery_date)}>
        <FontAwesomeIcon icon={faTrashAlt} size="lg" />
      </div> 
        </fieldset>);}
  }
  return ordersDay;
}

render(){
const ordersDay=this.props.ordersDay;

//console.log(this.state.linkedOrderCrop);

const ordersDayRender=this.renderOrdersDay(ordersDay);


  return (
    this.state.ordersListed ?
    <div className="ordersDayMain" ref={this.myRef}>
    <fieldset className="ordersDay"><legend onClick={()=>this.setState({ordersListed: !this.state.ordersListed})}>{this.props.day} 	&#9651;</legend>
    <div><button onClick={this.toggleShowCropsToLink}>{this.state.showCropsToLink? 'UKRYJ POWIĄZANIA':'POKAŻ POWIĄZANIA'}</button></div>
   <div className='ordersDayWrapper'>{ordersDayRender}</div>
   {this.state.showCropsToLink ? <div><button onClick={this.linkCropsToOrders}>POWIĄŻ ZAMÓWIENIA DO ZASIEWÓW</button></div>:''}
    <div className="ordersSummary">
    <div className="head"><div>MICROGREENS</div><div>WAGA TOTAL</div><div>ILE TAC?</div></div><div className="body">{this.props.summary}</div>
    </div>
    </fieldset></div>:
<div className="ordersDayWrapper wrapped">
<fieldset className="ordersDay">
<legend onClick={this.unwrapOrdersDay}>{this.props.day} &#9661;</legend>
</fieldset>
</div>
 
);}
}


export default OrdersDay;
