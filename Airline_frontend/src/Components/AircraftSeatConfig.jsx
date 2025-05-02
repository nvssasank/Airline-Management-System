import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const AircraftSeatConfigManagement = () => {
  const [seatConfigs, setSeatConfigs] = useState([]);
  const [filteredSeatConfigs, setFilteredSeatConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSeatConfig, setCurrentSeatConfig] = useState(null);
  const [formData, setFormData] = useState({
    aircraft: '',
    class_type: '',
    seat_count: '',
    seat_pitch: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [configsPerPage] = useState(10);
  
  // Fetch seat configs from API
  useEffect(() => {
    const fetchSeatConfigs = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/aircraft-seat-configs/');
        if (!response.ok) {
          throw new Error('Failed to fetch seat configurations');
        }
        const data = await response.json();
        setSeatConfigs(data);
        setFilteredSeatConfigs(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching seat configurations:', error);
        setLoading(false);
      }
    };
    
    fetchSeatConfigs();
  }, []);
  
  // Filter seat configs based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSeatConfigs(seatConfigs);
    } else {
      const results = seatConfigs.filter(config => 
        config.class_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        config.aircraft.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        config.aircraft.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSeatConfigs(results);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, seatConfigs]);
  
  // Get current seat configs for pagination
  const indexOfLastConfig = currentPage * configsPerPage;
  const indexOfFirstConfig = indexOfLastConfig - configsPerPage;
  const currentSeatConfigs = filteredSeatConfigs.slice(indexOfFirstConfig, indexOfLastConfig);
  const totalPages = Math.ceil(filteredSeatConfigs.length / configsPerPage);
  
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
      aircraft: '',
      class_type: '',
      seat_count: '',
      seat_pitch: ''
    });
    setShowAddModal(true);
  };
  
  const handleEditClick = (config) => {
    setCurrentSeatConfig(config);
    setFormData({
      aircraft: config.aircraft.aircraft_id,
      class_type: config.class_type,
      seat_count: config.seat_count,
      seat_pitch: config.seat_pitch || ''
    });
    setShowEditModal(true);
  };
  
  const handleDeleteClick = (config) => {
    setCurrentSeatConfig(config);
    setShowDeleteModal(true);
  };
  
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/aircraft-seat-configs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add seat configuration');
      }
      
      const newSeatConfig = await response.json();
      setSeatConfigs([...seatConfigs, newSeatConfig]);
      setShowAddModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding seat configuration:', error);
      setLoading(false);
    }
  };
  
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/aircraft-seat-configs/${currentSeatConfig.config_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update seat configuration');
      }
      
      const updatedSeatConfig = await response.json();
      setSeatConfigs(seatConfigs.map(config => 
        config.config_id === updatedSeatConfig.config_id ? updatedSeatConfig : config
      ));
      setShowEditModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating seat configuration:', error);
      setLoading(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/aircraft-seat-configs/${currentSeatConfig.config_id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete seat configuration');
      }
      
      setSeatConfigs(seatConfigs.filter(config => config.config_id !== currentSeatConfig.config_id));
      setShowDeleteModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting seat configuration:', error);
      setLoading(false);
    }
  };
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  if (loading && seatConfigs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Aircraft Seat Configuration Management</h1>
      
      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <Search className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by class type, aircraft registration, or model..."
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
          <span>Add Seat Configuration</span>
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Aircraft</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Class Type</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Seat Count</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Seat Pitch</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentSeatConfigs.length > 0 ? (
              currentSeatConfigs.map((config) => (
                <tr key={config.config_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{config.aircraft.registration_number} ({config.aircraft.model})</td>
                  <td className="py-3 px-4">{config.class_type}</td>
                  <td className="py-3 px-4">{config.seat_count}</td>
                  <td className="py-3 px-4">{config.seat_pitch || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(config)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(config)}
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
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  No seat configurations found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredSeatConfigs.length > configsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstConfig + 1} to {Math.min(indexOfLastConfig, filteredSeatConfigs.length)} of {filteredSeatConfigs.length} seat configurations
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
      
      {/* Add Seat Config Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Seat Configuration</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Aircraft ID</label>
                  <input
                    type="number"
                    name="aircraft"
                    value={formData.aircraft}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Class Type</label>
                  <input
                    type="text"
                    name="class_type"
                    value={formData.class_type}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Seat Count</label>
                  <input
                    type="number"
                    name="seat_count"
                    value={formData.seat_count}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Seat Pitch (optional)</label>
                  <input
                    type="number"
                    name="seat_pitch"
                    value={formData.seat_pitch}
                    onChange={handleInputChange}
                    step="0.01"
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
                  Add Seat Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Seat Config Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Seat Configuration</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Aircraft ID</label>
                  <input
                    type="number"
                    name="aircraft"
                    value={formData.aircraft}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Class Type</label>
                  <input
                    type="text"
                    name="class_type"
                    value={formData.class_type}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Seat Count</label>
                  <input
                    type="number"
                    name="seat_count"
                    value={formData.seat_count}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Seat Pitch (optional)</label>
                  <input
                    type="number"
                    name="seat_pitch"
                    value={formData.seat_pitch}
                    onChange={handleInputChange}
                    step="0.01"
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
              Are you sure you want to delete the seat configuration for <span className="font-semibold">{currentSeatConfig?.class_type}</span> on aircraft <span className="font-semibold">{currentSeatConfig?.aircraft.registration_number}</span>? This action cannot be undone.
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

export default AircraftSeatConfigManagement;