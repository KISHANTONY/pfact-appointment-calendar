// File: pages/CalendarPage.jsx
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendar.css';
import { patients, doctors } from '../data/lists';

const formatDate = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // Always local date
};

const generateDateRange = (start, count) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    const next = new Date(start);
    next.setDate(start.getDate() + i);
    result.push(next);
  }
  return result;
};

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({ patient: '', doctor: '', time: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [visibleDates, setVisibleDates] = useState(generateDateRange(new Date(), 7));
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem('appointments', JSON.stringify(appointments));
    }
  }, [appointments, hasLoaded]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDelete = (indexToDelete) => {
    const updated = appointments.filter((_, idx) => idx !== indexToDelete);
    setAppointments(updated);
  };

  const handleSubmit = (e, selectedDate) => {
    e.preventDefault();
    const newAppointment = {
      date: formatDate(selectedDate || date),
      ...formData,
    };
    setAppointments([...appointments, newAppointment]);
    setFormData({ patient: '', doctor: '', time: '' });
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
      {isMobile ? (
        <div className="mobile-scroll-view">
          {visibleDates.map((day, idx) => {
            const dateStr = formatDate(day);
            const dayAppointments = appointments
              .map((appt, index) => ({ ...appt, index }))
              .filter((appt) => appt.date === dateStr);

            return (
              <div key={idx} className="mobile-day">
                <h3>{day.toDateString()}</h3>

                {dayAppointments.length > 0 ? (
                  <ul className="appt-list">
                    {dayAppointments.map((appt) => (
                      <li key={appt.index} className="appt-item">
                        🧑 {appt.patient} with {appt.doctor} @ {appt.time}
                        <button
                          onClick={() => handleDelete(appt.index)}
                          className="delete-btn"
                        >
                          ❌
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No appointments</p>
                )}

                <form onSubmit={(e) => handleSubmit(e, day)}>
                  <select
                    value={formData.patient}
                    onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                    required
                  >
                    <option value="">Select patient</option>
                    {patients.map((p, i) => (
                      <option key={i} value={p}>{p}</option>
                    ))}
                  </select>

                  <select
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    required
                  >
                    <option value="">Select doctor</option>
                    {doctors.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>

                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />

                  <button type="submit">Save</button>
                </form>
              </div>
            );
          })}
          <button onClick={() => {
            const lastDate = visibleDates[visibleDates.length - 1];
            const more = generateDateRange(new Date(lastDate), 7);
            more.shift();
            setVisibleDates([...visibleDates, ...more]);
          }}>Load More Days</button>
        </div>
      ) : (
        <>
          <Calendar
            onClickDay={(selectedDate) => {
              setDate(selectedDate);
              setShowForm(true);
            }}
            value={date}
            tileContent={({ date }) => renderAppointments(date)}
          />

          {showForm && (
            <div className="modal">
              <div className="modal-content">
                <h3>Book Appointment for {date.toDateString()}</h3>
                <form onSubmit={(e) => handleSubmit(e)}>
                  <label htmlFor="patient-select">Patient:</label>
                  <select
                    id="patient-select"
                    value={formData.patient}
                    onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                    required
                  >
                    <option value="">Select patient</option>
                    {patients.map((p, i) => (
                      <option key={i} value={p}>{p}</option>
                    ))}
                  </select>

                  <label htmlFor="doctor-select">Doctor:</label>
                  <select
                    id="doctor-select"
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    required
                  >
                    <option value="">Select doctor</option>
                    {doctors.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>

                  <label htmlFor="time-input">Time:</label>
                  <input
                    id="time-input"
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
        </>
      )}
    </div>
  );
};

export default CalendarPage;
