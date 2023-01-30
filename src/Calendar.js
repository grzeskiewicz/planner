import React from "react";
import "./Calendar.css";


//TODO: generacja następnego roku!





// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);
/*
const MONTH_NAMES = "January February March April May June July August September October November December".split(
  " "
);
const weekdays = "Mo Tu We Th Fr Sa Su".split(" ");*/


const MONTH_NAMES = "Styczeń Luty Marzec Kwiecień Maj Czerwiec Lipiec Sierpień Wrzesień Październik Listopad Grudzień".split(" ");
const weekdays = "Pn Wt Śr Cz Pt So Nd".split(" ");

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.handleDaySelection = this.handleDaySelection.bind(this);
    this.changeMonth=this.changeMonth.bind(this);
    this.state = { dayClicked: '', selectedMonth: new Date().getMonth(), selectedYear: new Date().getFullYear() };
  }


  createCalendar(year, month) {
    const results = [];
    // find out first and last days of the month
    const firstDate = new Date(year, month, 1); //first day of the month
    const lastDate = new Date(year, month + 1, 0); //last day of month
    // calculate first monday and last sunday
    const firstMonday = this.getFirstMonday(firstDate);
    const lastSunday = this.getLastSunday(lastDate);

    // iterate days starting from first monday
    let iterator = new Date(firstMonday);
    let i = 0;

    // ..until last sunday
    while (iterator <= lastSunday) {
      if (i++ % 7 === 0) {
        // start new week when monday
        var week = [];
        results.push(week);
      }
      // push day to week
      week.push({
        date: new Date(iterator),
        before: iterator < firstDate, // add indicator if before current month
        after: iterator > lastDate // add indicator if after current month
      });
      // iterate to next day
      iterator.setDate(iterator.getDate() + 1);
    }
    //selectedMonth = month;
    return results;
  }

  fixMonday(day) {
    day || (day = 7);
    return --day;
  }

  getFirstMonday(firstDate) {
    //first monday closest to 1st day of mondth
    const offset = this.fixMonday(firstDate.getDay()); //how many days from 1st to monday

    const result = new Date(firstDate);
    result.setDate(firstDate.getDate() - offset); //create first monday : 1st day of the month - offset
    return result;
  }

  getLastSunday(lastDate) {
    const offset = 6 - this.fixMonday(lastDate.getDay()); //how many days till monday (6-dayOfTheWeek -1)

    const result = new Date(lastDate);
    result.setDate(lastDate.getDate() + offset); //last possible sunday after last day of the month

    return result;
  }

  handleDaySelection(date) {
    this.setState({ dayClicked: date });
    this.props.handleDaySelection(date);
  }

  changeMonth(event,val) {
    event.preventDefault()
    let selectedMonth = this.state.selectedMonth;
    if (val === 1) {
if (selectedMonth===11) {
  this.setState({ selectedMonth: 0,selectedYear: this.state.selectedYear +1});
 // this.props.handleMonthSelection(0, ++this.state.selectedYear);
} else {
  this.setState({ selectedMonth: ++selectedMonth});
 // this.props.handleMonthSelection(selectedMonth, this.state.selectedYear); 
}
    } else {
      if (selectedMonth===0) {
        this.setState({ selectedMonth: 11,selectedYear: this.state.selectedYear-1});
     //   this.props.handleMonthSelection(11, --this.state.selectedYear);
      } else {
        this.setState({ selectedMonth: --selectedMonth });
     //   this.props.handleMonthSelection(selectedMonth, this.state.selectedYear);
      }



    }
  }

  render() {
    const today = new Date();
    const calendar = this.createCalendar(this.state.selectedYear, this.state.selectedMonth);

    const week = weekdays.map((day, index) => {
      return <p className="day-name" key={index}>{day}</p>;
    });

    const renderMonth = calendar.map((week, index) => {
      let renderWeek = week.map((day, index2) => {
        const unactive=((day.date < new Date(today).setHours(0, 0, 0, 0))  && day.date.getDate() !== today.getDate()) || 
        (day.date < new Date(today).setHours(0, 0, 0, 0) && day.date!==new Date(today).setHours(0, 0, 0, 0)) ? true: false ;
        let className =
       unactive ? "unactive":'' + " " +
          (day.date.getMonth() === today.getMonth() &&
            day.date.getDate() === today.getDate()
            ? "today"
            : "") +
          " " +
          (day.before === true ? "before" : "")
          + " " + (day.after === true ? "after" : "") + " " +
          (String(this.state.dayClicked) === String(day.date) ? "day-clicked" : "");
        return (
          <div
            key={index2}
            date={day.date}
            className={"day " + className}
            onClick={!unactive? () => this.handleDaySelection(day.date):null}
          >
            <p>{day.date.getDate()}</p>
          </div>
        );
      });

      return <div key={index}>{renderWeek}</div>;
    });

    return (
      <div id="calendar-wrapper">
        <div id="calendar" className={this.props.className}>
          <div id="calendar-head">
            <div id="year-selection"><p>{this.state.selectedYear}</p></div>
            <div id="month-selection">
              <figure onClick={(event) => this.changeMonth(event,-1)}>{"<<"}</figure>
              <p id="month-name">{MONTH_NAMES[this.state.selectedMonth]}</p>
              <figure  onClick={(event) => this.changeMonth(event,1)}>{">>"}</figure>
            </div>
            <div id="day-names">{week}</div>
          </div>
          <div id="main-calendar">{renderMonth}</div>
        </div>
      </div>
    );
  }
}

export default Calendar;