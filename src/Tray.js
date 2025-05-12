import "./Crops.css";
import React from "react";
import { Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import { cropInfoRender } from "./ViewCommon";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";


const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'lightblue',
    color: 'rgba(0, 0, 0, 0.87)',
    width: 400,
    height: 300,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid black',
  },
}));


class Tray extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isScheduled: false
    };
  }

  handleTray() {
    this.props.handleScheduleTDC(this.props.trayData);
  }

  
  render() {    
    const crops = this.props.crops;
    const orders=this.props.orders;
    const customers=this.props.customers;
    const trayData = this.props.trayData;
    const selectedCrop = this.props.selectedCrop;
    let trayCrop, microgreenData;
    const isTraySameSelectedCrop=trayData.crop_id!==null && trayData.crop_id===this.props.selectedCrop ? true:false;

    const isBlocked = this.props.isBlocked && !isTraySameSelectedCrop;

    const customersLinked=orders ? orders.filter((order)=>order.crop_id===trayData.crop_id):[];

    const customersInfos=customersLinked.map((order)=> {
      const customerInfo=customers.find((x)=>x.id===order.customer_id);
      return <p>ID:{customerInfo.id} {customerInfo.company_name}{customerInfo.customer_fullname} Dostawa:{customerInfo.delivery_location}</p>
    });

    

    if (trayData!==undefined && trayData.crop_id !== null) {
      trayCrop = crops.find((x) => x.id === trayData.crop_id);
      microgreenData = trayCrop && trayCrop.microgreen_id!=="undefined" ? this.props.microgreens.find((x) => x.id === trayCrop.microgreen_id):'';
    } else {
      if (selectedCrop) microgreenData = this.props.microgreens.find((x) => x.id === selectedCrop.microgreen_id);
    }
    if (trayData!==undefined && trayData.crop_id !== null && !this.props.addCrop) {
      return <HtmlTooltip title={cropInfoRender(trayCrop, microgreenData,customersInfos)}><div style={{ backgroundColor: trayData.status === "1" && microgreenData ? microgreenData.color : '' }} className={"tray "+ (isBlocked ? 'blocked' : '')} onClick={() => this.handleTray()}><span>{this.props.small===true? 'S':'L'}</span></div></HtmlTooltip>;
    } else {
      return <div style={{ backgroundColor: trayData.status === "1" && microgreenData ? microgreenData.color : '' }} className={"tray "+ (isBlocked ? 'blocked' : '')} onClick={() => this.handleTray()}><span>{this.props.small===true? 'S':'L'}</span></div>;
    }

  }
}

export default Tray;
