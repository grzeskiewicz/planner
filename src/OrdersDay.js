import React from 'react';


class OrdersDay extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
ordersListed:false
    }
    this.myRef = React.createRef();
    this.unwrapOrdersDay=this.unwrapOrdersDay.bind(this);
}


unwrapOrdersDay(){
  this.setState({ordersListed: !this.state.ordersListed});

  setTimeout(() => {
    this.myRef.current.scrollIntoView({behavior: "smooth", block: "end" });
  }, "500");
}

render(){
  return (
    this.state.ordersListed ?
    <div className="ordersDayWrapper" ref={this.myRef}>
    <fieldset className="ordersDay"><legend onClick={()=>this.setState({ordersListed: !this.state.ordersListed})}>{this.props.day} 	&#9651;</legend>{this.props.ordersDay}<div className="ordersSummary">
    <div className="head"><div>MICROGREENS</div><div>WAGA TOTAL</div><div>ILE TAC?</div></div><div className="body">{this.props.summary}</div></div>
    </fieldset></div>:
<div className="ordersDayWrapper wrapped">
<fieldset className="ordersDay">
<legend onClick={this.unwrapOrdersDay}>{this.props.day} &#9661;</legend>
</fieldset>
</div>
 
);}
}


export default OrdersDay;
