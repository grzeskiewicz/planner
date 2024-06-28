import React from 'react';
import { API_URL, request } from "./APIConnection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';



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
      notes:this.props.order.notes,
      cropToLink:this.props.order.crop_id ? this.props.order.crop_id:'NULL'
    }
this.enableEditOrder=this.enableEditOrder.bind(this);
this.deleteOrder=this.deleteOrder.bind(this);
this.handleNamePL=this.handleNamePL.bind(this);
this.handleCropToLink=this.handleCropToLink.bind(this);
this.renderCropsToLink=this.renderCropsToLink.bind(this);
this.saveOrder=this.saveOrder.bind(this);
this.enter=this.enter.bind(this);
}



  deleteOrder(order){
    if (window.confirm("Czy usunąć zamówienie?")) {
      fetch(request(`${API_URL}/deleteorder`, "POST", {"order_id": order.id}))
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        this.props.refreshOrders();
      } else {
        alert("SQL Erro - błędne wartości!")
      }
    })
    .catch((error) => {alert("Błąd! Nie udało się usunąć zamówienia!"); return error});
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
//this.saveOrder();
  }
}


handleCropToLink(e){
  this.props.handleCropToLink(this.props.order.id,e.target.value);
  this.setState({ cropToLink: e.target.value });
}


renderCropsToLink(cropsToLink){
const nullCrop=<option value='NULL'></option>;
  const cropsToLinkCopy=JSON.parse(JSON.stringify(cropsToLink));
  cropsToLinkCopy.unshift(nullCrop);
  const cropsOptions=cropsToLinkCopy.map((crop,index)=> <option key={index} value={crop.id}>{crop.id ? `ID:${crop.id}` : 'PUSTE'}{crop.harvest ? ` H:${moment(crop.harvest).format('DD.MM.YYYY')}`: ''} </option>);
  return <select value={this.state.cropToLink} className='cropsToLinkSelection' name="cropstolink-selection" onChange={this.handleCropToLink}>{cropsOptions}</select>
}

render(){
const order=this.props.order;
const microgreens=this.props.microgreens;
const microgreenData=microgreens.find((x)=>x.id===order.microgreen_id);

const isEditEnabled=this.state.editOrderEnabled;
const selectedOrder=this.props.selectedOrder;
const amISelectedToEdit=isEditEnabled && selectedOrder===order.id;

const renderCropsToLink=this.renderCropsToLink(order.cropsToLink);

  return (
    <div className={"orderEntry " + (amISelectedToEdit ? "edit":"") } onClick={this.enableEdit} key={this.props.index} onKeyDown={this.enter}>
    <div>{microgreenData.name_pl}</div>
    <div>{order.weight}</div>
    {this.props.showCropsToLink? <div className='cropsToLink'>{renderCropsToLink}</div>:''}

    { amISelectedToEdit ? <div onClick={this.saveOrder}><FontAwesomeIcon icon={faCheckCircle} size="lg"/></div>:null}
</div>);}
}


export default Order;
