import moment from "moment";
import { Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import React from "react";


export function groupByDay(tdc, trays) {
  //grupowanie po 'date', dodanie oznaczenia FND Trays (elektrozawory)
  const grp = [];

  for (const entry of tdc) {
    const trayData = trays.find((x) => x.id === entry.tray_id);
    entry.fndtray_id = trayData.fndtray_id;
    if (!grp[entry.date]) grp[entry.date] = [];
    grp[entry.date].push(entry);
  }
  return grp;
}

export function groupByFNDTrays(grpDay) {
  const mapArr = [];

  for (const [day, arr] of Object.entries(grpDay)) {
    const grp = [];
    for (const entry of arr) {
      if (!grp[entry.fndtray_id]) grp[entry.fndtray_id] = [];
      grp[entry.fndtray_id].push(entry);
    }
    
    mapArr.push(grp);
  }
  return mapArr;
}

export function groupByShelves(grpDay) {
  //shelfX, X-poziom od dołu
  let shelf1 = [],
    shelf2 = [],
    shelf3 = [],
    shelf4 = [];
  if (grpDay !== null && grpDay !== undefined) {
    for (const [valve, arr] of Object.entries(grpDay)) {
      if (Number(valve) === 1 || Number(valve) == 2) shelf4.push(arr);
      if (Number(valve) === 3 || Number(valve) == 4) shelf3.push(arr);
      if (Number(valve) === 5 || Number(valve) == 6) shelf2.push(arr);
      if (Number(valve) == 7 || Number(valve) == 8) shelf1.push(arr);
    }
    return [shelf4, shelf3, shelf2, shelf1];
  }
}



export function whichStage(day, crop) {

  const start = moment(crop.start);
  const blackoutStart = moment(crop.blackoutStart);
  const lightExposureStart = moment(crop.lightExposureStart);
  const harvest = moment(crop.harvest);
  let stage = false;
 
  if (day.isSame(start, "day")) stage = "S";
  if (day.isBetween(start.endOf("day"), blackoutStart.startOf("day")))
    stage = "WG";
  if (
    day.isBetween(
      blackoutStart.startOf("day"),
      lightExposureStart.startOf("day")
    )
  )
    stage = "BL";
  if (day.isBetween(lightExposureStart.startOf("day"), harvest.startOf("day")))
    stage = "LE";
  if (day.isSame(harvest, "day")) stage = "H";
  
  return stage;
}

export function calcDatesCrop(crops, microgreens) {
  for (const crop of crops) {
    const microgreen = microgreens.find((x) => x.id === crop.microgreen_id);
    const lightExposureStart = moment(crop.harvest).subtract(microgreen.light, "days");
    const blackoutStart = moment(lightExposureStart).subtract(microgreen.blackout, "days");
    const start = moment(blackoutStart).subtract(microgreen.weight, "days");
    crop.lightExposureStart = lightExposureStart.format('YYYY-MM-DD HH:mm');
    crop.blackoutStart = blackoutStart.format('YYYY-MM-DD HH:mm');
    crop.start = start.format('YYYY-MM-DD HH:mm');
  }
}

export function whichStageShelves(day, crop) {
  const lightExposureStart = moment(crop.lightExposureStart);
  const harvest = moment(crop.harvest);
  let stage = false;
  if (day.isBetween(lightExposureStart.startOf("day"), harvest.startOf("day")))
    stage = "LE";
  if (day.isSame(harvest, "day")) stage = "H";
  return stage;
}

export function cropInfoRender(cropInfo, microgreen) {
  return (
    <div className="cropInfo">
      <p>KONTRAHENT INFO</p>
      <p>ID:{cropInfo.id}</p>
      <p>{microgreen.name_pl}</p>
      <p>
        S: {moment(cropInfo.start).format("DD.MM hh:mm")} (
        {moment(cropInfo.start).format("dddd").substring(0, 3).toUpperCase()})
      </p>
      <p>
        B: {moment(cropInfo.blackoutStart).format("DD.MM hh:mm")} (
        {moment(cropInfo.blackoutStart)
          .format("dddd")
          .substring(0, 3)
          .toUpperCase()}
        )
      </p>
      <p>
        L: {moment(cropInfo.lightExposureStart).format("DD.MM hh:mm")} (
        {moment(cropInfo.lightExposureStart)
          .format("dddd")
          .substring(0, 3)
          .toUpperCase()}
        )
      </p>
      <p>
        H: {moment(cropInfo.harvest).format("DD.MM hh:mm")} (
        {moment(cropInfo.harvest).format("dddd").substring(0, 3).toUpperCase()})
      </p>
      <p className="notes">{cropInfo.notes}</p>
    </div>
  );
}

/*const HtmlTooltip = styled(({ className, ...props }) => (
<Tooltip {...props}  classes={{ popper: className }} />
))(({ theme }) => ({
[`& .${tooltipClasses.tooltip}`]: {
  backgroundColor: '#8ebf93',
  color: '#ffffff',
  minWidth: 300,
  maxWidth: 300,
  fontSize: theme.typography.pxToRem(14),
  border: '1px solid #083b0d',
},
}));*/

export function renderEmptyRow(days) {
  const row = [];
  for (let i = 1; i <= days; i++) {
    row.push(
      <div
        style={{ flexBasis: parseFloat(100 / days).toFixed(2) + "%" }}
        className="dayRecord"
        key={i}
      >
        <div>&nbsp;</div>
      </div>
    );
  }
  return row;
}



export function renderRowMicrogreens(crop, microgreen, days, monthNow, weekNow, setSelectedCrop) {
  const row = [];
  const grp = [];
  let firstDayWithStage;
  for (let i = 1; i <= days; i++) {
    let stage;
    if (weekNow === null) {
      stage = whichStage(monthNow.set('date', i), crop);
    } else if (monthNow === null) {


      const copy =moment().week(weekNow).set({hour:12,minutes:0});
      stage = whichStage(copy.isoWeekday(i), crop);
    //  console.log(stage)
     // console.log(i,copy.isoWeekday(i).format('YYYY-MM-DD'))


    }
    if (stage !== undefined && stage !== false && grp.length===0) {
      grp.push({ stage: stage, day: i }); firstDayWithStage = i;
    } else if (stage !== undefined && stage !== false && grp.length>0) {
      grp.push({ stage: stage, day: i }); 
    }
  }

  const grpRender = grp.map((x, index) => <div className='dayRecordGrp' style={{ 'flexBasis': parseFloat(100 / grp.length).toFixed(2) + "%" }} key={index}>&nbsp;</div>);
  
  for (let i = 1; i <= days; i++) {
    let stage;
    if (weekNow === null) {
      stage = whichStage(monthNow.set('date', i), crop);
    } else if (monthNow === null) {
      const copy =moment().week(weekNow).set({hour:12,minutes:0});
      stage = whichStage(copy.isoWeekday(i), crop);
    //  console.log(i,copy.isoWeekday(i).format('YYYY-MM-DD'))
    }

    if (firstDayWithStage === i) { //FIRST OCCURENCE OF STAGE !==false 
      row.push(<Tooltip title={cropInfoRender(crop, microgreen)}>
        <div onClick={() => setSelectedCrop(crop.id)} key={i} className='cropGrp row' 
         style={{ backgroundImage: `linear-gradient(to right,white, 30%,${microgreen.color})`, 'flexBasis': parseFloat(100 / days * grp.length).toFixed(2) + "%" }}>{grpRender}</div>
        </Tooltip>);
    } else if (firstDayWithStage !== i && stage !== undefined && stage !== false) {
      continue;
    } else {
      row.push(
        <div style={{ flexBasis: parseFloat(100 / days).toFixed(2) + "%" }} className="dayRecord" key={i}>
          <div>&nbsp;</div>
        </div>
      );
    }
  }
  return row;
}

export function renderByMicrogreens(crops, microgreens, days, monthNow, weekNow, checkedItems, setSelectedCrop) {
 // console.log(crops,microgreens,weekNow.week());
  const groupedRows = [];
  for (const microgreen of microgreens) {
    const cropsGrouped = crops.filter((x) => x.microgreen_id === microgreen.id);
    if (cropsGrouped.length > 0) {
      const rows = [];
      for (const crop of cropsGrouped) {
       // console.log(weekNow)
        const row = renderRowMicrogreens(crop, microgreen, days, monthNow, weekNow, setSelectedCrop);
        rows.push(<div className='row' key={crop.id}>{row}</div>);
      }
      const isChecked = checkedItems.get(microgreen.name_pl);
      groupedRows.push(<fieldset className={isChecked ? '' : 'hidden'} key={microgreen.id}><legend>{microgreen.name_pl}</legend>{rows}</fieldset>);
    } else {
      groupedRows.push(<fieldset className='' key={microgreen.id}><legend>{microgreen.name_pl}</legend><div className='row'>{renderEmptyRow(days)}</div></fieldset>);
    }
  }
  return groupedRows;
}