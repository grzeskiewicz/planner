import React from "react";
import moment from "moment";
import "./WeekView.css";
import { calcDatesCrop, renderByMicrogreens, groupByShelves, groupByDay, groupByFNDTrays } from "./ViewCommon";
import FNDTray from "./FNDTray";
//tdc - traydatecrop

class WeekView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weekNow: moment().weeks(),
      toggleVal: true,
      checkedItems: this.setChecked(),
      tdc: JSON.parse(JSON.stringify(this.props.tdc)),
      tdcOriginal: JSON.parse(JSON.stringify(this.props.tdc)),
      weekTDC: "",
      scheduledTDC: [],
      blockDate: undefined
    };
    this.minusWeek = this.minusWeek.bind(this);
    this.plusWeek = this.plusWeek.bind(this);
    this.weekCrops = this.weekCrops.bind(this);
    this.weekTDC = this.weekTDC.bind(this);
    this.showDayView = this.showDayView.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.handleScheduleTDC = this.handleScheduleTDC.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.saveScheduleTDC = this.saveScheduleTDC.bind(this);
    this.fillScheduledTDC = this.fillScheduledTDC.bind(this);
  }

  componentDidMount() {
    this.fillScheduledTDC();
  }

  fillScheduledTDC() {
    if (this.props.className === "scheduleCrop") {
      const weekTDC = this.weekTDC(this.state.tdc);
      const scheduledTDC = weekTDC.filter((x) => x.crop_id === this.props.selectedCrop.id);
      this.setState({ scheduledTDC: scheduledTDC });
    }
  }

  createRack(grpByShelves) {
    const rack = (
      <div className="rack">
        {this.createShelf(grpByShelves, 0)}
        {this.createShelf(grpByShelves, 1)}
        {this.createShelf(grpByShelves, 2)}
        {this.createShelf(grpByShelves, 3)}
      </div>
    );
    return rack;
  }

  createShelf(grpByShelves, i) {
    //const weekTDC=this.weekTDC(JSON.parse(JSON.stringify(this.props.tdc)));
    const isScheduled = this.props.selectedCrop !== undefined ? JSON.parse(JSON.stringify(this.props.tdc)).filter((x) => x.crop_id === this.props.selectedCrop.id) : '';
    //console.log(isScheduled);
    const blockDate2 = isScheduled && isScheduled.length > 0 ? isScheduled.reduce((min, entry) => moment(min.date).isBefore(moment(entry.date)) ? min : entry) : '';
    const blockDate = this.state.blockDate !== undefined ? this.state.blockDate : blockDate2.date;
    //const blockDate=this.state.blockDate;
    // console.log(blockDate,this.state.blockDate)
    const row = (
      <div className="row">
        <div className="shelf" style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[0][i][0]} pos="L" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[0][i][1]} pos="P" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
        </div>
        <div className="shelf" style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[1][i][0]} pos="L" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[1][i][1]} pos="P" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
        </div>
        <div className="shelf" style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[2][i][0]} pos="L" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops} ></FNDTray>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[2][i][1]} pos="P" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
        </div>
        <div className="shelf" style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[3][i][0]} pos="L" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[3][i][1]} pos="P" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
        </div>
        <div className="shelf" style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} >
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[4][i][0]} pos="L" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[4][i][1]} pos="P" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
        </div>
        <div className="shelf" style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} >
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[5][i][0]} pos="L" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[5][i][1]} pos="P" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
        </div>
        <div className="shelf" style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[6][i][0]} pos="L" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[6][i][1]} pos="P" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
        </div>
      </div>
    );
    return row;
  }

  renderByFND(grpByFNDT, days) {
    const arr = [];

    for (let i = 0; i < days; i++) {
      const grpByShelves = groupByShelves(grpByFNDT[i]);
      if (grpByShelves !== undefined) arr.push(grpByShelves);
    }
    if (arr.length > 0) {
      const rack = this.createRack(arr);
      return rack;
    } else return;
  }

  weekCrops(crops) {
    //crops which are during selected week
    const weekNowMon = moment()
      .week(this.state.weekNow)
      .weekday(1)
      .startOf("day");
    const weekNowSun = moment()
      .week(this.state.weekNow)
      .weekday(7)
      .endOf("day");
    const weekCrops = [];
    for (const crop of crops) {
      if (
        weekNowMon.isSameOrBefore(moment(crop.harvest)) &&
        weekNowSun.isSameOrAfter(moment(crop.start))
      ) {
        weekCrops.push(crop);
      }
    }
    return weekCrops;
  }

  weekTDC(tdc) {
    //crops which are during selected week
    // console.log(this.state.weekNow);
    const weekNowMon = moment()
      .week(this.state.weekNow)
      .weekday(1)
      .startOf("day");
    const weekNowSun = moment()
      .week(this.state.weekNow)
      .weekday(7)
      .endOf("day");
    const weekTDC = [];
    for (const entry of tdc) {
      if (
        moment(entry.date).isBetween(weekNowMon, weekNowSun, undefined, "[]")
      ) {
        let entryCp = JSON.parse(JSON.stringify(entry));
        let entryDate = moment(entryCp.date);
        entryCp.date = entryDate.format("DD.MM.YYYY");
        weekTDC.push(entry);
      }
    }

    return weekTDC;
  }


  minusWeek() {
    this.setState({ weekNow: this.state.weekNow - 1 });
  }

  plusWeek() {
    this.setState({ weekNow: this.state.weekNow + 1 });
  }

  showDayView(day) {
    this.props.setSelectedDay(day);
  }

  toggleView() {
    this.setState({ toggleVal: !this.state.toggleVal });
  }

  setChecked() {
    const checkedItems = new Map();
    for (const item of this.props.microgreens) {
      checkedItems.set(item.name_pl, true);
    }
    return checkedItems;
  }

  handleCheck = (e) => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState((prevState) => ({
      checkedItems: prevState.checkedItems.set(item, isChecked),
    }));
  };

  renderMicrogreensFilter() {
    return this.props.microgreens.map((microgreen, index) => {
      return (
        <div style={{ backgroundColor: microgreen.color }}>
          <input
            key={microgreen.id}
            checked={this.state.checkedItems.get(microgreen.name_pl)}
            onChange={this.handleCheck}
            type="checkbox"
            name={microgreen.name_pl}
          />
          <p>{microgreen.name_pl}</p>
        </div>
      );
    });
  }

  handleScheduleTDC(tray) { //ODZNACZANIE TRAYA
    if (this.props.className === "scheduleCrop") {
      const selectedCrop = this.props.selectedCrop;
      const microgreenData = this.props.microgreens.find((x) => x.id === selectedCrop.microgreen_id);
      //const tdc = JSON.parse(JSON.stringify(this.state.tdcOriginal));
      const tdc = this.state.tdc;

      const start = moment(tray.date).startOf("day");
      const finish = moment(tray.date).add(microgreenData.light, "days").endOf("day"); // CROP HARVEST

      const tdcRange = tdc.filter((x) => moment(x.date).isBetween(start, finish, undefined, "[]"));
      const tdcTray = tdcRange.filter((x) => x.tray_id === tray.tray_id);
      const isCrop = tdcTray.filter((x) => x.crop_id !== null);
      let scheduledTDC = JSON.parse(JSON.stringify(this.state.scheduledTDC));;
      if (isCrop.length === 0) {
        for (const entry of tdcTray) {
          const elem = tdc.find((x) => x.id === entry.id);
          elem.status = "1";
          elem.crop_id = selectedCrop.id;
          scheduledTDC.push(elem);
        }
        //  console.log(scheduledTDC)
        const blockDate = scheduledTDC.reduce((min, entry) => moment(min.date).isBefore(moment(entry.date)) ? min : entry);
        this.setState({ scheduledTDC: scheduledTDC, blockDate: blockDate.date });//BLOCK DATE
      } else {
        const isLast = tdcRange.filter((x) => x.crop_id === selectedCrop.id).length === microgreenData.light + 1; //zbior nie liczy sie jako naswietlanie ale czas przebywania obecnie na półce microgreenData.light +1
        if (tray.crop_id === selectedCrop.id) {
          for (const entry of tdcTray) {
            const elem = tdc.find((x) => x.id === entry.id);
            elem.status = "0";
            elem.crop_id = null;
            scheduledTDC.push(elem);
            //  scheduledTDC = scheduledTDC.filter((x) => x.id !== elem.id);
          }
          if (isLast) {
            console.log("USUWAM");
            this.setState({ scheduledTDC: scheduledTDC, blockDate: undefined, tdc: tdc });
          } else {
            this.setState({ scheduledTDC: scheduledTDC });
          }
        }
      }
    }
  }

  saveScheduleTDC() {
    const harvest = this.state.scheduledTDC.reduce((max, entry) => moment(max.date).isAfter(moment(entry.date)) ? max : entry);
    //const tdcs = this.state.scheduledTDC.map((x) => x.id);

    const tdcs = this.state.scheduledTDC;
    console.log(tdcs)
    this.props.saveScheduleTDC(this.props.selectedCrop.id, tdcs, harvest.date);
  }

  render() {
    const weekTDC = this.weekTDC(this.state.tdc);
    const grpWeekTDCByDay = groupByDay(weekTDC,this.props.trays);
    const grpByFNDTrays = groupByFNDTrays(grpWeekTDCByDay, this.props.microgreens);

    const byShelves = this.renderByFND(grpByFNDTrays, 7);
    const weekNow = moment().week(this.state.weekNow);
    calcDatesCrop(this.props.crops, this.props.microgreens);
    const weekCrops = this.weekCrops(this.props.crops);

    const byMicrogreens = renderByMicrogreens(
      weekCrops,
      this.props.microgreens,
      7,
      null,
      weekNow,
      this.state.checkedItems,
      this.props.setSelectedCrop
    );

    const [mon, tue, wed, thu, fri, sat, sun] = [
      JSON.parse(JSON.stringify(weekNow.weekday(1))),
      JSON.parse(JSON.stringify(weekNow.weekday(2))),
      JSON.parse(JSON.stringify(weekNow.weekday(3))),
      JSON.parse(JSON.stringify(weekNow.weekday(4))),
      JSON.parse(JSON.stringify(weekNow.weekday(5))),
      JSON.parse(JSON.stringify(weekNow.weekday(6))),
      JSON.parse(JSON.stringify(weekNow.weekday(7))),
    ];
    const filter = this.renderMicrogreensFilter();
    return (
      <div id="WeekView" className={this.props.className}>
        <div className="switchWrapper">
          <p>{this.state.toggleVal ? "MICROGREENS" : "PÓŁKI"}</p>
          <label className="switch">
            <input type="checkbox" onChange={this.toggleView}></input>
            <span className="slider-green"></span>
          </label>
        </div>
        <div className="filter">{filter}</div>
        <div className="control-row">
          {this.state.weekNow > 1 ? (
            <div onClick={this.minusWeek} className="back">{"<<"}</div>
          ) : (
            <div></div>
          )}
          <div>{this.state.weekNow - 1}</div>
          {this.state.weekNow <= 52 ? (
            <div onClick={this.plusWeek} className="next">{">>"}</div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="head">
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Pon</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Wt</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Śr</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Czw</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Pt</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Sob</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Ndz</div>
        </div>
        <div className="head-2 row">
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} onClick={() => this.showDayView(mon)}>
            {moment(mon).format("DD.MM")}
          </div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} onClick={() => this.showDayView(tue)}>
            {moment(tue).format("DD.MM")}
          </div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} onClick={() => this.showDayView(wed)}>
            {moment(wed).format("DD.MM")}
          </div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} onClick={() => this.showDayView(thu)}>
            {moment(thu).format("DD.MM")}
          </div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} onClick={() => this.showDayView(fri)}>
            {moment(fri).format("DD.MM")}
          </div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} onClick={() => this.showDayView(sat)}>
            {moment(sat).format("DD.MM")}
          </div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} onClick={() => this.showDayView(sun)}>
            {moment(sun).format("DD.MM")}
          </div>
        </div>

        {this.state.toggleVal ? (
          <div className="viewWrapper">{byShelves}</div>
        ) : (
          <div className="viewWrapper">{byMicrogreens}</div>
        )}
        {this.props.className === "scheduleCrop" ? <div id="saveScheduleDiv">
          <button onClick={this.saveScheduleTDC}>Zapisz</button>
        </div> : (
          ""
        )}
      </div>
    );
  }
}

export default WeekView;
