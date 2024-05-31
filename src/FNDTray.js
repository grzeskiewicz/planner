import "./Crops.css";
import React from "react";
import Tray from "./Tray";
import moment from "moment";


class FNDTray extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleScheduleTDC = this.handleScheduleTDC.bind(this);
  }

  handleScheduleTDC(tray) {
    this.props.handleScheduleTDC(tray);
  }

  render() {
    const trays = this.props.tray;
    const blockDate = this.props.blockDate;
    //console.log(blockDate)
    const isBlocked = blockDate !== undefined  && blockDate !=='' && moment(blockDate).format('YYYY-MM-DD') !== moment(trays[0].date).format('YYYY-MM-DD');
    if (this.props.range === "week") {
      return <div className={"FNDTray "}>
        <Tray isBlocked={isBlocked} crops={this.props.crops} trayData={trays[0]} handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens}></Tray>
        <Tray isBlocked={isBlocked} crops={this.props.crops} trayData={trays[1]} handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens}></Tray>
        <Tray isBlocked={isBlocked} crops={this.props.crops} trayData={trays[2]} handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens}></Tray>
        <Tray isBlocked={isBlocked} crops={this.props.crops} trayData={trays[3]} handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens}></Tray>
        <Tray isBlocked={isBlocked} crops={this.props.crops} trayData={trays[4]} handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens}></Tray>
        <Tray isBlocked={isBlocked} crops={this.props.crops} trayData={trays[5]} handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens}></Tray>
      </div>;
    } else {
     const fndData=this.props.fndtrays.find((x)=>x.id===this.props.tray[0].fndtray_id);
   // console.log(fndData)
      return <div className="FNDTray">{fndData.valve}</div>
    }
  }
}

export default FNDTray;
