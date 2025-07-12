import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendar.css';
import { patients, doctors } from '../data/lists';

const formatDate = (dateObj) => dateObj.toISOString().split('T')[0];

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({ patient: '', doctor: '', time: '' });
  const [showForm, setShowForm] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false); // ✅ NEW

  const handleDelete = (indexToDelete) => {
    const dateStr = formatDate(date);
    const updated = appointments.filter(
      (appt, idx) => !(appt.date === dateStr && idx === indexToDelete)
    );
    setAppointments(updated);
  };
  
  // Load from localStorage once
  useEffect(() => {
    const stored = localStorage.getItem('appointments');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAppointments(parsed);
        }
      } catch (err) {
        console.error("Failed to parse localStorage:", err);
      }
    }
    setHasLoaded(true); // ✅ Finished loading
  }, []);

  // Save to localStorage after initial load
  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem('appointments', JSON.stringify(appointments));
    }
  }, [appointments, hasLoaded]);

  const handleDayClick = (selectedDate) => {
    setDate(selectedDate);
    setShowForm(true);
    setFormData({ patient: '', doctor: '', time: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAppointment = {
      date: formatDate(date),
      ...formData,
    };
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    setShowForm(false);
  };

  const renderAppointments = (tileDate) => {
    const dayAppointments = appointments.filter(
      (appt) => appt.date === formatDate(tileDate)
    );
    if (dayAppointments.length === 0) return null;
    return (
      <ul className="appt-list">
        {dayAppointments.slice(0, 2).map((appt, idx) => (
          <li key={idx} className="appt-item">
            🧑 {appt.patient.split(' ')[0]} @ {appt.time}
          </li>
        ))}
        {dayAppointments.length > 2 && (
          <li className="appt-item">+{dayAppointments.length - 2} more</li>
        )}
      </ul>
    );
  };

  return (
    <div className="calendar-page">
      <h2>Appointment Calendar</h2>

      <Calendar
        onClickDay={handleDayClick}
        value={date}
        tileContent={({ date }) => renderAppointments(date)}
      />

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Book Appointment for {date.toDateString()}</h3>
            <h4>Appointments on {date.toDateString()}</h4>
<ul className="appt-list">
  {appointments
    .map((appt, idx) => ({ ...appt, index: idx }))
    .filter((appt) => appt.date === formatDate(date))
    .map((appt, idx) => (
      <li key={appt.index} className="appt-item">
        🧑 {appt.patient} with 👨‍⚕️ {appt.doctor} @ {appt.time}
        <button
          onClick={() => handleDelete(appt.index)}
          style={{
            marginLeft: '10px',
            color: 'white',
            backgroundColor: 'red',
            border: 'none',
            borderRadius: '4px',
            padding: '2px 8px',
            cursor: 'pointer',
          }}
        >
          ❌
        </button>
      </li>
    ))}
</ul>

            <form onSubmit={handleSubmit}>
              <label htmlFor="patient-select">Patient:</label>
              <select
                id="patient-select"
                name="patient"
                value={formData.patient}
                onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                required
              >
                <option value="">Select patient</option>
                {patients.map((p, idx) => (
                  <option key={idx} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <label htmlFor="doctor-select">Doctor:</label>
              <select
                id="doctor-select"
                name="doctor"
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                required
              >
                <option value="">Select doctor</option>
                {doctors.map((d, idx) => (
                  <option key={idx} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <label htmlFor="time-input">Time:</label>
              <input
                id="time-input"
                name="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />

              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
