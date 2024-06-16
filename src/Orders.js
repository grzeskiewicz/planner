import "./Orders.css";
import React from "react";
import { API_URL, request } from "./APIConnection";
import Order from "./Order";
import { isMobile } from 'react-device-detect';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCheckCircle, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";



class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAOF: false,
      deliveryDate:'',
      notes:'',
      customerID: this.props.customers ? this.props.customers[0].id: '',
      selectedOrder:'',
      microgreensID:99,
      weight:'',
      orders:[],
      showCalendar:false
    };

this.renderMicrogreensSelection=this.renderMicrogreensSelection.bind(this);
this.setSelectedOrder=this.setSelectedOrder.bind(this);
this.addOrder=this.addOrder.bind(this);
this.editOrder=this.editOrder.bind(this);
this.handleCustomerID=this.handleCustomerID.bind(this);
this.handleDeliveryDate=this.handleDeliveryDate.bind(this);
this.handleNotes=this.handleNotes.bind(this);
this.handleMicrogreens=this.handleMicrogreens.bind(this);
this.handleWeight=this.handleWeight.bind(this);
this.handleOrders=this.handleOrders.bind(this);
this.deleteOrder=this.deleteOrder.bind(this);
this.toggleCalendar=this.toggleCalendar.bind(this);
this.handleDaySelection=this.handleDaySelection.bind(this);
this.deleteCustomerOrder=this.deleteCustomerOrder.bind(this);
}

  refreshOrders() {
    this.props.refreshOrders();
  }

  setSelectedOrder(id) {
    this.setState({ selectedOrder: id });
  }

  addOrder(event) {
    event.preventDefault();
    if (this.state.orders.length > 0){
   const orderData = JSON.parse(JSON.stringify(this.state));
   delete orderData.showAOF;
   delete orderData.selectedOrder;
   delete orderData.microgreensID;
   delete orderData.weight;
   delete orderData.showCalendar;

    fetch(request(`${API_URL}/addorder`, "POST", orderData))
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
            alert("Dodano zamówienie!");
          this.props.refreshOrders();
        } else {
          alert("SQL Error - powtarzające się nazwy lub błędne wartości!")
        }
      })
      .catch((error) => {alert("Nie udało się dodać zamówienia!"); return error});
    } else {
        alert("Pusta lista w zamówieniu!");
    }
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

  handleDaySelection(date) {
    this.setState({showCalendar:false,deliveryDate: moment(date).set({hours: 12, minutes:0}).format('YYYY-MM-DD HH:mm')})
  }

  toggleCalendar() {
    this.setState({ showCalendar: !this.state.showCalendar });
  }
  renderOrdersTable() { //TODO rozdzielic na kilka funkcji
const orders=this.props.orders;
const microgreens=this.props.microgreens;

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

const ordersDayGrp=[];
for (let [day, byDay] of Object.entries(grp)) {

    const ordersDay=[];

    for (let i=0;i<byDay.length;i++){ //i=customer_id
        let mappedCustomersOrdersDay=undefined;
        if (byDay[i]!==undefined) {   

               mappedCustomersOrdersDay = byDay[i].map((order, index) => {
            return <Order customers={this.props.customers} microgreens={this.props.microgreens} editOrder={this.editOrder} selectedOrder={this.state.selectedOrder} 
            setSelectedOrder={this.setSelectedOrder} order={order} key={index} index={index}></Order>
          });
        
        }

          if (mappedCustomersOrdersDay!==undefined) ordersDay.push(<fieldset className="customerGroup"><legend>Klient ID:{i}</legend>
          <div className="customerGroupOrdersWrapper">
          <div className="head"><div>MICROGREENS</div><div>WAGA[G]</div></div>
          {mappedCustomersOrdersDay}
          <fieldset className="orderNotes" ><legend>Notatki</legend>{byDay[i][0].notes}</fieldset></div>
          <div className="iconTD" onClick={() => this.deleteCustomerOrder(i,byDay[i][0].delivery_date)}>
          <FontAwesomeIcon icon={faTrashAlt} size="lg" />
        </div> 
          </fieldset>);
    }


    const ordersDayByMicrogreens=[];
    for (const orders of byDay){
        if (orders!==undefined) {
            for (const order of orders){
                if (!ordersDayByMicrogreens[order.microgreen_id]) ordersDayByMicrogreens[order.microgreen_id] = [];
                ordersDayByMicrogreens[order.microgreen_id].push(order); //group by microgreen_id
            }
        }
    }

const summary=[];
    for (const orders of ordersDayByMicrogreens){
        if (orders && orders.length) {
            const initialValue = 0;
         const sumWeight=  orders.reduce((sum, order)=>sum + order.weight,initialValue);
         const microgreenData=microgreens.find((x)=>x.id===orders[0].microgreen_id);
         summary.push(<div className="orderEntry"><div>{microgreenData.name_pl}</div><div>{sumWeight}</div><div>{Math.ceil(sumWeight/microgreenData.grams_harvest)}</div></div>)
        }
        }


ordersDayGrp.push(<div className="ordersDayWrapper"><fieldset className="ordersDay"><legend>{day}</legend>{ordersDay}<div className="ordersSummary"><div className="head"><div>MICROGREENS</div><div>WAGA TOTAL</div><div>ILE TAC?</div></div><div className="body">{summary}</div></div></fieldset></div>);

}
return <div id="ordersList">{ordersDayGrp}</div>
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
    
    return orders.map((order, index) => {
        const microgreeenData=this.props.microgreens.find((x)=>Number(x.id)===Number(order.microgreensID));
        return <div className="addOrderEntry"><div className="orderInfo">{index+1}.{microgreeenData.name_pl} WAGA:{order.weight}</div>
        <div className="iconTD" onClick={() => this.deleteOrder(order)}><FontAwesomeIcon icon={faTrashAlt} size="lg" /></div>
        </div>
    }); 
 }


  render() {
    const mappedMicrogreens = this.renderMicrogreensSelection();
    const mappedCustomers=this.renderCustomerSelection();
    const mappedOrders=this.renderOrdersList();

    let ordersTable;
    if (this.props.orders.length >0) ordersTable = this.renderOrdersTable();
    const ordersListTable = <div id="ordersListWrapper">
          {ordersTable}
    </div>;
    const addOrderForm = <form className="" onSubmit={this.addOrder}>
            <select id="customer-selection" name="customer-selection" onChange={this.handleCustomerID} value={this.state.customerID}>
            {mappedCustomers}
            </select>
             <input type="datetime-local" value={this.state.deliveryDate} onChange={this.handleDeliveryDate} required></input>
      <textarea rows="10" placeholder='NOTATKI' value={this.state.notes} onChange={this.handleNotes}></textarea>
      <fieldset>
        <legend>DODAJ DO ZAMÓWIENIA</legend>
        <div id="addEntryOrders">      
            <select id="microgreens-selection" name="microgreens-selection" onChange={this.handleMicrogreens} value={this.state.microgreensID}>
            {mappedMicrogreens}
            </select>
            <input placeholder='Waga' type="number" value={this.state.weight} onChange={this.handleWeight}></input>
            <button onClick={this.handleOrders}>+</button>
            
        </div>
        <div id="addEntryOrdersList">
        {mappedOrders}
        </div>
        </fieldset>

      <button type='submit'>DODAJ</button>
      {this.state.error !== '' ? <p className="error">{this.state.error}</p> : ''}
    </form>;
   // console.log(isMobile)

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
