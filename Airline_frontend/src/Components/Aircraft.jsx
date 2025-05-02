import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const AircraftManagement = () => {
  const [aircraft, setAircraft] = useState([]);
  const [filteredAircraft, setFilteredAircraft] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAircraft, setCurrentAircraft] = useState(null);
  const [airlines, setAirlines] = useState([]);
  const [formData, setFormData] = useState({
    airline: '',
    registration_number: '',
    model: '',
    manufacturer: '',
    status: '',
    manufacture_date: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [aircraftPerPage] = useState(10);
  
  // Fetch aircraft and airlines from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch aircraft
        const aircraftResponse = await fetch('http://localhost:8000/api/aircraft/');
        if (!aircraftResponse.ok) {
          throw new Error('Failed to fetch aircraft');
        }
        const aircraftData = await aircraftResponse.json();
        
        // Fetch airlines for the dropdown
        const airlinesResponse = await fetch('http://localhost:8000/api/airlines/');
        if (!airlinesResponse.ok) {
          throw new Error('Failed to fetch airlines');
        }
        const airlinesData = await airlinesResponse.json();
        
        setAircraft(aircraftData);
        setFilteredAircraft(aircraftData);
        setAirlines(airlinesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter aircraft based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAircraft(aircraft);
    } else {
      const results = aircraft.filter(plane => 
        plane.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plane.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plane.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plane.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plane.airline.airline_name && plane.airline.airline_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plane.airline.airline_code && plane.airline.airline_code.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredAircraft(results);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, aircraft]);
  
  // Get current aircraft for pagination
  const indexOfLastAircraft = currentPage * aircraftPerPage;
  const indexOfFirstAircraft = indexOfLastAircraft - aircraftPerPage;
  const currentAircraftList = filteredAircraft.slice(indexOfFirstAircraft, indexOfLastAircraft);
  const totalPages = Math.ceil(filteredAircraft.length / aircraftPerPage);
  
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
      airline: airlines.length > 0 ? airlines[0].airline_id : '',
      registration_number: '',
      model: '',
      manufacturer: '',
      status: 'Active',
      manufacture_date: ''
    });
    setShowAddModal(true);
  };
  
  const handleEditClick = (plane) => {
    setCurrentAircraft(plane);
    setFormData({
      airline: plane.airline.airline_id,
      registration_number: plane.registration_number,
      model: plane.model,
      manufacturer: plane.manufacturer,
      status: plane.status,
      manufacture_date: plane.manufacture_date || ''
    });
    setShowEditModal(true);
  };
  
  const handleDeleteClick = (plane) => {
    setCurrentAircraft(plane);
    setShowDeleteModal(true);
  };
  
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/aircraft/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add aircraft');
      }
      
      // Fetch the updated aircraft list
      const aircraftResponse = await fetch('http://localhost:8000/api/aircraft/');
      const updatedAircraft = await aircraftResponse.json();
      setAircraft(updatedAircraft);
      
      setShowAddModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding aircraft:', error);
      setLoading(false);
    }
  };
  
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/aircraft/${currentAircraft.aircraft_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update aircraft');
      }
      
      // Fetch the updated aircraft list
      const aircraftResponse = await fetch('http://localhost:8000/api/aircraft/');
      const updatedAircraft = await aircraftResponse.json();
      setAircraft(updatedAircraft);
      
      setShowEditModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating aircraft:', error);
      setLoading(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/aircraft/${currentAircraft.aircraft_id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete aircraft');
      }
      
      setAircraft(aircraft.filter(plane => plane.aircraft_id !== currentAircraft.aircraft_id));
      setShowDeleteModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting aircraft:', error);
      setLoading(false);
    }
  };
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };
  
  if (loading && aircraft.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Aircraft Management</h1>
      
      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <Search className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search aircraft by registration, model, manufacturer or airline..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          onClick={handleAddClick}
        >
          <PlusCircle size={20} />
          <span>Add Aircraft</span>
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Registration</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Airline</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Model</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Manufacturer</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Status</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Manufacture Date</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentAircraftList.length > 0 ? (
              currentAircraftList.map((plane) => (
                <tr key={plane.aircraft_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{plane.registration_number}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {plane.airline.logo_url && (
                        <img 
                          src={plane.airline.logo_url} 
                          alt={plane.airline.airline_name}
                          className="w-6 h-6 mr-2"
                          onError={(e) => {e.target.style.display = 'none'}}
                        />
                      )}
                      <span>{plane.airline.airline_code} - {plane.airline.airline_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{plane.model}</td>
                  <td className="py-3 px-4">{plane.manufacturer}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      plane.status === 'Active' ? 'bg-green-100 text-green-800' :
                      plane.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      plane.status === 'Retired' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {plane.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{formatDate(plane.manufacture_date)}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(plane)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(plane)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  No aircraft found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredAircraft.length > aircraftPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstAircraft + 1} to {Math.min(indexOfLastAircraft, filteredAircraft.length)} of {filteredAircraft.length} aircraft
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`flex items-center px-3 py-1 rounded border ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft size={16} />
              <span className="ml-1">Prev</span>
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(num => (
                  num === 1 || 
                  num === totalPages || 
                  (num >= currentPage - 1 && num <= currentPage + 1)
                ))
                .map((number, idx, array) => {
                  // Add ellipsis
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
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* Add Aircraft Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Aircraft</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Airline</label>
                  <select
                    name="airline"
                    value={formData.airline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {airlines.map(airline => (
                      <option key={airline.airline_id} value={airline.airline_id}>
                        {airline.airline_code} - {airline.airline_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Registration Number</label>
                  <input
                    type="text"
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Retired">Retired</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Manufacture Date</label>
                  <input
                    type="date"
                    name="manufacture_date"
                    value={formData.manufacture_date}
                    onChange={handleInputChange}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Aircraft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Aircraft Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Aircraft</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Airline</label>
                  <select
                    name="airline"
                    value={formData.airline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {airlines.map(airline => (
                      <option key={airline.airline_id} value={airline.airline_id}>
                        {airline.airline_code} - {airline.airline_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Registration Number</label>
                  <input
                    type="text"
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Retired">Retired</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Manufacture Date</label>
                  <input
                    type="date"
                    name="manufacture_date"
                    value={formData.manufacture_date}
                    onChange={handleInputChange}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
              Are you sure you want to delete the aircraft <span className="font-semibold">{currentAircraft?.registration_number}</span> ({currentAircraft?.model})? This action cannot be undone.
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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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

export default AircraftManagement;