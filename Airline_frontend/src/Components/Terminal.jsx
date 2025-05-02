import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const TerminalManagement = () => {
  const [terminals, setTerminals] = useState([]);
  const [airports, setAirports] = useState([]);
  const [filteredTerminals, setFilteredTerminals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTerminal, setCurrentTerminal] = useState(null);
  const [formData, setFormData] = useState({
    terminal_name: '',
    airport: '',
    distance_miles: '',
    terminal_number_code: '',
    gate_count: '',
    international: false
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [terminalsPerPage] = useState(10);
  
  // Fetch terminals and airports from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch terminals
        const terminalsResponse = await fetch('http://localhost:8000/api/terminals/');
        if (!terminalsResponse.ok) {
          throw new Error('Failed to fetch terminals');
        }
        const terminalsData = await terminalsResponse.json();
        
        // Fetch airports for dropdown
        const airportsResponse = await fetch('http://localhost:8000/api/airports/');
        if (!airportsResponse.ok) {
          throw new Error('Failed to fetch airports');
        }
        const airportsData = await airportsResponse.json();
        
        setTerminals(terminalsData);
        setFilteredTerminals(terminalsData);
        setAirports(airportsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter terminals based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTerminals(terminals);
    } else {
      const results = terminals.filter(terminal => 
        terminal.terminal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        terminal.terminal_number_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airports.find(a => a.airport_id === terminal.airport)?.airport_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airports.find(a => a.airport_id === terminal.airport)?.airport_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTerminals(results);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, terminals, airports]);
  
  // Get current terminals for pagination
  const indexOfLastTerminal = currentPage * terminalsPerPage;
  const indexOfFirstTerminal = indexOfLastTerminal - terminalsPerPage;
  const currentTerminals = filteredTerminals.slice(indexOfFirstTerminal, indexOfLastTerminal);
  const totalPages = Math.ceil(filteredTerminals.length / terminalsPerPage);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'international' ? e.target.checked : value
    });
  };
  
  const handleAddClick = () => {
    setFormData({
      terminal_name: '',
      airport: airports.length > 0 ? airports[0].airport_id : '',
      distance_miles: '',
      terminal_number_code: '',
      gate_count: '',
      international: false
    });
    setShowAddModal(true);
  };
  
  const handleEditClick = (terminal) => {
    setCurrentTerminal(terminal);
    setFormData({
      terminal_name: terminal.terminal_name,
      airport: terminal.airport,
      distance_miles: terminal.distance_miles || '',
      terminal_number_code: terminal.terminal_number_code || '',
      gate_count: terminal.gate_count || '',
      international: terminal.international
    });
    setShowEditModal(true);
  };
  
  const handleDeleteClick = (terminal) => {
    setCurrentTerminal(terminal);
    setShowDeleteModal(true);
  };
  
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/terminals/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add terminal');
      }
      
      const newTerminal = await response.json();
      setTerminals([...terminals, newTerminal]);
      setShowAddModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding terminal:', error);
      setLoading(false);
    }
  };
  
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/terminals/${currentTerminal.terminal_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update terminal');
      }
      
      const updatedTerminal = await response.json();
      setTerminals(terminals.map(terminal => 
        terminal.terminal_id === updatedTerminal.terminal_id ? updatedTerminal : terminal
      ));
      setShowEditModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating terminal:', error);
      setLoading(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/terminals/${currentTerminal.terminal_id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete terminal');
      }
      
      setTerminals(terminals.filter(terminal => terminal.terminal_id !== currentTerminal.terminal_id));
      setShowDeleteModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting terminal:', error);
      setLoading(false);
    }
  };
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const getAirportName = (airportId) => {
    const airport = airports.find(airport => airport.airport_id === airportId);
    return airport ? `${airport.airport_code} - ${airport.airport_name}` : 'Unknown Airport';
  };
  
  if (loading && terminals.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Terminal Management</h1>
      
      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <Search className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search terminals by name, number code or airport..."
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
          <span>Add Terminal</span>
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Airport</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Terminal Name</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Terminal Code</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Gate Count</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Distance (miles)</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">International</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentTerminals.length > 0 ? (
              currentTerminals.map((terminal) => (
                <tr key={terminal.terminal_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{getAirportName(terminal.airport)}</td>
                  <td className="py-3 px-4 font-medium">{terminal.terminal_name}</td>
                  <td className="py-3 px-4">{terminal.terminal_number_code || '-'}</td>
                  <td className="py-3 px-4">{terminal.gate_count || '-'}</td>
                  <td className="py-3 px-4">{terminal.distance_miles || '-'}</td>
                  <td className="py-3 px-4">
                    {terminal.international ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(terminal)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(terminal)}
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
                  No terminals found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredTerminals.length > terminalsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstTerminal + 1} to {Math.min(indexOfLastTerminal, filteredTerminals.length)} of {filteredTerminals.length} terminals
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
      
      {/* Add Terminal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Terminal</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-1">Airport</label>
                  <select
                    name="airport"
                    value={formData.airport}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {airports.map(airport => (
                      <option key={airport.airport_id} value={airport.airport_id}>
                        {airport.airport_code} - {airport.airport_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Terminal Name</label>
                  <input
                    type="text"
                    name="terminal_name"
                    value={formData.terminal_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Terminal Number/Code</label>
                  <input
                    type="text"
                    name="terminal_number_code"
                    value={formData.terminal_number_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Gate Count</label>
                  <input
                    type="number"
                    name="gate_count"
                    value={formData.gate_count}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Distance (miles)</label>
                  <input
                    type="number"
                    name="distance_miles"
                    value={formData.distance_miles}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="international"
                    name="international"
                    checked={formData.international}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="international" className="ml-2 block text-gray-700">
                    International Terminal
                  </label>
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
                  Add Terminal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Terminal Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Terminal</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-1">Airport</label>
                  <select
                    name="airport"
                    value={formData.airport}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {airports.map(airport => (
                      <option key={airport.airport_id} value={airport.airport_id}>
                        {airport.airport_code} - {airport.airport_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Terminal Name</label>
                  <input
                    type="text"
                    name="terminal_name"
                    value={formData.terminal_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Terminal Number/Code</label>
                  <input
                    type="text"
                    name="terminal_number_code"
                    value={formData.terminal_number_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Gate Count</label>
                  <input
                    type="number"
                    name="gate_count"
                    value={formData.gate_count}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Distance (miles)</label>
                  <input
                    type="number"
                    name="distance_miles"
                    value={formData.distance_miles}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="edit-international"
                    name="international"
                    checked={formData.international}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="edit-international" className="ml-2 block text-gray-700">
                    International Terminal
                  </label>
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
              Are you sure you want to delete the terminal <span className="font-semibold">{currentTerminal?.terminal_name}</span> at {getAirportName(currentTerminal?.airport)}? This action cannot be undone.
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

export default TerminalManagement;