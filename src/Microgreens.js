import "./Microgreens.css";
import React from "react";
import { API_URL, request } from "./APIConnection";
import Microgreen from "./Microgreen";
import { isMobile } from 'react-device-detect';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt,faEdit} from "@fortawesome/free-solid-svg-icons";



class Microgreens extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameEN = this.handleNameEN.bind(this);
    this.handleNamePL = this.handleNamePL.bind(this);
    this.handleGramsTray = this.handleGramsTray.bind(this);
    this.handleBlackout = this.handleBlackout.bind(this);
    this.handleWeighting = this.handleWeighting.bind(this);
    this.handleExposure = this.handleExposure.bind(this);
    this.handleWateringLevel = this.handleWateringLevel.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.setSelectedMicrogreens = this.setSelectedMicrogreens.bind(this);
    this.editMicrogreens = this.editMicrogreens.bind(this);
    this.handleGramsHarvest=this.handleGramsHarvest.bind(this);

    this.state = {
      nameEN: '',
      namePL: '',
      gramsTray: '',
      gramsHarvest:'',
      wateringLevel:'1',
      weight: '',
      blackout: '',
      light: '',
      color: '#000000',
      selectedMicrogreens: '',
    };
  }

  refreshMicrogreens() {
    this.props.refreshMicrogreens();
  }

  setSelectedMicrogreens(id) {
    this.setState({ selectedMicrogreens: id });
  }

  editMicrogreens(microgreensData) {
    console.log(microgreensData);
    fetch(request(`${API_URL}/editmicrogreens`, "POST", microgreensData))
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          this.props.refreshMicrogreens();
          this.setState({ selectedMicrogreens: '' });
        } else {
          alert("SQL Error - powtarzające się nazwy lub błędne wartości!")
        }
      })
      .catch((error) => {alert("Błąd! Edycja definicji mikroliści nieudana!"); return error}); 
  }

  handleNameEN(event) {
    this.setState({ nameEN: event.target.value });
  }

  handleNamePL(event) {
    this.setState({ namePL: event.target.value });
  }
  handleGramsTray(event) {
    this.setState({ gramsTray: event.target.value });
  }

  handleGramsHarvest(event){
    this.setState({ gramsHarvest: event.target.value });

  }
  handleWateringLevel(event) {
    this.setState({ wateringLevel: event.target.value });
  }


  handleWeighting(event) {
    this.setState({ weight: event.target.value });
  }

  handleBlackout(event) {
    this.setState({ blackout: event.target.value });
  }

  handleExposure(event) {
    this.setState({ light: event.target.value });
  }

  handleColor(event) {
    console.log(event.target.value);
    this.setState({ color: event.target.value });
  }

  renderMicrogreensTable() {
    return this.props.microgreens.map((microgreen, index) => {
      return <Microgreen refreshMicrogreens={this.props.refreshMicrogreens} editMicrogreens={this.editMicrogreens} selectedMicrogreens={this.state.selectedMicrogreens} setSelectedMicrogreens={this.setSelectedMicrogreens} microgreen={microgreen} key={index} index={index}></Microgreen>
    });
  }




  render() {
    let microgreensTable;
    if (this.props.microgreens !== '') microgreensTable = this.renderMicrogreensTable();
    const microgreensListTable = <div id="microgreens-list">
        <div className="head">
         <div className='microgreenNamePL'>Nazwa</div><div className='microgreenNameEN'>Name</div><div>{isMobile ? 'S[g]':'Taca[g]'}</div><div>{isMobile ? 'H[g]': 'Zbiór taca[g]'}</div><div>{isMobile ? 'W. LVL' : 'Nawodnienie'}</div><div>{isMobile ? 'WG' : 'Obciążanie [dni]'}</div><div>{isMobile ? 'BL' : 'Blackout [dni]'}</div><div>{isMobile ? 'L' : 'Naświetlanie [dni]'}</div><div>{isMobile ? 'SUM':'Całość [dni]'}</div><div className='microgreenColor'>Kolor</div>    
         <div className="iconTD">
          <FontAwesomeIcon icon={faTrashAlt} size="lg" />
        </div>
        <div className="iconTD">
          <FontAwesomeIcon icon={faEdit} size="lg" />
        </div>
        </div>
        <div className="body">
          {microgreensTable}
        </div>
    </div>;

    return <div className="Microgreens">
{microgreensListTable}
    </div>;
  }
}

export default Microgreens;
