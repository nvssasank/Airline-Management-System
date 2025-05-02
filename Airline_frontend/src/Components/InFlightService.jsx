import React, { useState, useEffect } from 'react';

const InFlightServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    flight: '',
    meal_service: '',
    entertainment_options: '',
    special_services: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(10);

  // Fetch services and flights from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, flightsRes] = await Promise.all([
          fetch('http://localhost:8000/api/in-flight-services/'),
          fetch('http://localhost:8000/api/flights/')
        ]);

        if (!servicesRes.ok || !flightsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const servicesData = await servicesRes.json();
        const flightsData = await flightsRes.json();

        console.log('Services API Response:', servicesData);
        console.log('Flights API Response:', flightsData);

        setServices(servicesData);
        setFilteredServices(servicesData);
        setFlights(flightsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter services based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredServices(services);
    } else {
      const results = services.filter(service =>
        (service.flight?.flight_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.meal_service || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.entertainment_options || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.special_services || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredServices(results);
    }
    setCurrentPage(1);
  }, [searchTerm, services]);

  // Get current services for pagination
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

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
      flight: '',
      meal_service: '',
      entertainment_options: '',
      special_services: ''
    });
    setShowAddModal(true);
  };

  const handleEditClick = (service) => {
    setCurrentService(service);
    setFormData({
      flight: service.flight?.flight_id || '',
      meal_service: service.meal_service || '',
      entertainment_options: service.entertainment_options || '',
      special_services: service.special_services || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (service) => {
    setCurrentService(service);
    setShowDeleteModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    const flightId = parseInt(formData.flight);

    if (isNaN(flightId) || !formData.meal_service) {
      alert('Please provide a valid flight and meal service.');
      setLoading(false);
      return;
    }

    const payload = {
      flight_id: flightId,
      meal_service: formData.meal_service,
      entertainment_options: formData.entertainment_options || null,
      special_services: formData.special_services || null
    };

    console.log('Add Service Payload:', payload);

    try {
      const response = await fetch('http://localhost:8000/api/in-flight-services/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', errorData);
        throw new Error('Failed to add service');
      }

      const newService = await response.json();
      setServices([...services, newService]);
      setFilteredServices([...services, newService]);
      setShowAddModal(false);
      setLoading(false);
      alert('Service added successfully!');
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Failed to add service: ' + JSON.stringify(error, null, 2));
      setLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const flightId = parseInt(formData.flight);

    if (isNaN(flightId) || !formData.meal_service) {
      alert('Please provide a valid flight and meal service.');
      setLoading(false);
      return;
    }

    const payload = {
      flight_id: flightId,
      meal_service: formData.meal_service,
      entertainment_options: formData.entertainment_options || null,
      special_services: formData.special_services || null
    };

    console.log('Edit Service Payload:', payload);

    try {
      const response = await fetch(`http://localhost:8000/api/in-flight-services/${currentService.service_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', errorData);
        throw new Error('Failed to update service');
      }

      const updatedService = await response.json();
      setServices(services.map(service =>
        service.service_id === updatedService.service_id ? updatedService : service
      ));
      setFilteredServices(services.map(service =>
        service.service_id === updatedService.service_id ? updatedService : service
      ));
      setShowEditModal(false);
      setLoading(false);
      alert('Service updated successfully!');
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update service: ' + JSON.stringify(error, null, 2));
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/in-flight-services/${currentService.service_id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', errorData);
        throw new Error('Failed to delete service');
      }

      setServices(services.filter(service => service.service_id !== currentService.service_id));
      setFilteredServices(filteredServices.filter(service => service.service_id !== currentService.service_id));
      setShowDeleteModal(false);
      setLoading(false);
      alert('Service deleted successfully!');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service: ' + JSON.stringify(error, null, 2));
      setLoading(false);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && services.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">In-Flight Services Management</h1>

      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <span className="absolute left-3 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search services by flight, meal service, or options..."
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
          <span>Add Service</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Flight</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Meal Service</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Entertainment Options</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Special Services</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentServices.length > 0 ? (
              currentServices.map((service) => (
                <tr key={service.service_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{service.flight?.flight_number || 'N/A'}</td>
                  <td className="py-3 px-4">{service.meal_service || 'N/A'}</td>
                  <td className="py-3 px-4">
                    {service.entertainment_options ? service.entertainment_options.substring(0, 50) + (service.entertainment_options.length > 50 ? '...' : '') : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {service.special_services ? service.special_services.substring(0, 50) + (service.special_services.length > 50 ? '...' : '') : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(service)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteClick(service)}
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
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  No services found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredServices.length > servicesPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstService + 1} to {Math.min(indexOfLastService, filteredServices.length)} of {filteredServices.length} services
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

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New In-Flight Service</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Flight</label>
                  <select
                    name="flight"
                    value={formData.flight}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Flight</option>
                    {flights.map(flight => (
                      <option key={flight.flight_id} value={flight.flight_id}>
                        {flight.flight_number} ({flight.schedule?.route?.origin_airport?.airport_code} → {flight.schedule?.route?.destination_airport?.airport_code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Meal Service</label>
                  <input
                    type="text"
                    name="meal_service"
                    value={formData.meal_service}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-1">Entertainment Options</label>
                  <textarea
                    name="entertainment_options"
                    value={formData.entertainment_options}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  ></textarea>
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-1">Special Services</label>
                  <textarea
                    name="special_services"
                    value={formData.special_services}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  ></textarea>
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
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit In-Flight Service</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Flight</label>
                  <select
                    name="flight"
                    value={formData.flight}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Flight</option>
                    {flights.map(flight => (
                      <option key={flight.flight_id} value={flight.flight_id}>
                        {flight.flight_number} ({flight.schedule?.route?.origin_airport?.airport_code} → {flight.schedule?.route?.destination_airport?.airport_code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Meal Service</label>
                  <input
                    type="text"
                    name="meal_service"
                    value={formData.meal_service}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-1">Entertainment Options</label>
                  <textarea
                    name="entertainment_options"
                    value={formData.entertainment_options}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  ></textarea>
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-1">Special Services</label>
                  <textarea
                    name="special_services"
                    value={formData.special_services}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  ></textarea>
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
              Are you sure you want to delete the in-flight service{' '}
              <span className="font-semibold">{currentService?.meal_service || 'N/A'}</span> for flight{' '}
              <span className="font-semibold">{currentService?.flight?.flight_number || 'N/A'}</span>? This action cannot be undone.
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

export default InFlightServicesManagement;
