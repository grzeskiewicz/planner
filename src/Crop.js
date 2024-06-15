import "./Crops.css";
import React from "react";
import moment from "moment";
import { API_URL, request } from "./APIConnection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCheckCircle, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { isMobile } from 'react-device-detect';



const WATERING_API = 'http://localhost:3051';

class Crop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editNotesEnabled: false,
      notes: this.props.crop.notes,
      showWeekView: false
    };
    this.triggerEditNotes = this.triggerEditNotes.bind(this);
    this.editNotes = this.editNotes.bind(this);
    this.saveNotes = this.saveNotes.bind(this);
    this.deleteCrop = this.deleteCrop.bind(this);
  }



  deleteSchedule(crop) {
    fetch(request(`${WATERING_API}/deleteschedule`, "POST", { crop_id: crop.id }))
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          this.props.refreshCrops();
          fetch(request(`${API_URL}/completewatering`, "POST", { crop_id: crop.id }))
            .then((res2) => res2.json())
            .then((result2) => {
              if (result.success) {
                this.props.refreshCrops();
              } else {
                alert("SQL Erro - błędne wartości!");
              }
            })
            .catch((error) => Promise.reject(new Error(error)));
        } else {
          alert("SQL Erro - błędne wartości!");
        }
      })
      .catch((error) => Promise.reject(new Error(error)));
  }




  deleteCrop(crop) {
    if (window.confirm("Czy usunąć zasiew?")) {
      fetch(request(`${API_URL}/deletecrop`, "POST", { crop_id: Number(crop.id) }))
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            this.props.deleteCrop();
            this.props.refreshCrops();
            fetch(request(`${WATERING_API}/deleteschedule`, "POST", { crop: crop.id }))
              .then((res2) => res2.json())
              .then((result2) => {
              }).catch((error) => Promise.reject(new Error(error)));
          } else {
            alert("SQL Erro - błędne wartości!");
          }
        })
        .catch((error) => Promise.reject(new Error(error)));
    } else {
    }
  }

  editNotes(e) {
    e.preventDefault();
    this.setState({ notes: e.target.value });
  }

  saveNotes() {
    const notes = this.state.notes;
    fetch(
      request(`${API_URL}/savenotes`, "POST", {
        crop_id: this.props.crop.id,
        notes: notes,
      }))
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          this.setState({ editNotesEnabled: false });
          // alert("Notatki edytowane")
          this.props.refreshCrops();
        } else {
          alert("SQL Erro - błędne wartości!");
        }
      })
      .catch((error) => Promise.reject(new Error(error)));
  }

  enter(e) {
    if (e.key === "Enter") {
    }
  }


  triggerEditNotes(e) {
    e.preventDefault();
    this.props.setSelectedCrop(this.props.crop.id);
    this.setState({ editNotesEnabled: !this.state.editNotesEnabled });
  }

  scheduleCrop(crop) {
    this.props.showWeekView(crop);
  }
  //<textarea disabled={this.state.editNotesEnabled} onChange={this.editNotes} className='cropNotes'>  </textarea>
  //        <div>{shelfData.rack_name + shelfData.level}</div>
  //        {crop.scheduled === 1 ? <div>&#10004;</div> : <td onClick={() => this.scheduleWatering(crop)}><FontAwesomeIcon icon={faCalendarCheck} size="lg"/></div>}


  /*
   {this.state.editNotesEnabled && Number(crop.id) === Number(this.props.selectedCrop) ?
          <tr className='rowNotesEdit'><div>
            <textarea onKeyDown={this.enter} rows="8" onChange={this.editNotes} type="text" value={this.state.notes}></textarea>
            <FontAwesomeIcon onClick={this.saveNotes} icon={faCheckCircle} size="lg" /></div></tr> : ''}
        {this.state.showWeekView ? '' : ''}
  */

  render() {
    const crop = this.props.crop;
    let trays=crop.trays;
    const isSelected=this.props.selectedCrop && this.props.selectedCrop.id===crop.id;
    const microgreenData = this.props.microgreenData;
    let start = crop.harvest !== null ? (isMobile ? moment(crop.start).format("DD.MM") : moment(crop.start).format("DD.MM.YYYY")) : "-";
    let blackoutStart = crop.harvest !== null ? (isMobile ? moment(crop.blackoutStart).format("DD.MM") : moment(crop.blackoutStart).format("DD.MM.YYYY")) : "-";
    let lightExposureStart = crop.harvest !== null ? (isMobile ? moment(crop.lightExposureStart).format("DD.MM") : moment(crop.lightExposureStart).format("DD.MM.YYYY")) : "-";
    let harvest = crop.harvest !== null ? (isMobile ? moment(crop.harvest).format("DD.MM") : moment(crop.harvest).format("DD.MM.YYYY")) : "-";

    if (this.props.sim!==null && this.props.sim.harvest!==null) {
      const sim=this.props.sim;
      start=isMobile ? moment(sim.start).format("DD.MM") : moment(sim.start).format("DD.MM.YYYY");
      blackoutStart=isMobile ? moment(sim.blackout).format("DD.MM") : moment(sim.blackout).format("DD.MM.YYYY");
      lightExposureStart=isMobile ? moment(sim.light).format("DD.MM") : moment(sim.light).format("DD.MM.YYYY");
      harvest=isMobile ? moment(sim.harvest).format("DD.MM") : moment(sim.harvest).format("DD.MM.YYYY");
      trays=sim.trays;
    }
    return (

      <div className={"cropEntry " + (isSelected ? "selected" : "")} key={this.props.index}>
        <div className="color" style={{ backgroundColor: this.props.microgreenData.color }}>{" "}</div>
        <div className="cropType">{microgreenData.name_pl}</div>
        <div>{start}</div>
        <div>{blackoutStart}</div>
        <div>{lightExposureStart}</div>
        <div>{harvest}</div>
        <div className="trays">{trays}</div>
        <div className="cropNotes">
          {this.state.editNotesEnabled &&
            Number(crop.id) === Number(this.props.selectedCrop) ? (
            <div className="cropNotesEnabled">
              <textarea onKeyDown={this.enter} rows="8" onChange={this.editNotes} type="text" value={this.state.notes}></textarea>
              <FontAwesomeIcon onClick={this.saveNotes} icon={faCheckCircle} size="lg" />
            </div>
          ) : (
            <div className="cropNotesDisabled" onClick={this.triggerEditNotes}>
              {isMobile ? 'Notatki' : <textarea rows="2" onClick={this.triggerEditNotes} type="text" value={this.state.notes} onChange={() => { }}></textarea>}
            </div>
          )}
        </div>
        <div className="iconTD" onClick={() => this.deleteCrop(crop)}>
          <FontAwesomeIcon icon={faTrashAlt} size="lg" />
        </div>
       { this.props.addCrop===false ? crop.scheduled === 1 ? <div>&#10004;</div> : <div className="iconTD" onClick={() => this.scheduleCrop(crop)}><FontAwesomeIcon icon={faCalendarCheck} size="lg" /></div>:null}
        {crop.completed === 1 ? <div>&#10004;</div> : crop.scheduled === 1 ? <div className="iconTD" onClick={() => this.deleteSchedule(crop)}>[Finish]</div> :  this.props.addCrop===true ? null:<div className="iconTD">-</div>}
     
      </div>
    );
  }
}

export default Crop;
