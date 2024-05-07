import "./Crops.css";
import React from "react";
import { Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import { cropInfoRender } from "./ViewCommon";

class Tray extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isScheduled: false
    };
  }

  handleTray() {
    if (this.props.trayData.crop_id === null) {
      this.props.handleScheduleTDC(this.props.trayData);
    }
    else {
      console.log("ZAJĘTE!!!");
      this.props.handleScheduleTDC(this.props.trayData);

    }
  }
  render() {    
    const crops = this.props.crops;
    const trayData = this.props.trayData;
    const selectedCrop = this.props.selectedCrop;
    let trayCrop, microgreenData;
    if (trayData!==undefined && trayData.crop_id !== null) {
      trayCrop = crops.find((x) => x.id === trayData.crop_id);
      microgreenData = this.props.microgreens.find((x) => x.id === trayCrop.microgreen_id);
    } else {
      if (selectedCrop) microgreenData = this.props.microgreens.find((x) => x.id === selectedCrop.microgreen_id);
    }
    if (trayData!==undefined && trayData.crop_id !== null) {
      return <Tooltip title={cropInfoRender(trayCrop, microgreenData)}><div style={{ backgroundColor: trayData.status === "1" && microgreenData ? microgreenData.color : '' }} className="tray" onClick={() => this.handleTray()}><span>&nbsp;&nbsp;</span></div></Tooltip>;
    } else {
      return <div style={{ backgroundColor: trayData.status === "1" && microgreenData ? microgreenData.color : '' }} className="tray" onClick={() => this.handleTray()}><span>&nbsp;&nbsp;</span></div>;
    }

  }
}

export default Tray;
