import "./Crops.css";
import React from "react";
import moment from "moment";
import { API_URL, request } from "./APIConnection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const WATERING_API='http://watering.farmabracia.ovh:3051';

class Crop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editNotesEnabled: false,
      notes: this.props.crop.notes,
    };
    this.triggerEditNotes = this.triggerEditNotes.bind(this);
    this.editNotes = this.editNotes.bind(this);
    this.saveNotes = this.saveNotes.bind(this);
    this.deleteCrop = this.deleteCrop.bind(this);
  }

  triggerEditNotes() {
    this.props.setSelectedCrop(this.props.crop.id);
    this.setState({ editNotesEnabled: !this.state.editNotesEnabled });
  }

  deleteSchedule(crop) {
    fetch(request(`${WATERING_API}/deleteschedule`, "POST", {crop_id:crop.id}))
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
  

  scheduleWatering(crop) {
    const level = this.props.shelfData.level;
    let valve;
    let duration;
    switch (level) {
      case 1:
        valve = 1;
        duration = 20;
        break;
      case 2:
        valve = 2;
        duration = 25;
        break;
      case 3:
        valve = 3;
        duration = 30;
        break;
      case 4:
        valve = 4;
        duration = 35;
        break;
    }

    const stop = moment(crop.harvest).subtract(1, "days").format("YYYY-MM-DD");
    const job = {
      crop: crop.id,
      valve: valve,
      start: crop.lightExposureStart,
      stop: stop,
      duration: duration,
    };

    if (window.confirm("Czy zaplanować nawadnianie?")) {
      console.log("Planowanie nawadniania...");
      fetch(request(`${WATERING_API}/schedule`, "POST", job)) //SENDING JOB TO WATERING CONTROLLER
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.success) {
                  fetch(request(`${API_URL}/schedulewatering`, "POST", { crop: crop.id })) //update status in db
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
    } else {
    }
  }

  deleteCrop(crop) {
    console.log(crop.id);
    if (window.confirm("Czy usunąć zasiew?")) {
      fetch(request(`${API_URL}/deletecrop`, "POST", { crop_id: Number(crop.id) }))
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.success) {
            this.props.refreshCrops();
            fetch(request(`${WATERING_API}/deleteschedule`, "POST", {crop:crop.id}))
            .then((res2) => res2.json())
            .then((result2) => {
              console.log(result2)
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

  componentDidMount() {}

  enter(e) {
    if (e.key === "Enter") {
      //alert("PEDAU");
    }
  }

  //<textarea disabled={this.state.editNotesEnabled} onChange={this.editNotes} className='cropNotes'>  </textarea>

  render() {
    const microgreenData = this.props.microgreenData;
    const shelfData = this.props.shelfData;
    const crop = this.props.crop;
    const isMarked=Number(this.props.markedCrop)===Number(crop.id) ? true : false;
    console.log(Number(crop.id),Number(this.props.markedCrop), isMarked)

    //console.log(crop);
    //console.log(microgreenData);

    return (
      <tr className={"cropEntry " + (isMarked ? "marked":"")} key={this.props.index}>
        <td
          className="color"
          style={{ backgroundColor: this.props.microgreenData.color }}
        >
          {" "}
        </td>
        <td>{microgreenData.name_pl}</td>
        <td>{moment(crop.start).format("DD.MM.YYYY")}</td>
        <td>{moment(crop.blackoutStart).format("DD.MM.YYYY")}</td>
        <td>{moment(crop.lightExposureStart).format("DD.MM.YYYY")}</td>
        <td>{moment(crop.harvest).format("DD.MM.YYYY")}</td>
        <td>{shelfData.rack_name + shelfData.level}</td>
        <td>{crop.trays}</td>
        <td className="cropNotes">
          {this.state.editNotesEnabled &&
          Number(crop.id) === Number(this.props.selectedCrop) ? (
            <div className="cropNotesEnabled">
              <textarea
                onKeyDown={this.enter}
                rows="8"
                onChange={this.editNotes}
                type="text"
                value={this.state.notes}
              ></textarea>
              <FontAwesomeIcon
                onClick={this.saveNotes}
                icon={faCheckCircle}
                size="lg"
              />
            </div>
          ) : (
            <div className="cropNotesDisabled" onClick={this.triggerEditNotes}>
              <textarea
                disabled
                rows="2"
                onChange={this.editNotes}
                type="text"
                value={this.state.notes}
              ></textarea>
            </div>
          )}
        </td>
        <td onClick={() => this.deleteCrop(crop)}>
          <FontAwesomeIcon icon={faTrashAlt} size="lg" />
        </td>
        {crop.scheduled===1?<td>&#10004;</td>:<td onClick={() => this.scheduleWatering(crop)}>[Schedule]</td>}
        {crop.completed===1 ? <td>&#10004;</td>: crop.scheduled===1 ?<td onClick={() => this.deleteSchedule(crop)}>[Finish]</td>:<td>-</td>}
      </tr>
    );
  }
}

export default Crop;
