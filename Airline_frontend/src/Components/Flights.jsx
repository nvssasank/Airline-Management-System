import React, { useState, useEffect } from 'react';

const FlightsManagement = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentFlight, setCurrentFlight] = useState(null);
  const [formData, setFormData] = useState({
    schedule: '',
    aircraft: '',
    flight_date: '',
    actual_departure: '',
    actual_arrival: '',
    flight_status: '',
    gate_departure: '',
    gate_arrival: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [flightsPerPage] = useState(10);

  // Fetch flights, schedules, and aircraft
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [flightsRes, schedulesRes, aircraftsRes] = await Promise.all([
          fetch('http://localhost:8000/api/flights/'),
          fetch('http://localhost:8000/api/flight-schedules/'),
          fetch('http://localhost:8000/api/aircraft/')
        ]);

        if (!flightsRes.ok || !schedulesRes.ok || !aircraftsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const flightsData = await flightsRes.json();
        const schedulesData = await schedulesRes.json();
        const aircraftsData = await aircraftsRes.json();

        setFlights(flightsData);
        setFilteredFlights(flightsData);
        setSchedules(schedulesData);
        setAircrafts(aircraftsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter flights based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFlights(flights);
    } else {
      const results = flights.filter(flight =>
        (flight.flight_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (flight.aircraft_registration || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (flight.flight_status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (flight.gate_departure || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (flight.gate_arrival || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFlights(results);
    }
    setCurrentPage(1);
  }, [searchTerm, flights]);

  // Pagination
  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = filteredFlights.slice(indexOfFirstFlight, indexOfLastFlight);
  const totalPages = Math.ceil(filteredFlights.length / flightsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddClick = () => {
    setFormData({
      schedule: '',
      aircraft: '',
      flight_date: '',
      actual_departure: '',
      actual_arrival: '',
      flight_status: 'Scheduled',
      gate_departure: '',
      gate_arrival: ''
    });
    setShowAddModal(true);
  };

  const handleEditClick = (flight) => {
    setCurrentFlight(flight);
    setFormData({
      schedule: flight.schedule.schedule_id,
      aircraft: flight.aircraft.aircraft_id,
      flight_date: flight.flight_date || '',
      actual_departure: flight.actual_departure ? flight.actual_departure.slice(0, 16) : '',
      actual_arrival: flight.actual_arrival ? flight.actual_arrival.slice(0, 16) : '',
      flight_status: flight.flight_status || 'Scheduled',
      gate_departure: flight.gate_departure || '',
      gate_arrival: flight.gate_arrival || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (flight) => {
    setCurrentFlight(flight);
    setShowDeleteModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    const scheduleId = parseInt(formData.schedule);
    const aircraftId = parseInt(formData.aircraft);

    if (isNaN(scheduleId) || isNaN(aircraftId) || !formData.flight_date) {
      alert('Please select a valid schedule, aircraft, and flight date.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        schedule: scheduleId,
        aircraft: aircraftId,
        flight_date: formData.flight_date,
        actual_departure: formData.actual_departure ? `${formData.actual_departure}:00Z` : null,
        actual_arrival: formData.actual_arrival ? `${formData.actual_arrival}:00Z` : null,
        gate_departure: formData.gate_departure || null,
        gate_arrival: formData.gate_arrival || null,
        flight_status: formData.flight_status
      };
      console.log('Request payload:', payload);

      const response = await fetch('http://localhost:8000/api/flights/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('Failed to add flight');
      }

      const newFlight = await response.json();
      setFlights([...flights, newFlight]);
      setFilteredFlights([...flights, newFlight]);
      setShowAddModal(false);
      alert('Flight added successfully!');
    } catch (error) {
      console.error('Error adding flight:', error);
      alert('Failed to add flight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const scheduleId = parseInt(formData.schedule);
    const aircraftId = parseInt(formData.aircraft);

    if (isNaN(scheduleId) || isNaN(aircraftId) || !formData.flight_date) {
      alert('Please select a valid schedule, aircraft, and flight date.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        schedule: scheduleId,
        aircraft: aircraftId,
        flight_date: formData.flight_date,
        actual_departure: formData.actual_departure ? `${formData.actual_departure}:00Z` : null,
        actual_arrival: formData.actual_arrival ? `${formData.actual_arrival}:00Z` : null,
        gate_departure: formData.gate_departure || null,
        gate_arrival: formData.gate_arrival || null,
        flight_status: formData.flight_status
      };
      console.log('Request payload:', payload);

      const response = await fetch(`http://localhost:8000/api/flights/${currentFlight.flight_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('Failed to update flight');
      }

      const updatedFlight = await response.json();
      setFlights(flights.map(flight =>
        flight.flight_id === updatedFlight.flight_id ? updatedFlight : flight
      ));
      setFilteredFlights(flights.map(flight =>
        flight.flight_id === updatedFlight.flight_id ? updatedFlight : flight
      ));
      setShowEditModal(false);
      alert('Flight updated successfully!');
    } catch (error) {
      console.error('Error updating flight:', error);
      alert('Failed to update flight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/flights/${currentFlight.flight_id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('Failed to delete flight');
      }

      setFlights(flights.filter(flight => flight.flight_id !== currentFlight.flight_id));
      setFilteredFlights(filteredFlights.filter(flight => flight.flight_id !== currentFlight.flight_id));
      setShowDeleteModal(false);
      alert('Flight deleted successfully!');
    } catch (error) {
      console.error('Error deleting flight:', error);
      alert('Failed to delete flight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && flights.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Flights Management</h1>

      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <span className="absolute left-3 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by flight number, aircraft registration, status, or gate..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          onClick={handleAddClick}
        >
          <span>+</span>
          <span>Add Flight</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Flight Number</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Route</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Aircraft</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Flight Date</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Actual Departure</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Actual Arrival</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Status</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Gate Departure</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Gate Arrival</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentFlights.length > 0 ? (
              currentFlights.map((flight) => (
                <tr key={flight.flight_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{flight.flight_number || 'N/A'}</td>
                  <td className="py-3 px-4">
                    {flight.schedule?.route?.origin_airport?.airport_code || 'N/A'} → 
                    {flight.schedule?.route?.destination_airport?.airport_code || 'N/A'}
                  </td>
                  <td className="py-3 px-4">{flight.aircraft_registration || 'N/A'}</td>
                  <td className="py-3 px-4">{flight.flight_date || 'N/A'}</td>
                  <td className="py-3 px-4">{flight.actual_departure ? new Date(flight.actual_departure).toLocaleString() : 'N/A'}</td>
                  <td className="py-3 px-4">{flight.actual_arrival ? new Date(flight.actual_arrival).toLocaleString() : 'N/A'}</td>
                  <td className="py-3 px-4">{flight.flight_status || 'Unknown'}</td>
                  <td className="py-3 px-4">{flight.gate_departure || 'N/A'}</td>
                  <td className="py-3 px-4">{flight.gate_arrival || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(flight)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteClick(flight)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-8 text-center text-gray-500">
                  No flights found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredFlights.length > flightsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstFlight + 1} to {Math.min(indexOfLastFlight, filteredFlights.length)} of {filteredFlights.length} flights
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`flex items-center px-3 py-1 rounded border ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-1">←</span>
              <span>Prev</span>
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(num => (
                  num === 1 ||
                  num === totalPages ||
                  (num >= currentPage - 1 && num <= currentPage + 1)
                ))
                .map((number, idx, array) => {
                  if (idx > 0 && array[idx - 1] !== number - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${number}`}>
                        <span className="px-3 py-1 text-gray-400">...</span>
                        <button
                          onClick={() => paginate(number)}
                          className={`px-3 py-1 rounded border ${
                            currentPage === number ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {number}
                        </button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === number ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  );
                })}
            </div>

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`flex items-center px-3 py-1 rounded border ${
                currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-1">Next</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Flight Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Flight</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Schedule</label>
                  <select
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Schedule</option>
                    {schedules.map(schedule => (
                      <option key={schedule.schedule_id} value={schedule.schedule_id}>
                        {schedule.flight_number} ({schedule.route?.origin_airport?.airport_code} → {schedule.route?.destination_airport?.airport_code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Aircraft</label>
                  <select
                    name="aircraft"
                    value={formData.aircraft}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Aircraft</option>
                    {aircrafts.map(aircraft => (
                      <option key={aircraft.aircraft_id} value={aircraft.aircraft_id}>
                        {aircraft.registration_number} ({aircraft.model})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Flight Date</label>
                  <input
                    type="date"
                    name="flight_date"
                    value={formData.flight_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Actual Departure (optional)</label>
                  <input
                    type="datetime-local"
                    name="actual_departure"
                    value={formData.actual_departure}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Actual Arrival (optional)</label>
                  <input
                    type="datetime-local"
                    name="actual_arrival"
                    value={formData.actual_arrival}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Flight Status</label>
                  <select
                    name="flight_status"
                    value={formData.flight_status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Departed">Departed</option>
                    <option value="Arrived">Arrived</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Gate Departure (optional)</label>
                  <input
                    type="text"
                    name="gate_departure"
                    value={formData.gate_departure}
                    onChange={handleInputChange}
                    maxLength={10}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Gate Arrival (optional)</label>
                  <input
                    type="text"
                    name="gate_arrival"
                    value={formData.gate_arrival}
                    onChange={handleInputChange}
                    maxLength={10}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Add Flight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Flight Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Flight</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Schedule</label>
                  <select
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Schedule</option>
                    {schedules.map(schedule => (
                      <option key={schedule.schedule_id} value={schedule.schedule_id}>
                        {schedule.flight_number} ({schedule.route?.origin_airport?.airport_code} → {schedule.route?.destination_airport?.airport_code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Aircraft</label>
                  <select
                    name="aircraft"
                    value={formData.aircraft}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Aircraft</option>
                    {aircrafts.map(aircraft => (
                      <option key={aircraft.aircraft_id} value={aircraft.aircraft_id}>
                        {aircraft.registration_number} ({aircraft.model})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Flight Date</label>
                  <input
                    type="date"
                    name="flight_date"
                    value={formData.flight_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Actual Departure (optional)</label>
                  <input
                    type="datetime-local"
                    name="actual_departure"
                    value={formData.actual_departure}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Actual Arrival (optional)</label>
                  <input
                    type="datetime-local"
                    name="actual_arrival"
                    value={formData.actual_arrival}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Flight Status</label>
                  <select
                    name="flight_status"
                    value={formData.flight_status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Departed">Departed</option>
                    <option value="Arrived">Arrived</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Gate Departure (optional)</label>
                  <input
                    type="text"
                    name="gate_departure"
                    value={formData.gate_departure}
                    onChange={handleInputChange}
                    maxLength={10}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Gate Arrival (optional)</label>
                  <input
                    type="text"
                    name="gate_arrival"
                    value={formData.gate_arrival}
                    onChange={handleInputChange}
                    maxLength={10}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete the flight{' '}
              <span className="font-semibold">{currentFlight?.flight_number || 'N/A'}</span> from{' '}
              <span className="font-semibold">{currentFlight?.schedule?.route?.origin_airport?.airport_code || 'N/A'}</span> to{' '}
              <span className="font-semibold">{currentFlight?.schedule?.route?.destination_airport?.airport_code || 'N/A'}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightsManagement;