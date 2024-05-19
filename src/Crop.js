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
        console.log(result);
        if (result.success) {
          this.props.refreshCrops();
          fetch(request(`${API_URL}/completewatering`, "POST", { crop_id: crop.id }))
            .then((res2) => res2.json())
            .then((result2) => {
              console.log(result2);
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
    console.log(crop.id);
    if (window.confirm("Czy usunąć zasiew?")) {
      fetch(request(`${API_URL}/deletecrop`, "POST", { crop_id: Number(crop.id) }))
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
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
      })
    )
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
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
  //        <td>{shelfData.rack_name + shelfData.level}</td>
  //        {crop.scheduled === 1 ? <td>&#10004;</td> : <td onClick={() => this.scheduleWatering(crop)}><FontAwesomeIcon icon={faCalendarCheck} size="lg"/></td>}


  /*
   {this.state.editNotesEnabled && Number(crop.id) === Number(this.props.selectedCrop) ?
          <tr className='rowNotesEdit'><td>
            <textarea onKeyDown={this.enter} rows="8" onChange={this.editNotes} type="text" value={this.state.notes}></textarea>
            <FontAwesomeIcon onClick={this.saveNotes} icon={faCheckCircle} size="lg" /></td></tr> : ''}
        {this.state.showWeekView ? '' : ''}
  */

  render() {
    const crop = this.props.crop;
    const isSelected=this.props.selectedCrop && this.props.selectedCrop.id===crop.id;
    const microgreenData = this.props.microgreenData;
    const start = crop.harvest !== null ? (isMobile ? moment(crop.start).format("DD.MM") : moment(crop.start).format("DD.MM.YYYY")) : "-";
    const blackoutStart = crop.harvest !== null ? (isMobile ? moment(crop.blackoutStart).format("DD.MM") : moment(crop.blackoutStart).format("DD.MM.YYYY")) : "-";
    const lightExposureStart = crop.harvest !== null ? (isMobile ? moment(crop.lightExposureStart).format("DD.MM") : moment(crop.lightExposureStart).format("DD.MM.YYYY")) : "-";
    const harvest = crop.harvest !== null ? (isMobile ? moment(crop.harvest).format("DD.MM") : moment(crop.harvest).format("DD.MM.YYYY")) : "-";
    return (

      <tr className={"cropEntry " + (isSelected ? "selected" : "")} key={this.props.index}>
        <td className="color" style={{ backgroundColor: this.props.microgreenData.color }}>{" "}</td>
        <td>{microgreenData.name_pl}</td>
        <td>{start}</td>
        <td>{blackoutStart}</td>
        <td>{lightExposureStart}</td>
        <td>{harvest}</td>
        <td>{crop.trays}</td>
        <td className="cropNotes">
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
        </td>
        <td onClick={() => this.deleteCrop(crop)}>
          <FontAwesomeIcon icon={faTrashAlt} size="lg" />
        </td>
        {crop.scheduled === 1 ? <td>&#10004;</td> : <td onClick={() => this.scheduleCrop(crop)}><FontAwesomeIcon icon={faCalendarCheck} size="lg" /></td>}
        {crop.completed === 1 ? <td>&#10004;</td> : crop.scheduled === 1 ? <td onClick={() => this.deleteSchedule(crop)}>[Finish]</td> : <td>-</td>}
     
      </tr>
    );
  }
}

export default Crop;
