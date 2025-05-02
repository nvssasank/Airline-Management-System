import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const AirportManagement = () => {
  const [airports, setAirports] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAirport, setCurrentAirport] = useState(null);
  const [formData, setFormData] = useState({
    airport_name: '',
    airport_code: '',
    city: '',
    country: '',
    latitude: '',
    longitude: '',
    timezone_offset: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [airportsPerPage] = useState(10);
  
  // Fetch airports from API
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/airports/');
        if (!response.ok) {
          throw new Error('Failed to fetch airports');
        }
        const data = await response.json();
        setAirports(data);
        setFilteredAirports(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching airports:', error);
        setLoading(false);
      }
    };
    
    fetchAirports();
  }, []);
  
  // Filter airports based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAirports(airports);
    } else {
      const results = airports.filter(airport => 
        airport.airport_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.airport_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAirports(results);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, airports]);
  
  // Get current airports for pagination
  const indexOfLastAirport = currentPage * airportsPerPage;
  const indexOfFirstAirport = indexOfLastAirport - airportsPerPage;
  const currentAirports = filteredAirports.slice(indexOfFirstAirport, indexOfLastAirport);
  const totalPages = Math.ceil(filteredAirports.length / airportsPerPage);
  
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
      airport_name: '',
      airport_code: '',
      city: '',
      country: '',
      latitude: '',
      longitude: '',
      timezone_offset: ''
    });
    setShowAddModal(true);
  };
  
  const handleEditClick = (airport) => {
    setCurrentAirport(airport);
    setFormData({
      airport_name: airport.airport_name,
      airport_code: airport.airport_code,
      city: airport.city,
      country: airport.country,
      latitude: airport.latitude,
      longitude: airport.longitude,
      timezone_offset: airport.timezone_offset
    });
    setShowEditModal(true);
  };
  
  const handleDeleteClick = (airport) => {
    setCurrentAirport(airport);
    setShowDeleteModal(true);
  };
  
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/airports/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add airport');
      }
      
      const newAirport = await response.json();
      setAirports([...airports, newAirport]);
      setShowAddModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding airport:', error);
      setLoading(false);
    }
  };
  
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/airports/${currentAirport.airport_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update airport');
      }
      
      const updatedAirport = await response.json();
      setAirports(airports.map(airport => 
        airport.airport_id === updatedAirport.airport_id ? updatedAirport : airport
      ));
      setShowEditModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating airport:', error);
      setLoading(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/airports/${currentAirport.airport_id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete airport');
      }
      
      setAirports(airports.filter(airport => airport.airport_id !== currentAirport.airport_id));
      setShowDeleteModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting airport:', error);
      setLoading(false);
    }
  };
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  if (loading && airports.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Airport Management</h1>
      
      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <Search className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search airports by name, code, city or country..."
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
          <span>Add Airport</span>
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Code</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Name</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">City</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Country</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Coordinates</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Timezone</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentAirports.length > 0 ? (
              currentAirports.map((airport) => (
                <tr key={airport.airport_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{airport.airport_code}</td>
                  <td className="py-3 px-4">{airport.airport_name}</td>
                  <td className="py-3 px-4">{airport.city}</td>
                  <td className="py-3 px-4">{airport.country}</td>
                  <td className="py-3 px-4">{airport.latitude}, {airport.longitude}</td>
                  <td className="py-3 px-4">GMT {airport.timezone_offset > 0 ? `+${airport.timezone_offset}` : airport.timezone_offset}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(airport)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(airport)}
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
                  No airports found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredAirports.length > airportsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstAirport + 1} to {Math.min(indexOfLastAirport, filteredAirports.length)} of {filteredAirports.length} airports
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
      
      {/* Add Airport Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Airport</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Airport Name</label>
                  <input
                    type="text"
                    name="airport_name"
                    value={formData.airport_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Airport Code</label>
                  <input
                    type="text"
                    name="airport_code"
                    value={formData.airport_code}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    required
                    step="0.000001"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    required
                    step="0.000001"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Timezone Offset</label>
                  <input
                    type="number"
                    name="timezone_offset"
                    value={formData.timezone_offset}
                    onChange={handleInputChange}
                    required
                    min="-12"
                    max="14"
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
                  Add Airport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Airport Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Airport</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Airport Name</label>
                  <input
                    type="text"
                    name="airport_name"
                    value={formData.airport_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Airport Code</label>
                  <input
                    type="text"
                    name="airport_code"
                    value={formData.airport_code}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    required
                    step="0.000001"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    required
                    step="0.000001"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Timezone Offset</label>
                  <input
                    type="number"
                    name="timezone_offset"
                    value={formData.timezone_offset}
                    onChange={handleInputChange}
                    required
                    min="-12"
                    max="14"
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
              Are you sure you want to delete the airport <span className="font-semibold">{currentAirport?.airport_name}</span> ({currentAirport?.airport_code})? This action cannot be undone.
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

export default AirportManagement;