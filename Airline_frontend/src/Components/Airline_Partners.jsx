import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const AirlinePartnerManagement = () => {
  const [partnerships, setPartnerships] = useState([]);
  const [filteredPartnerships, setFilteredPartnerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPartnership, setCurrentPartnership] = useState(null);
  const [airlines, setAirlines] = useState([]);
  const [formData, setFormData] = useState({
    airline_id1: '',
    airline_id2: '',
    partnership_type: '',
    start_date: '',
    end_date: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [partnershipsPerPage] = useState(10);
  
  // Fetch partnerships and airlines from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partnershipsResponse, airlinesResponse] = await Promise.all([
          fetch('http://localhost:8000/api/airline-partners/'),
          fetch('http://localhost:8000/api/airlines/')
        ]);
        
        if (!partnershipsResponse.ok || !airlinesResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const partnershipsData = await partnershipsResponse.json();
        const airlinesData = await airlinesResponse.json();
        
        setPartnerships(partnershipsData);
        setFilteredPartnerships(partnershipsData);
        setAirlines(airlinesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter partnerships based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPartnerships(partnerships);
    } else {
      const results = partnerships.filter(partnership => 
        partnership.airline_id1.airline_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partnership.airline_id2.airline_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partnership.airline_id1.airline_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partnership.airline_id2.airline_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partnership.partnership_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPartnerships(results);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, partnerships]);
  
  // Get current partnerships for pagination
  const indexOfLastPartnership = currentPage * partnershipsPerPage;
  const indexOfFirstPartnership = indexOfLastPartnership - partnershipsPerPage;
  const currentPartnerships = filteredPartnerships.slice(indexOfFirstPartnership, indexOfLastPartnership);
  const totalPages = Math.ceil(filteredPartnerships.length / partnershipsPerPage);
  
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
      airline_id1: airlines.length > 0 ? airlines[0].airline_id : '',
      airline_id2: airlines.length > 1 ? airlines[1].airline_id : '',
      partnership_type: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: ''
    });
    setShowAddModal(true);
  };
  
  const handleEditClick = (partnership) => {
    setCurrentPartnership(partnership);
    setFormData({
      airline_id1: partnership.airline_id1.airline_id,
      airline_id2: partnership.airline_id2.airline_id,
      partnership_type: partnership.partnership_type,
      start_date: partnership.start_date,
      end_date: partnership.end_date || ''
    });
    setShowEditModal(true);
  };
  
  const handleDeleteClick = (partnership) => {
    setCurrentPartnership(partnership);
    setShowDeleteModal(true);
  };
  
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/airline-partners/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add partnership');
      }
      
      const newPartnership = await response.json();
      
      // Fetch the complete data with airline details
      const detailResponse = await fetch(`http://localhost:8000/api/airline-partners/${newPartnership.partnership_id}/`);
      if (!detailResponse.ok) {
        throw new Error('Failed to fetch partnership details');
      }
      
      const detailedPartnership = await detailResponse.json();
      setPartnerships([...partnerships, detailedPartnership]);
      setShowAddModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding partnership:', error);
      setLoading(false);
    }
  };
  
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/airline-partners/${currentPartnership.partnership_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update partnership');
      }
      
      // Fetch the complete data with airline details
      const detailResponse = await fetch(`http://localhost:8000/api/airline-partners/${currentPartnership.partnership_id}/`);
      if (!detailResponse.ok) {
        throw new Error('Failed to fetch partnership details');
      }
      
      const updatedPartnership = await detailResponse.json();
      
      setPartnerships(partnerships.map(partnership => 
        partnership.partnership_id === updatedPartnership.partnership_id ? updatedPartnership : partnership
      ));
      setShowEditModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating partnership:', error);
      setLoading(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/airline-partners/${currentPartnership.partnership_id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete partnership');
      }
      
      setPartnerships(partnerships.filter(partnership => partnership.partnership_id !== currentPartnership.partnership_id));
      setShowDeleteModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting partnership:', error);
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Ongoing';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  if (loading && partnerships.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Airline Partnership Management</h1>
      
      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <Search className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search partnerships by airline name, code or partnership type..."
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
          <span>Add Partnership</span>
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Airline 1</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Airline 2</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Partnership Type</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Start Date</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">End Date</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentPartnerships.length > 0 ? (
              currentPartnerships.map((partnership) => (
                <tr key={partnership.partnership_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{partnership.airline_id1.airline_code}</div>
                      <div className="text-sm text-gray-600">{partnership.airline_id1.airline_name}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{partnership.airline_id2.airline_code}</div>
                      <div className="text-sm text-gray-600">{partnership.airline_id2.airline_name}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{partnership.partnership_type}</td>
                  <td className="py-3 px-4">{formatDate(partnership.start_date)}</td>
                  <td className="py-3 px-4">{formatDate(partnership.end_date)}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(partnership)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(partnership)}
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
                  No partnerships found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredPartnerships.length > partnershipsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstPartnership + 1} to {Math.min(indexOfLastPartnership, filteredPartnerships.length)} of {filteredPartnerships.length} partnerships
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
      
      {/* Add Partnership Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Partnership</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">First Airline</label>
                  <select
                    name="airline_id1"
                    value={formData.airline_id1}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {airlines.map(airline => (
                      <option key={`airline1-${airline.airline_id}`} value={airline.airline_id}>
                        {airline.airline_code} - {airline.airline_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Second Airline</label>
                  <select
                    name="airline_id2"
                    value={formData.airline_id2}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {airlines.map(airline => (
                      <option key={`airline2-${airline.airline_id}`} value={airline.airline_id}>
                        {airline.airline_code} - {airline.airline_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Partnership Type</label>
                  <select
                    name="partnership_type"
                    value={formData.partnership_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Partnership Type</option>
                    <option value="Code Share">Code Share</option>
                    <option value="Alliance">Alliance</option>
                    <option value="Joint Venture">Joint Venture</option>
                    <option value="Interline">Interline</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Frequent Flyer">Frequent Flyer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">End Date (Leave blank if ongoing)</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
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
                  Add Partnership
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Partnership Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Partnership</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">First Airline</label>
                  <select
                    name="airline_id1"
                    value={formData.airline_id1}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {airlines.map(airline => (
                      <option key={`edit-airline1-${airline.airline_id}`} value={airline.airline_id}>
                        {airline.airline_code} - {airline.airline_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Second Airline</label>
                  <select
                    name="airline_id2"
                    value={formData.airline_id2}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {airlines.map(airline => (
                      <option key={`edit-airline2-${airline.airline_id}`} value={airline.airline_id}>
                        {airline.airline_code} - {airline.airline_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Partnership Type</label>
                  <select
                    name="partnership_type"
                    value={formData.partnership_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Partnership Type</option>
                    <option value="Code Share">Code Share</option>
                    <option value="Alliance">Alliance</option>
                    <option value="Joint Venture">Joint Venture</option>
                    <option value="Interline">Interline</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Frequent Flyer">Frequent Flyer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">End Date (Leave blank if ongoing)</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
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
              Are you sure you want to delete the partnership between
              <span className="font-semibold"> {currentPartnership?.airline_id1.airline_name}</span> and
              <span className="font-semibold"> {currentPartnership?.airline_id2.airline_name}</span>? 
              This action cannot be undone.
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

export default AirlinePartnerManagement;