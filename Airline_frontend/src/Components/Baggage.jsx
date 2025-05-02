import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const BaggageManagement = () => {
  const [baggageRecords, setBaggageRecords] = useState([]);
  const [filteredBaggageRecords, setFilteredBaggageRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentBaggage, setCurrentBaggage] = useState(null);
  const [formData, setFormData] = useState({
    ticket: '',
    baggage_tag: '',
    weight: '',
    baggage_status: '',
    checked_bags_count: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  
  // Fetch baggage records from API
  useEffect(() => {
    const fetchBaggageRecords = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/baggage/');
        if (!response.ok) {
          throw new Error('Failed to fetch baggage records');
        }
        const data = await response.json();
        setBaggageRecords(data);
        setFilteredBaggageRecords(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching baggage records:', error);
        setLoading(false);
      }
    };
    
    fetchBaggageRecords();
  }, []);
  
  // Filter baggage records based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBaggageRecords(baggageRecords);
    } else {
      const results = baggageRecords.filter(record => 
        record.baggage_tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.passenger_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.baggage_status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBaggageRecords(results);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, baggageRecords]);
  
  // Get current records for pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredBaggageRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredBaggageRecords.length / recordsPerPage);
  
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
      ticket: '',
      baggage_tag: '',
      weight: '',
      baggage_status: '',
      checked_bags_count: ''
    });
    setShowAddModal(true);
  };
  
  const handleEditClick = (baggage) => {
    setCurrentBaggage(baggage);
    setFormData({
      ticket: baggage.ticket.ticket_id,
      baggage_tag: baggage.baggage_tag,
      weight: baggage.weight,
      baggage_status: baggage.baggage_status,
      checked_bags_count: baggage.checked_bags_count
    });
    setShowEditModal(true);
  };
  
  const handleDeleteClick = (baggage) => {
    setCurrentBaggage(baggage);
    setShowDeleteModal(true);
  };
  
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/baggage/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add baggage record');
      }
      
      const newRecord = await response.json();
      setBaggageRecords([...baggageRecords, newRecord]);
      setShowAddModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding baggage record:', error);
      setLoading(false);
    }
  };
  
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/baggage/${currentBaggage.baggage_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update baggage record');
      }
      
      const updatedRecord = await response.json();
      setBaggageRecords(baggageRecords.map(record => 
        record.baggage_id === updatedRecord.baggage_id ? updatedRecord : record
      ));
      setShowEditModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating baggage record:', error);
      setLoading(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/baggage/${currentBaggage.baggage_id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete baggage record');
      }
      
      setBaggageRecords(baggageRecords.filter(record => record.baggage_id !== currentBaggage.baggage_id));
      setShowDeleteModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting baggage record:', error);
      setLoading(false);
    }
  };
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  if (loading && baggageRecords.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Baggage Management</h1>
      
      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <Search className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search baggage by tag, ticket number, passenger name, or status..."
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
          <span>Add Baggage</span>
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Baggage Tag</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Ticket Number</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Passenger</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Weight (kg)</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Status</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Checked Bags</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentRecords.length > 0 ? (
              currentRecords.map((record) => (
                <tr key={record.baggage_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{record.baggage_tag}</td>
                  <td className="py-3 px-4">{record.ticket_number}</td>
                  <td className="py-3 px-4">{record.passenger_name}</td>
                  <td className="py-3 px-4">{record.weight}</td>
                  <td className="py-3 px-4">{record.baggage_status}</td>
                  <td className="py-3 px-4">{record.checked_bags_count}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(record)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(record)}
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
                  No baggage records found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredBaggageRecords.length > recordsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredBaggageRecords.length)} of {filteredBaggageRecords.length} baggage records
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
      
      {/* Add Baggage Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Baggage Record</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Ticket ID</label>
                  <input
                    type="number"
                    name="ticket"
                    value={formData.ticket}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Baggage Tag</label>
                  <input
                    type="text"
                    name="baggage_tag"
                    value={formData.baggage_tag}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Baggage Status</label>
                  <select
                    name="baggage_status"
                    value={formData.baggage_status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Checked">Checked</option>
                    <option value="Loaded">Loaded</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Checked Bags Count</label>
                  <input
                    type="number"
                    name="checked_bags_count"
                    value={formData.checked_bags_count}
                    onChange={handleInputChange}
                    required
                    min="0"
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
                  Add Baggage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Baggage Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Baggage Record</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Ticket ID</label>
                  <input
                    type="number"
                    name="ticket"
                    value={formData.ticket}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Baggage Tag</label>
                  <input
                    type="text"
                    name="baggage_tag"
                    value={formData.baggage_tag}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Baggage Status</label>
                  <select
                    name="baggage_status"
                    value={formData.baggage_status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Checked">Checked</option>
                    <option value="Loaded">Loaded</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Checked Bags Count</label>
                  <input
                    type="number"
                    name="checked_bags_count"
                    value={formData.checked_bags_count}
                    onChange={handleInputChange}
                    required
                    min="0"
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
              Are you sure you want to delete the baggage record with tag <span className="font-semibold">{currentBaggage?.baggage_tag}</span>? This action cannot be undone.
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

export default BaggageManagement;