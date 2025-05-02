import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const SpecialRequestManagement = () => {
  const [specialRequests, setSpecialRequests] = useState([]);
  const [filteredSpecialRequests, setFilteredSpecialRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSpecialRequest, setCurrentSpecialRequest] = useState(null);
  const [formData, setFormData] = useState({
    ticket: '',
    request_type: '',
    request_details: '',
    status: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  
  // Fetch special requests from API
  useEffect(() => {
    const fetchSpecialRequests = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/special-requests/');
        if (!response.ok) {
          throw new Error('Failed to fetch special requests');
        }
        const data = await response.json();
        setSpecialRequests(data);
        setFilteredSpecialRequests(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching special requests:', error);
        setLoading(false);
      }
    };
    
    fetchSpecialRequests();
  }, []);
  
  // Filter special requests based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSpecialRequests(specialRequests);
    } else {
      const results = specialRequests.filter(record => 
        record.ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.request_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSpecialRequests(results);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, specialRequests]);
  
  // Get current records for pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSpecialRequests.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredSpecialRequests.length / recordsPerPage);
  
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
      request_type: '',
      request_details: '',
      status: ''
    });
    setShowAddModal(true);
  };
  
  const handleEditClick = (specialRequest) => {
    setCurrentSpecialRequest(specialRequest);
    setFormData({
      ticket: specialRequest.ticket.ticket_id,
      request_type: specialRequest.request_type,
      request_details: specialRequest.request_details || '',
      status: specialRequest.status
    });
    setShowEditModal(true);
  };
  
  const handleDeleteClick = (specialRequest) => {
    setCurrentSpecialRequest(specialRequest);
    setShowDeleteModal(true);
  };
  
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/special-requests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          request_details: formData.request_details || null
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add special request');
      }
      
      const newRecord = await response.json();
      setSpecialRequests([...specialRequests, newRecord]);
      setShowAddModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding special request:', error);
      setLoading(false);
    }
  };
  
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/special-requests/${currentSpecialRequest.request_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          request_details: formData.request_details || null
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update special request');
      }
      
      const updatedRecord = await response.json();
      setSpecialRequests(specialRequests.map(record => 
        record.request_id === updatedRecord.request_id ? updatedRecord : record
      ));
      setShowEditModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating special request:', error);
      setLoading(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/special-requests/${currentSpecialRequest.request_id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete special request');
      }
      
      setSpecialRequests(specialRequests.filter(record => record.request_id !== currentSpecialRequest.request_id));
      setShowDeleteModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting special request:', error);
      setLoading(false);
    }
  };
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  if (loading && specialRequests.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Special Request Management</h1>
      
      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <Search className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search special requests by ticket number, request type, or status..."
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
          <span>Add Special Request</span>
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Ticket Number</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Request Type</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Request Details</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Status</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentRecords.length > 0 ? (
              currentRecords.map((record) => (
                <tr key={record.request_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{record.ticket.ticket_number}</td>
                  <td className="py-3 px-4">{record.request_type}</td>
                  <td className="py-3 px-4">{record.request_details || 'N/A'}</td>
                  <td className="py-3 px-4">{record.status}</td>
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
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  No special requests found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredSpecialRequests.length > recordsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredSpecialRequests.length)} of {filteredSpecialRequests.length} special requests
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
      
      {/* Add Special Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Special Request</h2>
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
                  <label className="block text-gray-700 mb-1">Request Type</label>
                  <select
                    name="request_type"
                    value={formData.request_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Request Type</option>
                    <option value="Wheelchair">Wheelchair</option>
                    <option value="Special Meal">Special Meal</option>
                    <option value="Extra Legroom">Extra Legroom</option>
                    <option value="Pet in Cabin">Pet in Cabin</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-1">Request Details (Optional)</label>
                  <textarea
                    name="request_details"
                    value={formData.request_details}
                    onChange={handleInputChange}
                    maxLength={255}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
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
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Denied">Denied</option>
                    <option value="Completed">Completed</option>
                  </select>
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
                  Add Special Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Special Request Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Special Request</h2>
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
                  <label className="block text-gray-700 mb-1">Request Type</label>
                  <select
                    name="request_type"
                    value={formData.request_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Request Type</option>
                    <option value="Wheelchair">Wheelchair</option>
                    <option value="Special Meal">Special Meal</option>
                    <option value="Extra Legroom">Extra Legroom</option>
                    <option value="Pet in Cabin">Pet in Cabin</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-1">Request Details (Optional)</label>
                  <textarea
                    name="request_details"
                    value={formData.request_details}
                    onChange={handleInputChange}
                    maxLength={255}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
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
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Denied">Denied</option>
                    <option value="Completed">Completed</option>
                  </select>
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
              Are you sure you want to delete the special request for ticket <span className="font-semibold">{currentSpecialRequest?.ticket.ticket_number}</span> (Type: {currentSpecialRequest?.request_type})? This action cannot be undone.
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

export default SpecialRequestManagement;