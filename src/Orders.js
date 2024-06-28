import "./Orders.css";
import React from "react";
import { API_URL, request } from "./APIConnection";
import { isMobile } from 'react-device-detect';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import OrdersDay from "./OrdersDay";


class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAOF: false,
      deliveryDate:'',
      notes:'',
      customerID: this.props.customers && this.props.customers.length>0 ? this.props.customers[0].id: '',
      selectedOrder:'',
      microgreensID:99,
      weight:'',
      orders:[],
      showCalendar:false,
      showCropsToLink:false,
      ordersDateFrom: moment().subtract(15, 'days').set({hours:1}),
      ordersDateTo: moment().add(15, 'days').set({hours:23}),
    };

this.renderMicrogreensSelection=this.renderMicrogreensSelection.bind(this);
this.addOrder=this.addOrder.bind(this);
this.handleCustomerID=this.handleCustomerID.bind(this);
this.handleDeliveryDate=this.handleDeliveryDate.bind(this);
this.handleNotes=this.handleNotes.bind(this);
this.handleMicrogreens=this.handleMicrogreens.bind(this);
this.handleWeight=this.handleWeight.bind(this);
this.handleOrders=this.handleOrders.bind(this);
this.handleOrdersDateTo=this.handleOrdersDateTo.bind(this);
this.handleOrdersDateFrom=this.handleOrdersDateFrom.bind(this);

this.deleteOrder=this.deleteOrder.bind(this);
this.toggleCalendar=this.toggleCalendar.bind(this);
this.handleDaySelection=this.handleDaySelection.bind(this);
this.deleteCustomerOrder=this.deleteCustomerOrder.bind(this);
}

  refreshOrders() {
    this.props.refreshOrders();
  }


  handleDeliveryDate(event) {
    this.setState({ deliveryDate: moment(event.target.value).format('YYYY-MM-DD HH:mm') });
  }

  handleNotes(event) {
    this.setState({ notes: event.target.value });
  }

  handleCustomerID(event){
    this.setState({ customerID: event.target.value });
  }

  handleMicrogreens(event){
    this.setState({ microgreensID: event.target.value });
  }

  handleWeight(event){
    this.setState({ weight: event.target.value });
  }

  handleDaySelection(date) {
    this.setState({showCalendar:false,deliveryDate: moment(date).set({hours: 12, minutes:0}).format('YYYY-MM-DD HH:mm')})
  }

  toggleCalendar() {
    this.setState({ showCalendar: !this.state.showCalendar });
  }


  handleOrdersDateTo(event){
    this.setState({ ordersDateTo: moment(event.target.value)});
  }


  handleOrdersDateFrom(event){
    this.setState({ ordersDateFrom: moment(event.target.value)});
  }


  addOrder(event) {
    event.preventDefault();
    if (this.state.orders.length > 0){
   const orderData = {
    deliveryDate:this.state.deliveryDate,
    notes:this.state.notes,
    customerID: this.state.customerID,
    microgreensID:this.state.microgreensID,
    weight:this.state.weight,
    orders:this.state.orders,
   }

    fetch(request(`${API_URL}/addorder`, "POST", orderData))
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
            alert("Dodano zamówienie!");
          this.props.refreshOrders();
          this.setState({
            deliveryDate:'',
            notes:'',
            customerID: this.props.customers ? this.props.customers[0].id: '',
            selectedOrder:'',
            microgreensID:99,
            weight:'',
            orders:[],
          })
        } else {
          alert("SQL Error - powtarzające się nazwy lub błędne wartości!")
        }
      })
      .catch((error) => {alert("Nie udało się dodać zamówienia!"); return error});
    } else {
        alert("Pusta lista w zamówieniu!");
    }
  }



  handleOrders(event){
    event.preventDefault();
    if (this.state.microgreensID!==99 && this.state.weight!=='') {
    const orders=this.state.orders;
    orders.push({microgreensID:this.state.microgreensID,weight:this.state.weight});
    this.setState({orders:orders,microgreensID:99,weight:''});
    } else {
        alert("Wprowadź wartości do dodawania mikroliści!");
    }
  }

  deleteCustomerOrder(customerID,day){
    if (window.confirm("Czy usunąć zamówienie klienta?")) {
        fetch(request(`${API_URL}/deletecustomerorder`, "POST", {customer_id: customerID, day:day}))
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          this.props.refreshOrders();
          alert("Zamówienie klienta usunięte.");
        } else {
          alert("SQL Erro - błędne wartości!")
        }
      })
      .catch((error) => {alert("Błąd usuwania zamówienia"); return error});
      } else {
      }
  }


  renderMicrogreensSelection() {
    const microgreens = JSON.parse(JSON.stringify(this.props.microgreens));
    microgreens.unshift({ id: 99, name_pl: "MICROGREENS", name_en: "MICROGREENS" });
    return microgreens.map((microgreen, index) => {
      return <option key={index} value={microgreen.id} id={microgreen.id}>{microgreen.name_pl}</option>
    });
  }

  renderCustomerSelection() {
    const customers = JSON.parse(JSON.stringify(this.props.customers));
    return customers.map((customer, index) => {
      return <option key={index} value={customer.id} id={customer.id}>{customer.company_name + " (ID:" + customer.id+")"}</option>
    });
  }

  deleteOrder(order){
    const orders=this.state.orders;
    const ordersFiltered=orders.filter((x)=>x.microgreensID!==order.microgreensID);
    this.setState({orders:ordersFiltered})
  }

  renderOrdersList(){
    const orders = JSON.parse(JSON.stringify(this.state.orders));
    const head=<div className="head"><div>LP</div><div className="typeField">TYP</div><div>WAGA</div><div></div></div>
    const ordersMapped=orders.map((order, index) => {
        const microgreeenData=this.props.microgreens.find((x)=>Number(x.id)===Number(order.microgreensID));
        return <div className="addOrderEntry"><div>{index+1}</div><div className="typeField">{microgreeenData.name_pl}</div><div>{order.weight}</div>
        <div className="iconTD" onClick={() => this.deleteOrder(order)}><FontAwesomeIcon icon={faTrashAlt} size="lg" /></div>
        </div>
    }); 

return <div>{orders.length>0 ? head:''}{ordersMapped}</div>
 }

 groupCustomerOrdersByDeliveryDate(orders){
  const grp=[];

  for (const order of orders){
      const deliveryDate=moment(order.delivery_date).format('YYYY-MM-DD');
      if (!grp[deliveryDate]) grp[deliveryDate] = [];
      grp[deliveryDate].push(order); //group by delivery date 
  }

  for (let [day, arr] of Object.entries(grp)) {
    const grpCustomer=[];
    for (const entry of arr){
        if (!grpCustomer[entry.customer_id]) grpCustomer[entry.customer_id] = [];
        grpCustomer[entry.customer_id].push(entry); //group by customer_id in certain day
    }
    grp[day]=grpCustomer;
}

  return grp;
 }



