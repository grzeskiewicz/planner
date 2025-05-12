import "./Crops.css";
import React from "react";
import moment from "moment";
import { API_URL, request } from "./APIConnection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCheckCircle, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { isMobile } from 'react-device-detect';



const WATERING_API = 'http://192.168.1.6:3051';

class Crop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editNotesEnabled: false,
      showWeekView: false,
      notes: ''
    };
    this.triggerEditNotes = this.triggerEditNotes.bind(this);
    this.editNotes = this.editNotes.bind(this);
    this.saveNotes = this.saveNotes.bind(this);
    this.deleteCrop = this.deleteCrop.bind(this);
  }

  componentDidMount() {
    this.setState({ notes: this.props.crop.notes });
  }

  componentDidUpdate() {
    if (this.props.crop.notes !== this.state.notes) {
      this.setState({ notes: this.props.crop.notes });
    }
  }

  componentWillUnmount() { //?
    this.setState({ notes: '' });
    this.props.refreshCrops();
  }



  deleteSchedule(crop) {
    if (window.confirm("Czy zakończyć zasiew?\nZostanie USUNIĘTY z harmonogramu nawadniania\noraz oznaczony w bazie jako ZAKOŃCZONY.\nPROCES NIEODWRACALNY")) {

      fetch(request(`${WATERING_API}/deleteschedule`, "POST", { crop: crop.id }))
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {

            fetch(request(`${API_URL}/completewatering`, "POST", { crop: crop.id }))
              .then((res2) => res2.json())
              .then((result2) => {
                if (result.success) {
                  this.props.refreshCrops();
                } else {
                  alert("SQL Error - błędne wartości!");
                }
              })
              .catch((error) => { alert("Nie udało się zakończyć nawadniania w bazie!"); return error });
          } else {
            alert("SQL Error - błędne wartości!");
          }
        })
        .catch((error) => { alert("Nie udało się usunąć zadania z centrum nawadniania!!!"); return error });

    }
  }




  deleteCrop(crop) {
    if (window.confirm("Czy usunąć zasiew (baza + harmonogram nawadniania)?")) {
      fetch(request(`${API_URL}/deletecrop`, "POST", { crop_id: Number(crop.id) }))
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            this.props.deleteCrop();
            this.props.refreshCrops();
            if (crop.scheduled === 1) {
              fetch(request(`${WATERING_API}/deleteschedule`, "POST", { crop: crop.id }))
                .then((res2) => res2.json())
                .then((result2) => {
                }).catch((error) => {
                  alert("Zasiew usunięty, ale nie udało się usunąć zadania z centrum nawadniania!!!");
                  this.props.refreshCrops();
                  return error
                });
            }
          } else {
            alert("SQL Error - błędne wartości!");
          }
        })
        .catch((error) => { alert("Problem z usunięciem zasiewu!"); return error });
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
          alert("SQL Error - błędne wartości!");
        }
      })
      .catch((error) => { alert("Nie udało się zapisać notatek!"); return error });
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

  render() {
    const crop = this.props.crop;
    let trays = crop.trays;

    const isSelected = this.props.selectedCrop && this.props.selectedCrop.id === crop.id;
    const microgreenData = this.props.microgreenData;
    let start = crop.harvest !== null ? (isMobile ? moment(crop.start).format("DD.MM") : moment(crop.start).format("DD.MM.YYYY")) : "-";
    let blackoutStart = crop.harvest !== null ? (isMobile ? moment(crop.blackoutStart).format("DD.MM") : moment(crop.blackoutStart).format("DD.MM.YYYY")) : "-";
    let lightExposureStart = crop.harvest !== null ? (isMobile ? moment(crop.lightExposureStart).format("DD.MM") : moment(crop.lightExposureStart).format("DD.MM.YYYY")) : "-";
    let harvest = crop.harvest !== null ? (isMobile ? moment(crop.harvest).format("DD.MM") : moment(crop.harvest).format("DD.MM.YYYY")) : "-";

    if (this.props.sim !== null && this.props.sim.harvest !== null) {
      const sim = this.props.sim;
      start = isMobile ? moment(sim.start).format("DD.MM") : moment(sim.start).format("DD.MM.YYYY");
      blackoutStart = isMobile ? moment(sim.blackout).format("DD.MM") : moment(sim.blackout).format("DD.MM.YYYY");
      lightExposureStart = isMobile ? moment(sim.light).format("DD.MM") : moment(sim.light).format("DD.MM.YYYY");
      harvest = isMobile ? moment(sim.harvest).format("DD.MM") : moment(sim.harvest).format("DD.MM.YYYY");
      trays = sim.trays;
    }

    const today = moment();
    const isStartToday = moment(crop.start).isSame(today, 'day');
    const isBlackoutToday = moment(crop.blackoutStart).isSame(today, 'day');
    const isLightToday = moment(crop.lightExposureStart).isSame(today, 'day');
    const isHarvestToday = moment(crop.harvest).isSame(today, 'day');
    const isCropDue = moment(crop.harvest).isBefore(today, 'day');
    //console.log(moment(crop.blackoutStart).format('DD.MM.YYYY'), moment().format('DD.MM.YYYY'));
    console.log(crop.start, blackoutStart, lightExposureStart, crop.harvest);

    return (

      <div className={"cropEntry " + (isSelected ? "selected " : "") + (isCropDue ? "cropDue" : "")} key={this.props.index}>
        <div className='cropID'>{crop.id}</div>
        <div className="color" style={{ backgroundColor: this.props.microgreenData.color }}>{" "}</div>
        <div className={"cropType " + ((isStartToday || isBlackoutToday || isLightToday || isHarvestToday) ? "todayEvent" : "")}>{microgreenData.name_pl}</div>
        <div className={isStartToday ? "todayEvent" : ""}>{start}</div>
        <div className={isBlackoutToday ? "todayEvent" : ""}>{blackoutStart}</div>
        <div className={isLightToday ? "todayEvent" : ""}>{lightExposureStart}</div>
        <div className={isHarvestToday ? "todayEvent" : ""}>{harvest}</div>
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
        {this.props.addCrop === false ? crop.scheduled === 1 ? <div className="iconTD">&#10004;</div> : <div className="iconTD" onClick={() => this.scheduleCrop(crop)}><FontAwesomeIcon icon={faCalendarCheck} size="lg" /></div> : null}
        {crop.completed === 1 ? <div className="iconTD">&#10004;</div> : crop.scheduled === 1 ? <div className="iconTD" onClick={() => this.deleteSchedule(crop)}>[Finish]</div> : this.props.addCrop === true ? null : <div className="iconTD">-</div>}

      </div>
    );
  }
}

export default Crop;
