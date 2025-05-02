// import React, { useState, useEffect } from 'react';
// import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

// const MaintenanceRecordManagement = () => {
//   const [records, setRecords] = useState([]);
//   const [filteredRecords, setFilteredRecords] = useState([]);
//   const [aircrafts, setAircrafts] = useState([]); // Store available aircrafts for dropdown
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentRecord, setCurrentRecord] = useState(null);
//   const [formData, setFormData] = useState({
//     aircraft: '',
//     maintenance_date: '',
//     maintenance_type: '',
//     description: '',
//     performed_by: '',
//     status: '',
//     next_due_date: ''
//   });

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [recordsPerPage] = useState(10);

//   // Fetch maintenance records and aircrafts from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch maintenance records
//         const recordsResponse = await fetch('http://localhost:8000/api/maintenance-records/');
//         if (!recordsResponse.ok) {
//           throw new Error('Failed to fetch maintenance records');
//         }
//         const recordsData = await recordsResponse.json();
//         setRecords(recordsData);
//         setFilteredRecords(recordsData);

//         // Fetch aircrafts for dropdown
//         const aircraftsResponse = await fetch('http://localhost:8000/api/aircraft/');
//         if (!aircraftsResponse.ok) {
//           throw new Error('Failed to fetch aircrafts');
//         }
//         const aircraftsData = await aircraftsResponse.json();
//         setAircrafts(aircraftsData);

//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Filter records based on search term
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredRecords(records);
//     } else {
//       const results = records.filter(record =>
//         record.aircraft.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         record.maintenance_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         record.performed_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         record.status.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredRecords(results);
//     }
//     // Reset to first page when search changes
//     setCurrentPage(1);
//   }, [searchTerm, records]);

//   // Get current records for pagination
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
//   const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleAddClick = () => {
//     setFormData({
//       aircraft: '',
//       maintenance_date: '',
//       maintenance_type: '',
//       description: '',
//       performed_by: '',
//       status: '',
//       next_due_date: ''
//     });
//     setShowAddModal(true);
//   };

//   const handleEditClick = (record) => {
//     setCurrentRecord(record);
//     setFormData({
//       aircraft: record.aircraft_details.aircraft_id, // Use aircraft_id from aircraft_details
//       maintenance_date: record.maintenance_date,
//       maintenance_type: record.maintenance_type,
//       description: record.description || '',
//       performed_by: record.performed_by,
//       status: record.status,
//       next_due_date: record.next_due_date || ''
//     });
//     setShowEditModal(true);
//   };

//   const handleDeleteClick = (record) => {
//     setCurrentRecord(record);
//     setShowDeleteModal(true);
//   };

//   const handleSubmitAdd = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch('http://localhost:8000/api/maintenance-records/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add maintenance record');
//       }

//       const newRecord = await response.json();
//       setRecords([...records, newRecord]);
//       setShowAddModal(false);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error adding maintenance record:', error);
//       setLoading(false);
//     }
//   };

//   const handleSubmitEdit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch(`http://localhost:8000/api/maintenance-records/${currentRecord.record_id}/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update maintenance record');
//       }

//       const updatedRecord = await response.json();
//       setRecords(records.map(record =>
//         record.record_id === updatedRecord.record_id ? updatedRecord : record
//       ));
//       setShowEditModal(false);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error updating maintenance record:', error);
//       setLoading(false);
//     }
//   };

//   const handleConfirmDelete = async () => {
//     setLoading(true);

//     try {
//       const response = await fetch(`http://localhost:8000/api/maintenance-records/${currentRecord.record_id}/`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete maintenance record');
//       }

//       setRecords(records.filter(record => record.record_id !== currentRecord.record_id));
//       setShowDeleteModal(false);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error deleting maintenance record:', error);
//       setLoading(false);
//     }
//   };

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   if (loading && records.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Maintenance Record Management</h1>

//       {/* Search and Add Button */}
//       <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
//         <div className="relative flex items-center w-full md:w-2/3">
//           <Search className="absolute left-3 text-gray-400" size={20} />
//           <input
//             type="text"
//             placeholder="Search records by aircraft, type, performed by or status..."
//             className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//         </div>
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
//           onClick={handleAddClick}
//         >
//           <PlusCircle size={20} />
//           <span>Add Record</span>
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto shadow-md rounded-lg">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Aircraft</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Date</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Type</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Performed By</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Status</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Next Due</th>
//               <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {currentRecords.length > 0 ? (
//               currentRecords.map((record) => (
//                 <tr key={record.record_id} className="hover:bg-gray-50">
//                   <td className="py-3 px-4 font-medium">{record.aircraft}</td>
//                   <td className="py-3 px-4">{record.maintenance_date}</td>
//                   <td className="py-3 px-4">{record.maintenance_type}</td>
//                   <td className="py-3 px-4">{record.performed_by}</td>
//                   <td className="py-3 px-4">{record.status}</td>
//                   <td className="py-3 px-4">{record.next_due_date || '-'}</td>
//                   <td className="py-3 px-4">
//                     <div className="flex justify-center gap-3">
//                       <button
//                         onClick={() => handleEditClick(record)}
//                         className="text-blue-600 hover:text-blue-800"
//                         title="Edit"
//                       >
//                         <Edit size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteClick(record)}
//                         className="text-red-600 hover:text-red-800"
//                         title="Delete"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="py-8 text-center text-gray-500">
//                   No maintenance records found matching your search criteria
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {filteredRecords.length > recordsPerPage && (
//         <div className="flex justify-between items-center mt-6">
//           <div className="text-sm text-gray-600">
//             Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length} records
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => paginate(Math.max(1, currentPage - 1))}
//               disabled={currentPage === 1}
//               className={`flex items-center px-3 py-1 rounded border ${
//                 currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <ChevronLeft size={16} />
//               <span className="ml-1">Prev</span>
//             </button>

//             <div className="flex gap-1">
//               {Array.from({ length: totalPages }, (_, i) => i + 1)
//                 .filter(num => (
//                   num === 1 ||
//                   num === totalPages ||
//                   (num >= currentPage - 1 && num <= currentPage + 1)
//                 ))
//                 .map((number, idx, array) => {
//                   // Add ellipsis
//                   if (idx > 0 && array[idx - 1] !== number - 1) {
//                     return (
//                       <React.Fragment key={`ellipsis-${number}`}>
//                         <span className="px-3 py-1 text-gray-400">...</span>
//                         <button
//                           onClick={() => paginate(number)}
//                           className={`px-3 py-1 rounded border ${
//                             currentPage === number ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
//                           }`}
//                         >
//                           {number}
//                         </button>
//                       </React.Fragment>
//                     );
//                   }
//                   return (
//                     <button
//                       key={number}
//                       onClick={() => paginate(number)}
//                       className={`px-3 py-1 rounded border ${
//                         currentPage === number ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
//                       }`}
//                     >
//                       {number}
//                     </button>
//                   );
//                 })}
//             </div>

//             <button
//               onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
//               disabled={currentPage === totalPages}
//               className={`flex items-center px-3 py-1 rounded border ${
//                 currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <span className="mr-1">Next</span>
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Add Maintenance Record Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Add New Maintenance Record</h2>
//             <form onSubmit={handleSubmitAdd}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-gray-700 mb-1">Aircraft</label>
//                   <select
//                     name="aircraft"
//                     value={formData.aircraft}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Aircraft</option>
//                     {aircrafts.map(aircraft => (
//                       <option key={aircraft.aircraft_id} value={aircraft.aircraft_id}>
//                         {aircraft.registration_number} ({aircraft.model})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Maintenance Date</label>
//                   <input
//                     type="date"
//                     name="maintenance_date"
//                     value={formData.maintenance_date}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Maintenance Type</label>
//                   <input
//                     type="text"
//                     name="maintenance_type"
//                     value={formData.maintenance_type}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Performed By</label>
//                   <input
//                     type="text"
//                     name="performed_by"
//                     value={formData.performed_by}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Status</label>
//                   <input
//                     type="text"
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Next Due Date</label>
//                   <input
//                     type="date"
//                     name="next_due_date"
//                     value={formData.next_due_date}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-gray-700 mb-1">Description</label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows="4"
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(false)}
//                   className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Add Record
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Maintenance Record Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Edit Maintenance Record</h2>
//             <form onSubmit={handleSubmitEdit}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-gray-700 mb-1">Aircraft</label>
//                   <select
//                     name="aircraft"
//                     value={formData.aircraft}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Aircraft</option>
//                     {aircrafts.map(aircraft => (
//                       <option key={aircraft.aircraft_id} value={aircraft.aircraft_id}>
//                         {aircraft.registration_number} ({aircraft.model})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Maintenance Date</label>
//                   <input
//                     type="date"
//                     name="maintenance_date"
//                     value={formData.maintenance_date}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Maintenance Type</label>
//                   <input
//                     type="text"
//                     name="maintenance_type"
//                     value={formData.maintenance_type}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Performed By</label>
//                   <input
//                     type="text"
//                     name="performed_by"
//                     value={formData.performed_by}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Status</label>
//                   <input
//                     type="text"
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Next Due Date</label>
//                   <input
//                     type="date"
//                     name="next_due_date"
//                     value={formData.next_due_date}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-gray-700 mb-1">Description</label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows="4"
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setShowEditModal(false)}
//                   className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
//             <p className="mb-6">
//               Are you sure you want to delete the maintenance record for{' '}
//               <span className="font-semibold">{currentRecord?.aircraft}</span> dated{' '}
//               <span className="font-semibold">{currentRecord?.maintenance_date}</span>? This action cannot be undone.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmDelete}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MaintenanceRecordManagement;
import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const MaintenanceRecordManagement = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(''); // For displaying errors
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formData, setFormData] = useState({
    aircraft: '',
    maintenance_date: '',
    maintenance_type: '',
    description: '',
    performed_by: '',
    status: '',
    next_due_date: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  // Fetch maintenance records and aircrafts from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const recordsResponse = await fetch('http://localhost:8000/api/maintenance-records/');
        if (!recordsResponse.ok) {
          throw new Error('Failed to fetch maintenance records');
        }
        const recordsData = await recordsResponse.json();
        setRecords(recordsData);
        setFilteredRecords(recordsData);

        const aircraftsResponse = await fetch('http://localhost:8000/api/aircraft/');
        if (!aircraftsResponse.ok) {
          throw new Error('Failed to fetch aircrafts');
        }
        const aircraftsData = await aircraftsResponse.json();
        setAircrafts(aircraftsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter records based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRecords(records);
    } else {
      const results = records.filter(record =>
        record.aircraft_registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.maintenance_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.performed_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecords(results);
    }
    setCurrentPage(1);
  }, [searchTerm, records]);

  // Get current records for pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

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
      maintenance_date: '',
      maintenance_type: '',
      description: '',
      performed_by: '',
      status: '',
      next_due_date: ''
    });
    setErrorMessage('');
    setShowAddModal(true);
  };

  const handleEditClick = (record) => {
    setCurrentRecord(record);
    setFormData({
      aircraft: record.aircraft, // Now aircraft is the aircraft_id
      maintenance_date: record.maintenance_date,
      maintenance_type: record.maintenance_type,
      description: record.description || '',
      performed_by: record.performed_by,
      status: record.status,
      next_due_date: record.next_due_date || ''
    });
    setErrorMessage('');
    setShowEditModal(true);
  };

  const handleDeleteClick = (record) => {
    setCurrentRecord(record);
    setShowDeleteModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // Ensure aircraft is an integer
    const payload = {
      ...formData,
      aircraft: parseInt(formData.aircraft, 10) || null
    };

    console.log('Submitting payload:', payload); // Debug payload

    try {
      const response = await fetch('http://localhost:8000/api/maintenance-records/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response:', errorData);
        throw new Error(errorData.detail || JSON.stringify(errorData) || 'Failed to add maintenance record');
      }

      const newRecord = await response.json();
      setRecords([...records, newRecord]);
      setShowAddModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding maintenance record:', error);
      setErrorMessage(error.message || 'Failed to add maintenance record. Please check the form and try again.');
      setLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const payload = {
      ...formData,
      aircraft: parseInt(formData.aircraft, 10) || null
    };

    try {
      const response = await fetch(`http://localhost:8000/api/maintenance-records/${currentRecord.record_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || JSON.stringify(errorData) || 'Failed to update maintenance record');
      }

      const updatedRecord = await response.json();
      setRecords(records.map(record =>
        record.record_id === updatedRecord.record_id ? updatedRecord : record
      ));
      setShowEditModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating maintenance record:', error);
      setErrorMessage(error.message || 'Failed to update maintenance record. Please check the form and try again.');
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`http://localhost:8000/api/maintenance-records/${currentRecord.record_id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete maintenance record');
      }

      setRecords(records.filter(record => record.record_id !== currentRecord.record_id));
      setShowDeleteModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
      setErrorMessage('Failed to delete maintenance record. Please try again.');
      setLoading(false);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && records.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Maintenance Record Management</h1>

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <Search className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search records by aircraft, type, performed by or status..."
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
          <span>Add Record</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Aircraft</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Date</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Type</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Performed By</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Status</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Next Due</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentRecords.length > 0 ? (
              currentRecords.map((record) => (
                <tr key={record.record_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{record.aircraft_registration}</td>
                  <td className="py-3 px-4">{record.maintenance_date}</td>
                  <td className="py-3 px-4">{record.maintenance_type}</td>
                  <td className="py-3 px-4">{record.performed_by}</td>
                  <td className="py-3 px-4">{record.status}</td>
                  <td className="py-3 px-4">{record.next_due_date || '-'}</td>
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
                  No maintenance records found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredRecords.length > recordsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length} records
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

      {/* Add Maintenance Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Maintenance Record</h2>
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-gray-700 mb-1">Maintenance Date</label>
                  <input
                    type="date"
                    name="maintenance_date"
                    value={formData.maintenance_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Maintenance Type</label>
                  <input
                    type="text"
                    name="maintenance_type"
                    value={formData.maintenance_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Performed By</label>
                  <input
                    type="text"
                    name="performed_by"
                    value={formData.performed_by}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Status</label>
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Next Due Date</label>
                  <input
                    type="date"
                    name="next_due_date"
                    value={formData.next_due_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
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
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Maintenance Record Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Maintenance Record</h2>
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-gray-700 mb-1">Maintenance Date</label>
                  <input
                    type="date"
                    name="maintenance_date"
                    value={formData.maintenance_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Maintenance Type</label>
                  <input
                    type="text"
                    name="maintenance_type"
                    value={formData.maintenance_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Performed By</label>
                  <input
                    type="text"
                    name="performed_by"
                    value={formData.performed_by}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Status</label>
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Next Due Date</label>
                  <input
                    type="date"
                    name="next_due_date"
                    value={formData.next_due_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
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
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
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
              Are you sure you want to delete the maintenance record for{' '}
              <span className="font-semibold">{currentRecord?.aircraft_registration}</span> dated{' '}
              <span className="font-semibold">{currentRecord?.maintenance_date}</span>? This action cannot be undone.
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
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceRecordManagement;