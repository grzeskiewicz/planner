import moment from 'moment';
import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import React from 'react';

export function whichStage(day, crop) {
  const start = moment(crop.start);
  const blackoutStart = moment(crop.blackoutStart);
  const lightExposureStart = moment(crop.lightExposureStart);
  const harvest = moment(crop.harvest);
  let stage = false;
  //is given day on one of the stages:
  if (day.isSame(start, 'day')) stage = "S";
  if (day.isBetween(start.endOf('day'), blackoutStart.startOf('day'))) stage = "WG";
  if (day.isBetween(blackoutStart.startOf('day'), lightExposureStart.startOf('day'))) stage = "BL";
  if (day.isBetween(lightExposureStart.startOf('day'), harvest.startOf('day'))) stage = "LE"
  if (day.isSame(harvest, 'day')) stage = "H";
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
  if (day.isBetween(lightExposureStart.startOf('day'), harvest.startOf('day'))) stage = "LE"
  if (day.isSame(harvest, 'day')) stage = "H";
  return stage;
}


function cropInfoRender(cropInfo, microgreen) {
  return <div className='cropInfo'>
    <p>KONTRAHENT INFO</p>
    <p>ID:{cropInfo.id}</p>
    <p>{microgreen.name_pl}</p>
    <p>S:  {moment(cropInfo.start).format('DD.MM hh:mm')} ({moment(cropInfo.start).format('dddd').substring(0, 3).toUpperCase()})</p>
    <p>B:  {moment(cropInfo.blackoutStart).format('DD.MM hh:mm')} ({moment(cropInfo.blackoutStart).format('dddd').substring(0, 3).toUpperCase()})</p>
    <p>L:  {moment(cropInfo.lightExposureStart).format('DD.MM hh:mm')} ({moment(cropInfo.lightExposureStart).format('dddd').substring(0, 3).toUpperCase()})</p>
    <p>H:  {moment(cropInfo.harvest).format('DD.MM hh:mm')} ({moment(cropInfo.harvest).format('dddd').substring(0, 3).toUpperCase()})</p>
    <p className='notes'>{cropInfo.notes}</p>
  </div>;
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
    row.push(<div style={{ 'flexBasis': parseFloat(100 / days).toFixed(2) + "%" }} className='dayRecord' key={i}><div>&nbsp;</div></div>);
  }
  return row;
}


export function renderRowShelves(crops, microgreens, days, monthNow, weekNow, checkedItems, setSelectedCrop) { //crops shown on one shelf

  const row = [];
  const cropGroups = [];

  const sortedByDateCrops = crops.sort((a, b) => Date(a.harvest) - Date(b.harvest) > 0);//neeeded?
  for (const crop of sortedByDateCrops) {
    const grp = [];
    for (let i = 1; i <= days; i++) {
      let stage;
      if (weekNow === null) {
        stage = whichStageShelves(monthNow.set('date', i), crop);
      } else if (monthNow === null) {
        const copy = moment(weekNow);
        stage = whichStageShelves(copy.weekday(i), crop);
      }
      if (stage !== undefined && stage !== false) grp.push({ stage: stage, day: i });
    }
    cropGroups.push({ cropDays: grp, crop: crop });
  }
  let cropNow;
  for (let i = 1; i <= days; i++) {
    for (const crpDays of cropGroups) {
      if (crpDays.cropDays.length && crpDays.cropDays[0].day === i) cropNow = crpDays//if checked day is the same as first day of crop
    }

    if (cropNow) {
      const cropNowCopyDays = JSON.parse(JSON.stringify(cropNow.cropDays));
      cropNowCopyDays.shift();
      const check = cropNowCopyDays.find((x) => x.day === i);
      if (cropNow.cropDays[0].day === i) {
        const microgreen = microgreens.find((x) => x.id === cropNow.crop.microgreen_id);
        const grpRender = cropNow.cropDays.map((x, index) => <div className='dayRecordGrp' style={{ 'flexBasis': 100 / cropNow.cropDays.length + "%" }} key={index}><div></div></div>);
        const cropInfo = cropNow.crop;




        const isChecked = checkedItems.get(microgreen.name_pl);

        row.push(<Tooltip title={cropInfoRender(cropInfo, microgreen)}><div onClick={() => setSelectedCrop(cropInfo.id)} key={i} 
        className={isChecked ? 'cropGrp row' : 'cropGrp row hidden'} style={{ backgroundImage: `linear-gradient(to right,white,30%, ${microgreen.color})`, 'flexBasis': 100 / days * cropNow.cropDays.length + "%" }}>{grpRender}</div></Tooltip>);
      } else if (check) {
        continue;
      } else {
        row.push(<div className='dayRecord' key={i}><div>&nbsp;</div></div>);
      }
    } else {
      row.push(<div className='dayRecord' key={i}><div>&nbsp;</div></div>);
    }
  }
  return row;
}



