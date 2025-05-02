import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const AirlineManagement = () => {
  const [airlines, setAirlines] = useState([]);
  const [filteredAirlines, setFilteredAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAirline, setCurrentAirline] = useState(null);
  const [formData, setFormData] = useState({
    airline_name: '',
    airline_code: '',
    headquarters: '',
    founding_date: '',
    logo_url: '',
    contact_info: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [airlinesPerPage] = useState(10);
  
  // Fetch airlines from API
  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/airlines/');
        if (!response.ok) {
          throw new Error('Failed to fetch airlines');
        }
        const data = await response.json();
        setAirlines(data);
        setFilteredAirlines(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching airlines:', error);
        setLoading(false);
      }
    };
    
    fetchAirlines();
  }, []);
  
  // Filter airlines based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAirlines(airlines);
    } else {
      const results = airlines.filter(airline => 
        airline.airline_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airline.airline_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airline.headquarters.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAirlines(results);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, airlines]);
  
  // Get current airlines for pagination
  const indexOfLastAirline = currentPage * airlinesPerPage;
  const indexOfFirstAirline = indexOfLastAirline - airlinesPerPage;
  const currentAirlines = filteredAirlines.slice(indexOfFirstAirline, indexOfLastAirline);
  const totalPages = Math.ceil(filteredAirlines.length / airlinesPerPage);
  
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
      airline_name: '',
      airline_code: '',
      headquarters: '',
      founding_date: '',
      logo_url: '',
      contact_info: ''
    });
    setShowAddModal(true);
  };
  
  const handleEditClick = (airline) => {
    setCurrentAirline(airline);
    setFormData({
      airline_name: airline.airline_name,
      airline_code: airline.airline_code,
      headquarters: airline.headquarters,
      founding_date: airline.founding_date ? airline.founding_date : '',
      logo_url: airline.logo_url ? airline.logo_url : '',
      contact_info: airline.contact_info ? airline.contact_info : ''
    });
    setShowEditModal(true);
  };
  
  const handleDeleteClick = (airline) => {
    setCurrentAirline(airline);
    setShowDeleteModal(true);
  };
  
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/airlines/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add airline');
      }
      
      const newAirline = await response.json();
      setAirlines([...airlines, newAirline]);
      setShowAddModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding airline:', error);
      setLoading(false);
    }
  };
  
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/airlines/${currentAirline.airline_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update airline');
      }
      
      const updatedAirline = await response.json();
      setAirlines(airlines.map(airline => 
        airline.airline_id === updatedAirline.airline_id ? updatedAirline : airline
      ));
      setShowEditModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating airline:', error);
      setLoading(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/airlines/${currentAirline.airline_id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete airline');
      }
      
      setAirlines(airlines.filter(airline => airline.airline_id !== currentAirline.airline_id));
      setShowDeleteModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting airline:', error);
      setLoading(false);
    }
  };
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  if (loading && airlines.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Airline Management</h1>
      
      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <Search className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search airlines by name, code or headquarters..."
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
          <span>Add Airline</span>
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Code</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Name</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Headquarters</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Founded</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Contact</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentAirlines.length > 0 ? (
              currentAirlines.map((airline) => (
                <tr key={airline.airline_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{airline.airline_code}</td>
                  <td className="py-3 px-4">{airline.airline_name}</td>
                  <td className="py-3 px-4">{airline.headquarters}</td>
                  <td className="py-3 px-4">{airline.founding_date}</td>
                  <td className="py-3 px-4">{airline.contact_info || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(airline)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(airline)}
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
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No airlines found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredAirlines.length > airlinesPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstAirline + 1} to {Math.min(indexOfLastAirline, filteredAirlines.length)} of {filteredAirlines.length} airlines
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
      
      {/* Add Airline Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Airline</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Airline Name</label>
                  <input
                    type="text"
                    name="airline_name"
                    value={formData.airline_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Airline Code</label>
                  <input
                    type="text"
                    name="airline_code"
                    value={formData.airline_code}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Headquarters</label>
                  <input
                    type="text"
                    name="headquarters"
                    value={formData.headquarters}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Founding Date</label>
                  <input
                    type="date"
                    name="founding_date"
                    value={formData.founding_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Logo URL</label>
                  <input
                    type="text"
                    name="logo_url"
                    value={formData.logo_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Contact Information</label>
                  <input
                    type="text"
                    name="contact_info"
                    value={formData.contact_info}
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
                  Add Airline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Airline Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Airline</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Airline Name</label>
                  <input
                    type="text"
                    name="airline_name"
                    value={formData.airline_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Airline Code</label>
                  <input
                    type="text"
                    name="airline_code"
                    value={formData.airline_code}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Headquarters</label>
                  <input
                    type="text"
                    name="headquarters"
                    value={formData.headquarters}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Founding Date</label>
                  <input
                    type="date"
                    name="founding_date"
                    value={formData.founding_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Logo URL</label>
                  <input
                    type="text"
                    name="logo_url"
                    value={formData.logo_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Contact Information</label>
                  <input
                    type="text"
                    name="contact_info"
                    value={formData.contact_info}
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
              Are you sure you want to delete the airline <span className="font-semibold">{currentAirline?.airline_name}</span> ({currentAirline?.airline_code})? This action cannot be undone.
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

export default AirlineManagement;