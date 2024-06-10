import "./Orders.css";
import React from "react";
import { API_URL, request } from "./APIConnection";
import Order from "./Order";
import { isMobile } from 'react-device-detect';


class Orders extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      showAOF: false,
      deliveryDate:'',
      notes:'',
      customerID:'',
      selectedOrder:'',
      microgreensID:99,
      weight:'',
      orders:[]
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
}

  refreshOrders() {
    this.props.refreshOrders();
  }

  setSelectedOrder(id) {
    this.setState({ selectedOrder: id });
  }

  addOrder(event) {
    event.preventDefault();
   const orderData = JSON.parse(JSON.stringify(this.state));
   delete orderData.showAOF;
   delete orderData.selectedOrder;

    fetch(request(`${API_URL}/addorder`, "POST", orderData))
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          this.props.refreshOrders();
        } else {
          alert("SQL Error - powtarzające się nazwy lub błędne wartości!")
        }
      })
      .catch((error) => Promise.reject(new Error(error))); //Promise.reject(new Error(error))
  }


  editOrder(orderData) {
    console.log(orderData);
    fetch(request(`${API_URL}/editorder`, "POST", orderData))
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          this.props.refreshOrders();
          this.setState({ selectedOrder: '' });
        } else {
          alert("SQL Error - powtarzające się nazwy lub błędne wartości!")
        }
      })
      .catch((error) => Promise.reject(new Error(error))); //Promise.reject(new Error(error)) */
  }


  handleDeliveryDate(event) {
    this.setState({ deliveryDate: event.target.value });
  }

  handleNotes(event) {
    this.setState({ notes: event.target.value });
  }

  handleCustomerID(event){
    this.setState({ customerID: event.target.value });
  }

  handleMicrogreens(event){
    this.setState({ microg: event.target.value });
  }

  handleWeight(event){
    this.setState({ weight: event.target.value });
  }

  handleOrders(){
    const orders=this.state.orders;
    orders.push({microgreensID:this.state.microgreensID,weight:this.state.weight});
    this.setState({orders:orders,microgreensID:99,weight:''});
  }

  renderOrdersTable() {
    return this.props.orders.map((order, index) => {
      return <Order editOrder={this.editOrder} selectedOrder={this.state.selectedOrder} setSelectedOrder={this.setSelectedOrder} order={order} key={index} index={index}></Order>
    });
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
      return <option key={index} value={customer.id} id={customer.id}>{customer.id}</option>
    });
  }




  render() {
    const mappedMicrogreens = this.renderMicrogreensSelection();
    const mappedCustomers=this.renderCustomerSelection();
    let ordersTable;
    if (this.props.orders !== '') ordersTable = this.renderOrdersTable();
    const ordersListTable = <div id="orders-list">
        <div className="head">
<div></div>
        </div>
        <div className="body">
          {ordersTable}
        </div>
    </div>;
    const addOrderForm = <form className="" onSubmit={this.addOrder}>
            <select id="customer-selection" name="customer-selection" onChange={this.handleCustomerID} value={this.state.customerID}>
            {mappedCustomers}
            </select>     
             <input placeholder='Data dostawy' value={this.state.deliveryDate} onChange={this.handleDeliveryDate} required></input>
      <textarea rows="10" placeholder='NOTATKI' value={this.state.notes} onChange={this.handleNotes}></textarea>

      <fieldset>
        <legend>DODAJ DO ZAMÓWIENIA</legend>
        <div>      
            <select id="microgreens-selection" name="microgreens-selection" onChange={this.handleMicrogreens} value={this.state.microgreensID}>
            {mappedMicrogreens}
            </select>
            <input placeholder='Waga' value={this.state.weight} onChange={this.handleWeight} required></input>
            <button onClick={this.handleOrders}>DODAJ</button>
        </div>
        <div>{this.state.orders}</div>
        </fieldset>

      <button type='submit'>DODAJ</button>
      {this.state.error !== '' ? <p className="error">{this.state.error}</p> : ''}
    </form>;
   // console.log(isMobile)

    return <div className="Orders">
      <div id="addOrder">
        {isMobile ? <div className="aofWrapper"><button onClick={() => this.setState({ showAMF: !this.state.showAOF })}>{this.state.showAOF ? "ANULUJ" : "DODAJ ZAMÓWIENIE"}</button>{this.state.showAOF ? <div>{addOrderForm}</div> : ''}</div> : <div>{addOrderForm }</div>}
      </div>

      {!isMobile ? ordersListTable: ''}
      {isMobile && !this.state.showAOF? ordersListTable:''}
    </div>;
  }
}

export default Orders;
