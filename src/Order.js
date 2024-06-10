import React from 'react';
import { API_URL, request } from "./APIConnection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCheckCircle } from "@fortawesome/free-solid-svg-icons";




class Order extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      editOrderEnabled:false,

      id:this.props.order.id,
      microgreen_id:this.props.order.microgreen_id,
      weight:this.props.order.weight,
      customer_id: this.props.order.customer_id, 
      elivery_date:this.props.order.delivery_date,
      notes:this.props.order.notes
    }
this.enableEditOrder=this.enableEditOrder.bind(this);
this.deleteOrder=this.deleteOrder.bind(this);
this.handleNamePL=this.handleNamePL.bind(this);

this.saveOrder=this.saveOrder.bind(this);
this.enter=this.enter.bind(this);
}



  deleteOrder(crop){
    if (window.confirm("Czy usunąć zamówienie?")) {
      fetch(request(`${API_URL}/deletecrop`, "POST", {"crop_id": crop.id}))
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      if (result.success) {
        this.props.refreshCrops();
      } else {
        alert("SQL Erro - błędne wartości!")
      }
    })
    .catch((error) => Promise.reject(new Error(error)));
    } else {
    }
  }


  enableEditOrder(){
    this.props.setSelectedOrder(this.props.order.id);
    this.setState({editOrderEnabled: true});
  }

  disableEdit(){
    this.setState({editOrderEnabled: false});
  }


handleNamePL(e){
  this.setState({name_pl:e.target.value});
}


saveOrder(){
  const orderData=this.state;
  delete orderData.editOrderEnabled;
  this.props.editOrder(orderData);
  this.setState({editOrderEnabled:false});
}

enter(e){
  if (e.key === 'Enter') {
this.saveOrder();
  }
}


render(){
const order=this.props.order;
const isEditEnabled=this.state.editOrderEnabled;
const selectedOrder=this.props.selectedOrder;
const amISelectedToEdit=isEditEnabled && selectedOrder===order.id;
  return (
    <div className={"OrderEntry " + (amISelectedToEdit ? "edit":"") } onClick={this.enableEdit} key={this.props.index} onKeyDown={this.enter}>
    <div>{ amISelectedToEdit ?<input   type="text" value={this.state.name_pl} onChange={this.handleNamePL}></input>:order.name_pl}</div>
   
    { amISelectedToEdit ? <div onClick={this.saveOrder}><FontAwesomeIcon icon={faCheckCircle} size="lg"/></div>:null}
</div>);}
}


export default Order;
