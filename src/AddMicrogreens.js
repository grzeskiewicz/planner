import React from 'react';
import { request, API_URL } from "./APIConnection";
import { isMobile } from 'react-device-detect';
import moment from 'moment';
import Microgreens from './Microgreens';
import './addMicrogreens.css';

class AddMicrogreens extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameEN: '',
      namePL: '',
      gramsTray: '',
      gramsHarvest: '',
      wateringLevel: '1',
      weight: '',
      blackout: '',
      light: '',
      color: '#000000'
    }
    this.handleNamePL = this.handleNamePL.bind(this);
    this.handleNameEN = this.handleNameEN.bind(this);
    this.handleGramsTray = this.handleGramsTray.bind(this);
    this.handleGramsHarvest = this.handleGramsHarvest.bind(this);
    this.handleWateringLevel = this.handleWateringLevel.bind(this);
    this.handleWeight = this.handleWeight.bind(this);
    this.handleBlackout = this.handleBlackout.bind(this);
    this.handleLight = this.handleLight.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.saveMicrogreen = this.saveMicrogreen.bind(this);

  }

  addMicrogreens(event) {
    event.preventDefault();
    const microgreensData = JSON.parse(JSON.stringify(this.state));
    delete microgreensData.showAMF;
    delete microgreensData.selectedMicrogreens;

    fetch(request(`${API_URL}/addmicrogreens`, "POST", microgreensData))
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          this.props.refreshMicrogreens();
          alert("Dodano definicję mikroliści.");
        } else {
          alert("SQL Error - powtarzające się nazwy lub błędne wartości!")
        }
      })
      .catch((error) => { alert("Błąd! Nie udało się dodać definicji mikroliści!"); return error });
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

  handleGramsHarvest(event) {
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


  render() {
    const addMicrogreensForm = <form className="addMicrogreensForm" onSubmit={this.addMicrogreens}>
      <input type="text" placeholder='Nazwa (ENG)' value={this.state.nameEN} onChange={this.handleNameEN} required></input>
      <input type="text" placeholder='Nazwa (PL)' value={this.state.namePL} onChange={this.handleNamePL} required></input>
      <input type="number" placeholder='Taca waga [g]' max="2000" value={this.state.gramsTray} onChange={this.handleGramsTray} required pattern="^\d+$" title="Wprowadź liczbę"></input>
      <input type="number" placeholder='Zbiór waga L taca [g]' max="2000" value={this.state.gramsHarvest} onChange={this.handleGramsHarvest} required pattern="^\d+$" title="Wprowadź liczbę"></input>
      <select value={this.state.wateringLevel} onChange={this.handleWateringLevel} required>
        <option value={1}>POZIOM NAWODNIENIA - 1</option>
        <option value={2}>POZIOM NAWODNIENIA - 2</option>
        <option value={3}>POZIOM NAWODNIENIA - 3</option>
      </select>
      <input type="number" max="30" placeholder={isMobile ? 'Obciąż.' : 'Obciążanie [dni]'} value={this.state.weight} onChange={this.handleWeighting} required pattern="^\d+$" title="Wprowadź liczbę"></input>
      <input type="number" max="30" placeholder={isMobile ? 'Black.' : 'Blackout [dni]'} value={this.state.blackout} onChange={this.handleBlackout} required pattern="^\d+$" title="Wprowadź liczbę"></input>
      <input type="number" max="30" placeholder={isMobile ? 'Naśw.' : 'Naświetlanie [dni]'} value={this.state.light} onChange={this.handleExposure} required pattern="^\d+$" title="Wprowadź liczbę"></input>
      <input id="microgreens-color-picker" placeholder='Kolor' value={this.state.color} onChange={this.handleColor} type="color"></input>
      <button type='submit'>DODAJ</button>
      {this.state.error !== '' ? <p className="error">{this.state.error}</p> : ''}
    </form>;
    return (
      <div id="addMicrogreens">
        {addMicrogreensForm}
      </div>);
  }
}


export default AddMicrogreens;