export function renderByShelves(crops, microgreens, shelves, days, monthNow, weekNow, checkedItems, setSelectedCrop) {
  const rows = [];
  for (const shelf of shelves) {
    const cropsGrouped = crops.filter((x) => x.shelf_id === shelf.id);
    if (cropsGrouped.length > 0) {
      const row = renderRowShelves(cropsGrouped, microgreens, days, monthNow, weekNow, checkedItems, setSelectedCrop);
      rows.push(<fieldset className='row' key={shelf.id}><legend>{shelf.rack_name}{shelf.level}</legend>{row}</fieldset>);
    } else if (cropsGrouped.length === 0) {
      const row = renderEmptyRow(days);
      rows.push(<fieldset className='row' key={shelf.id}><legend>{shelf.rack_name}{shelf.level}</legend>{row}</fieldset>);
    }
  }
  return rows;
}


export function renderByFND(crops, microgreens, shelves, days, monthNow, weekNow, checkedItems, setSelectedCrop) {
  const rows = [];
  for (const shelf of shelves) {
    const cropsGrouped = crops.filter((x) => x.shelf_id === shelf.id);
    if (cropsGrouped.length > 0) {
      const row = renderRowShelves(cropsGrouped, microgreens, days, monthNow, weekNow, checkedItems, setSelectedCrop);
      rows.push(<fieldset className='row' key={shelf.id}><legend>{shelf.rack_name}{shelf.level}</legend>{row}</fieldset>);
    } else if (cropsGrouped.length === 0) {
      const row = renderEmptyRow(days);
      rows.push(<fieldset className='row' key={shelf.id}><legend>{shelf.rack_name}{shelf.level}</legend>{row}</fieldset>);
    }
  }
  return rows;
}



export function renderRowMicrogreens(crop, microgreen, shelves, days, monthNow, weekNow, setSelectedCrop) {
  const row = [];
  const grp = [];
  let firstDayWithStage;
  for (let i = 1; i <= days; i++) {
    let stage;
    if (weekNow === null) {
      stage = whichStage(monthNow.set('date', i), crop);
    } else if (monthNow === null) {
      const copy = moment(weekNow);
      stage = whichStage(copy.weekday(i), crop);
    }
    if (stage !== undefined && stage !== false) grp.push({ stage: stage, day: i });
    if (grp.length === 1) firstDayWithStage = i;
  }
  const grpRender = grp.map((x, index) => <div className='dayRecordGrp' style={{ backgroundImage: x.stage !== false && x.stage !== undefined ? `linear-gradient(to right,white,30%, ${microgreen.color})` : '', 'flexBasis': 100 / grp.length + "%" }} key={index}><div></div></div>);
  for (let i = 1; i <= days; i++) {
    let stage;
    if (weekNow === null) {
      stage = whichStage(monthNow.set('date', i), crop);
    } else if (monthNow === null) {
      const copy = moment(weekNow);
      stage = whichStage(copy.weekday(i), crop);
    }
    if (firstDayWithStage === i) { //FIRST OCCURENCE OF STAGE !==false
      //const shelf = shelves.find((x) => x.id === crop.shelf_id);


      row.push(<Tooltip title={cropInfoRender(crop, microgreen)}><div onClick={() => setSelectedCrop(crop.id)} key={i} className='cropGrp row' style={{ backgroundImage: `linear-gradient(to right,white, 30%,${microgreen.color})`, 'flexBasis': 100 / days * grp.length + "%" }}>{grpRender}</div></Tooltip>);
    } else if (firstDayWithStage !== i && stage !== undefined && stage !== false) {
      continue;
    } else {
    }
  }

  return row;
}

export function renderByMicrogreens(crops, microgreens, shelves, days, monthNow, weekNow, checkedItems, setSelectedCrop) {
  const groupedRows = [];
  for (const microgreen of microgreens) {
    const cropsGrouped = crops.filter((x) => x.microgreen_id === microgreen.id);
    if (cropsGrouped.length > 0) {
      const rows = [];
      for (const crop of cropsGrouped) {
        const row = renderRowMicrogreens(crop, microgreen, shelves, days, monthNow, weekNow, setSelectedCrop);
        rows.push(<div className='row' key={crop.id}>{row}</div>);
      }
      const isChecked = checkedItems.get(microgreen.name_pl);
      groupedRows.push(<fieldset className={isChecked ? 'group' : 'group hidden'} key={microgreen.id}><legend>{microgreen.name_pl}</legend>{rows}</fieldset>);
    } else {
      groupedRows.push(<fieldset className='group' key={microgreen.id}><legend>{microgreen.name_pl}</legend><div className='row'>{renderEmptyRow(days)}</div></fieldset>);
    }
  }
  return groupedRows;
}