groupDayOrdersByMicrogreens(byDay){
  const ordersDayByMicrogreens=[];
  for (const orders of byDay){
      if (orders!==undefined) {
          for (const order of orders){
              if (!ordersDayByMicrogreens[order.microgreen_id]) ordersDayByMicrogreens[order.microgreen_id] = [];
              ordersDayByMicrogreens[order.microgreen_id].push(order); //group by microgreen_id
          }
      }
  }

  return ordersDayByMicrogreens;
}

renderDaySummary(ordersDayByMicrogreens){
  const microgreens=this.props.microgreens;
  const summary=[];
  for (const orders of ordersDayByMicrogreens){
      if (orders && orders.length) {
          const initialValue = 0;
       const sumWeight=  orders.reduce((sum, order)=>sum + order.weight,initialValue);
       const microgreenData=microgreens.find((x)=>x.id===orders[0].microgreen_id);
       summary.push(<div className="orderEntry"><div>{microgreenData.name_pl}</div><div>{sumWeight}</div><div>{Math.ceil(sumWeight/microgreenData.grams_harvest)}</div></div>)
      }
      }
      return summary;
}

 //=============================================================================================================================================================  

 
renderOrdersTable(orders) { //TODO rozdzielic na kilka funkcji

const grp=this.groupCustomerOrdersByDeliveryDate(orders); //grupowanie zamówień klienta z danego dnia  i przypięcie zgrupowanych zamówien klientów do danego dnia

const ordersDayGrp=[];

for (let [day, byDay] of Object.entries(grp)) {
const ordersDayByMicrogreens=this.groupDayOrdersByMicrogreens(byDay); //summary data
const summary=this.renderDaySummary(ordersDayByMicrogreens); //render summary

ordersDayGrp.push(<OrdersDay customers={this.props.customers} microgreens={this.props.microgreens} ordersDay={byDay} day={day} summary={summary} refreshOrders={this.props.refreshOrders}></OrdersDay>);
}
return <div id="ordersList">
<div id="ordersDateRange">
<fieldset>
<legend>ZAKRES</legend>
  <input type="date" onChange={this.handleOrdersDateFrom} value={this.state.ordersDateFrom.format('YYYY-MM-DD')}></input>
  <span> - </span>
  <input type="date" min={this.state.ordersDateFrom.clone().add(7,"days").format('YYYY-MM-DD')} onChange={this.handleOrdersDateTo} value={this.state.ordersDateTo.format('YYYY-MM-DD')}></input>
  </fieldset>
  </div>
  {ordersDayGrp}</div>
  }

