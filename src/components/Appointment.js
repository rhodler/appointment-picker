import React, { useState, useEffect } from 'react';
import {
  addDays,
  differenceInMonths,
  startOfMonth,
  addMonths,
  format,
  lastDayOfMonth,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckBox } from './CheckBox';
import { Input } from './Input';
import { ListItem } from './ListItem';
import { Booking } from './Booking';

const Appointment = () => {
  const startDate = new Date();
  const lastDate = addDays(startDate, 90); // Nombre de jour ajouté = 90 jours
  const year = format(startDate, "yyyy");
  const [dateOff, setDateOff] = useState(JSON.parse(localStorage.getItem('dateOff')) || []);
  const [dayOff, setDayOff] = useState(JSON.parse(localStorage.getItem('dayOff')) || []);
  const [data, setData] = useState(JSON.parse(localStorage.getItem('data')) || []);
  const [showMore, setShowMore] = useState(false);
  const [displayHours, setDisplayHours] = useState('');
  const [weekday, setWeekday] = useState(JSON.parse(localStorage.getItem('weekday')) || [
    {id: 1, value: 'lundi', isChecked: false}, 
    {id: 2, value: 'mardi', isChecked: false}, 
    {id: 3, value: 'mercredi', isChecked: false},
    {id: 4, value: 'jeudi', isChecked: false},
    {id: 5, value: 'vendredi', isChecked: false},
    {id: 6, value: 'samedi', isChecked: false},
    {id: 7, value: 'dimanche', isChecked: false}
  ]);

  useEffect(() => {
    if (!localStorage.getItem('weekday')) {
      localStorage.setItem('weekday', JSON.stringify(weekday));
    }
  }, []);

  function getData(value) {
    switch(value) {
      case 'data':
        return setData(JSON.parse(localStorage.getItem(value)));
      case 'dateOff':
        return setDateOff(JSON.parse(localStorage.getItem(value)));
      case 'dayOff':
        return setDayOff(JSON.parse(localStorage.getItem(value)));
      case 'weekday':
        return setWeekday(JSON.parse(localStorage.getItem(value)));
    }
  }

  const generateHours = () =>{
    let hours = [];
    const startHour = 9, endHour = 18, duree = 30;
    for(let i = startHour; i <= endHour; i++){
      hours.push(`${i}:00`,`${i}:${duree}`)
    }

    return hours
  };
  
  const generateDays = () => {
    let days = [];
    for(let i = 0; i <= differenceInMonths(lastDate, startDate); i++){
      let start, end;
      const month = startOfMonth(addMonths(startDate, i));
      start = i === 0 ? Number(format(startDate, "d")) - 1 : 0;
      end = i === differenceInMonths(lastDate, startDate) ? Number(format(lastDate, "d")) : Number(format(lastDayOfMonth(month), "d"));
      for (let j = start; j < end; j++) {
        let id = format(addDays(month, j), "DDD");
        let day = format(addDays(month, j), "dd LLLL Y", {locale: fr});
        let dayOfWeek = format(addDays(month, j), "EEEE", {locale: fr})
        
        if(!off(dayOfWeek, day)){
          days.push({id: id+year, day, dayOfWeek, hours: generateHours()});
        }
      }
    }
    
    for(let i = 0; i < days.length; i++){
      let day = days[i];
      for(let j = 0; j < data.length; j++){
        let item = data[j];
        if(item.id === day.id){
          findById(day, item);
        }
      }
    }
    
    return days.slice(0, 7);
  };
  
  const off = (dayOfWeek, day) => dayOff.indexOf(dayOfWeek) > -1 || dateOff.indexOf(day)  > -1;

  const findById = (day, data) =>{
    for(let i = 0; i < data.hours.length; i++){
      day.hours.splice(day.hours.indexOf(data.hours[i]), 1);
    }
  };
  
  const handleSelect = selected => {
    if (!data.length) {
      localStorage.setItem('data', JSON.stringify([{id: selected.id, hours: [selected.hour], day: selected.day}]));
    } else {        
      for(let i = 0; i < data.length; i++) {
        let test = data.find(item => item.id === selected.id);

        let select = data[i];

        if (select.id === selected.id) {
          select.hours.push(selected.hour);
          localStorage.setItem('data', JSON.stringify(data));
        } else if (!test) {
          localStorage.setItem('data', JSON.stringify([...data, {id: selected.id, hours: [selected.hour], day: selected.day}]));
        }
      }
    }
    getData('data');
  }

  const cancellation = date => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === date.id) data[i].hours.splice(data[i].hours.indexOf(date.hour), 1);
    }
    localStorage.setItem('data', JSON.stringify(data));
    getData('data');
    removeData();
  }

  const removeData = () => {
    for (let i = 0; i < data.length; i++){
      if (data[i].hours.length === 0) {
        data.splice(i, 1);
      }
    }
    localStorage.setItem('data', JSON.stringify(data));
    getData('data');
  }

  const handleDayOff = data => {
    let days = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].isChecked) {
        days.push(data[i].value);
      }
    }
    localStorage.setItem('dayOff', JSON.stringify(days));
    getData('dayOff');
  }

  const handleDateOff = value => {
    localStorage.setItem('dateOff', JSON.stringify([...dateOff, value]));
    getData('dateOff');
  }

  const removeDateOff = value => {
    for (let i = 0; i < dateOff.length; i++) {
      if (dateOff[i] === value) {
        dateOff.splice(i, 1);
      }
    }
    localStorage.setItem('dateOff', JSON.stringify(dateOff));
    getData('dateOff');
  }

  const handleClickCheckbox = e => {
    let data = weekday;
    for(let i = 0; i < data.length; i++){
      if (data[i].value === e.target.value) {
        data[i].isChecked = e.target.checked;
      }
    }
    localStorage.setItem('weekday', JSON.stringify(data));
    getData('weekday');
    handleDayOff(data);
  }

  const handleDisplayHours = id => {
    if (id !== displayHours) {
      setDisplayHours(id);
    } else {
      setDisplayHours('');
    }
  }

  const renderDays = () =>{
    return generateDays()
    .filter(day => day.hours.length)
    .map(day=> (
        
      <div key={day.id} className="day">
        <div className="div_day">
          <div className="dates">
            <div className="day_of_week">{day.dayOfWeek}</div>
            {' '}
            <div className="date">{day.day}</div>
          </div>
          <div onClick={() => handleDisplayHours(day.id)} className="icon-down">
            {displayHours !== day.id ? <i className="fas fa-chevron-down"></i> : <i className="fas fa-chevron-up"></i>}
          </div>
        </div>
        <div className={`hours ${displayHours !== day.id ? 'none' : ''}`}>
          {day.hours.map(hour => <div onClick={() => handleSelect({hour:hour, id: day.id, day: day.day})} className="hour none" key={hour}>{hour}</div>)}
        </div>
      </div>

    ));
  };

  return  (
    <>
      <div className={`days ${showMore ? 'active' : ''}`}>
        {renderDays()}
      </div>

      <div className="btn_show" onClick={() => setShowMore(!showMore)}>{showMore ? 'Voir moins' : 'Voir plus d\'horaires'}</div>

      <div style={{marginTop: '20px'}}>
        <div className="title">Dates et heures réservées</div>
        <div className="bookings">
          {!data.length ? 'Aucune réservation' : <Booking data={data} cancellation={cancellation}/>}
        </div>
      </div>

      <div style={{marginTop: '20px'}}>
        <div className="title">Sélectionner un ou plusieur jour de la semaine en congé</div>
        {weekday.map(({id, value, isChecked}) => <CheckBox handleClickCheckbox={handleClickCheckbox} key={id} value={value} isChecked={isChecked}/>)}
      </div>

      <div style={{marginTop: '20px'}}>
        <div className="title">Ajouter une ou plusieurs date de congé</div>
        <Input data={generateDays()} handleDateOff={handleDateOff}/>
        <ListItem data={dateOff} remove={removeDateOff}/>
      </div>
    </>
  );
}

export default Appointment
