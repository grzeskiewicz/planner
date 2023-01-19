import "./Microgreens.css";
import React from "react";
import { API_URL, request } from "./APIConnection";

class Microgreens extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameEN = this.handleNameEN.bind(this);
    this.handleNamePL = this.handleNamePL.bind(this);
    this.handleGramsTray = this.handleGramsTray.bind(this);
    this.handleBlackout = this.handleBlackout.bind(this);
    this.handleWeighting = this.handleWeighting.bind(this);
    this.handleExposure = this.handleExposure.bind(this);
    this.handleTopWater=this.handleTopWater.bind(this);
    this.handleBottomWater=this.handleBottomWater.bind(this);
    this.handleColor=this.handleColor.bind(this);
    this.addMicrogreens=this.addMicrogreens.bind(this);

    this.state = {
      nameEN:'',
      namePL:'',
      gramsTray:'',
      topWater:'',
      bottomWater:'',
      weight:'',
      blackout:'',
      light:'',
      color:''
    };
  }

refreshMicrogreens(){
  this.props.refreshMicrogreens();
}

  addMicrogreens(event) {
    event.preventDefault();
    const microgreensData=this.state;
    fetch(request(`${API_URL}/addmicrogreens`, "POST", microgreensData))
      .then((res) => res.json())
      .then((result) => {
       if (result.success) {
        this.props.refreshMicrogreens(); 
        } else {
          alert("SQL Error - powtarzające się nazwy lub błędne wartości!")
        }
      })
      .catch((error) => Promise.reject(new Error(error))); //Promise.reject(new Error(error))
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
handleTopWater(event) {
  this.setState({ topWater: event.target.value });
}

handleBottomWater(event) {
  this.setState({ bottomWater: event.target.value });
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

handleColor(event){
  console.log(event.target.value);
  this.setState({ color: event.target.value });
}

renderMicrogreensTable(){
  return this.props.microgreens.map((microgreen, index) => {
    return <tr key={index}>
        <td>{microgreen.name_pl}</td>
        <td>{microgreen.name_en}</td>
        <td>{microgreen.grams_tray}</td>
        <td>{microgreen.top_water}</td>
        <td>{microgreen.bottom_water}</td>
        <td>{microgreen.weight}</td>
        <td>{microgreen.blackout}</td>
        <td>{microgreen.light}</td>
        <td style={{backgroundColor:microgreen.color}}>{microgreen.color.toUpperCase() }</td>
    </tr>
});
}


  render() {
    let microgreensTable;
    if (this.props.microgreens!=='') microgreensTable=this.renderMicrogreensTable();
    return <div className="Microgreens">
<div id="addMicrogreens">
            <form className="" onSubmit={this.addMicrogreens}>
                    <input placeholder='Nazwa (ENG)' value={this.state.nameEN} onChange={this.handleNameEN} required></input>
                    <input placeholder='Nazwa (PL)' value={this.state.namePL} onChange={this.handleNamePL} required></input>
                    <input placeholder='Taca waga [g]' value={this.state.gramsTray} onChange={this.handleGramsTray} required pattern="^\d+$" title="Wprowadź liczbę"></input>
                    <input placeholder='Opryskiwanie [ml]' value={this.state.topWater} onChange={this.handleTopWater} required pattern="^\d+$" title="Wprowadź liczbę"></input>
                    <input placeholder='Nawodnienie [ml]' value={this.state.bottomWater} onChange={this.handleBottomWater} required pattern="^\d+$" title="Wprowadź liczbę"></input>
                    <input placeholder='Obciążanie [dni]' value={this.state.weight} onChange={this.handleWeighting} required pattern="^\d+$" title="Wprowadź liczbę"></input>
                    <input placeholder='Blackout [dni]' value={this.state.blackout} onChange={this.handleBlackout} required pattern="^\d+$" title="Wprowadź liczbę"></input>
                    <input placeholder='Naświetlanie [dni]' value={this.state.light} onChange={this.handleExposure} required pattern="^\d+$" title="Wprowadź liczbę"></input>
                    <input id="microgreens-color-picker" placeholder='Kolor' value={this.state.color} onChange={this.handleColor} type="color"></input>
                    <button type='submit'>Dodaj</button>
                                  {this.state.error !== '' ? <p className="error">{this.state.error}</p> : ''}
            </form>
            </div>
            <div id="microgreens-list">
            <table>
<thead>
<tr><td>Nazwa</td><td>Name</td><td>Taca waga[g]</td><td>Opryskiwanie[ml]</td><td>Nawodnienie[ml]</td><td>Obciążanie</td><td>Blackout</td><td>Naświetlanie</td><td>Kolor</td></tr>
</thead>
      <tbody>
        {microgreensTable}
      </tbody>
</table>
</div>
                </div>;
  }
}

export default Microgreens;