//=============================================================================================================================================================  


//const finalArr = arrFiltered.reduce((accumulator, currentValue) => accumulator.concat(currentValue), [],);


linkCropsToOrders(){
  const orders=this.props.orders;
  const crops=this.props.crops;

  const ordersByDeliveryDate=[];

  for (const order of orders){
    const deliveryDate=moment(order.delivery_date).format('YYYY-MM-DD');
    if (!ordersByDeliveryDate[deliveryDate]) ordersByDeliveryDate[deliveryDate] = [];
    ordersByDeliveryDate[deliveryDate].push(order); //group by delivery date 
}


const linkedOrders=[];
  for (let [day, arr] of Object.entries(ordersByDeliveryDate)) {

const dayDate=moment(day).set({hours:1});
const past2Days=moment(day).set({hours:1}).subtract(2,"days");
const cropsCloseToDate=crops.filter((crop)=> moment(crop.harvest).isBetween(past2Days,dayDate, undefined, "[]"));

for (const order of arr){
 const cropsToPropose=cropsCloseToDate.filter((crop)=>crop.microgreen_id===order.microgreen_id);
 const orderCopy=JSON.parse(JSON.stringify(order));
  orderCopy.cropsToLink=cropsToPropose;
  linkedOrders.push(orderCopy);
  }
  }
  return linkedOrders;
}

  render() {
    const mappedMicrogreens = this.renderMicrogreensSelection();
    const mappedCustomers=this.renderCustomerSelection();
    const mappedOrders=this.renderOrdersList();

   const orders=this.linkCropsToOrders(); //proposedCrops for every order
   const from = this.state.ordersDateFrom.set({hours:1});
   const to = this.state.ordersDateTo.set({hours:23});
   const rangeDateOrders = orders.filter((x) => moment(x.delivery_date).isBetween(from, to, undefined, "[]"));


    let ordersTable;
    if (this.props.orders.length >0) ordersTable = this.renderOrdersTable(rangeDateOrders); //this.renderOrdersTable(orders); 
    const ordersListTable = <div id="ordersListWrapper">
          {ordersTable}
    </div>;
    const addOrderForm = <form className="" onSubmit={this.addOrder}>
           <label>KLIENT:</label>
            <select id="customer-selection" name="customer-selection" onChange={this.handleCustomerID} value={this.state.customerID}>
            {mappedCustomers}
            </select>
            <label>DATA DOSTAWY:</label>
             <input type="datetime-local" min={moment().subtract(10,"days").format('YYYY-MM-DD HH:mm')} value={this.state.deliveryDate} onChange={this.handleDeliveryDate} required></input>
      <textarea rows="10" placeholder='NOTATKI' value={this.state.notes} onChange={this.handleNotes}></textarea>
      <fieldset>
        <legend>DODAJ DO ZAMÓWIENIA</legend>
        <div id="addEntryOrders">      
            <select id="microgreens-selection" name="microgreens-selection" onChange={this.handleMicrogreens} value={this.state.microgreensID}>
            {mappedMicrogreens}
            </select>
            <input placeholder='Waga' type="number" min="10" max="3000" value={this.state.weight} onChange={this.handleWeight}></input>
            <button onClick={this.handleOrders}>+</button>
            
        </div>
        <div id="addEntryOrdersList">
        {mappedOrders}
        </div>
        </fieldset>

      <button type='submit'>DODAJ</button>
      {this.state.error !== '' ? <p className="error">{this.state.error}</p> : ''}
    </form>;

    return <div className="Orders">
      <div id="addOrder">
        {isMobile ? <div className="aofWrapper"><button onClick={() => this.setState({ showAMF: !this.state.showAOF })}>{this.state.showAOF ? "ANULUJ" : "DODAJ ZAMÓWIENIE"}</button>{this.state.showAOF ? <div id="AOFWrapper">{addOrderForm}</div> : ''}</div> : <div id="AOFWrapper">{addOrderForm}</div>}
      </div>

      {!isMobile ? ordersListTable: ''}
      {isMobile && !this.state.showAOF? ordersListTable:''}
    </div>;
  }
}

export default Orders;
