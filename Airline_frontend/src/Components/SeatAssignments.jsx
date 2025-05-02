// import React, { useState, useEffect } from 'react';
// import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

// const SeatAssignmentManagement = () => {
//   const [seatAssignments, setSeatAssignments] = useState([]);
//   const [filteredSeatAssignments, setFilteredSeatAssignments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentSeatAssignment, setCurrentSeatAssignment] = useState(null);
//   const [formData, setFormData] = useState({
//     ticket: '',
//     seat_number: '',
//     check_in_status: false,
//     check_in_time: '',
//     boarding_group: ''
//   });
  
//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [recordsPerPage] = useState(10);
  
//   // Fetch seat assignments from API
//   useEffect(() => {
//     const fetchSeatAssignments = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/api/seat-assignments/');
//         if (!response.ok) {
//           throw new Error('Failed to fetch seat assignments');
//         }
//         const data = await response.json();
//         setSeatAssignments(data);
//         setFilteredSeatAssignments(data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching seat assignments:', error);
//         setLoading(false);
//       }
//     };
    
//     fetchSeatAssignments();
//   }, []);
  
//   // Filter seat assignments based on search term
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredSeatAssignments(seatAssignments);
//     } else {
//       const results = seatAssignments.filter(record => 
//         record.ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         record.seat_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (record.boarding_group && record.boarding_group.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//       setFilteredSeatAssignments(results);
//     }
//     // Reset to first page when search changes
//     setCurrentPage(1);
//   }, [searchTerm, seatAssignments]);
  
//   // Get current records for pagination
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = filteredSeatAssignments.slice(indexOfFirstRecord, indexOfLastRecord);
//   const totalPages = Math.ceil(filteredSeatAssignments.length / recordsPerPage);
  
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };
  
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };
  
//   const handleAddClick = () => {
//     setFormData({
//       ticket: '',
//       seat_number: '',
//       check_in_status: false,
//       check_in_time: '',
//       boarding_group: ''
//     });
//     setShowAddModal(true);
//   };
  
//   const handleEditClick = (seatAssignment) => {
//     setCurrentSeatAssignment(seatAssignment);
//     setFormData({
//       ticket: seatAssignment.ticket.ticket_id,
//       seat_number: seatAssignment.seat_number,
//       check_in_status: seatAssignment.check_in_status,
//       check_in_time: seatAssignment.check_in_time || '',
//       boarding_group: seatAssignment.boarding_group || ''
//     });
//     setShowEditModal(true);
//   };
  
//   const handleDeleteClick = (seatAssignment) => {
//     setCurrentSeatAssignment(seatAssignment);
//     setShowDeleteModal(true);
//   };
  
//   const handleSubmitAdd = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const response = await fetch('http://localhost:8000/api/seat-assignments/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           check_in_time: formData.check_in_time || null,
//           boarding_group: formData.boarding_group || null
//         }),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to add seat assignment');
//       }
      
//       const newRecord = await response.json();
//       setSeatAssignments([...seatAssignments, newRecord]);
//       setShowAddModal(false);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error adding seat assignment:', error);
//       setLoading(false);
//     }
//   };
  
//   const handleSubmitEdit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const response = await fetch(`http://localhost:8000/api/seat-assignments/${currentSeatAssignment.assignment_id}/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           check_in_time: formData.check_in_time || null,
//           boarding_group: formData.boarding_group || null
//         }),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to update seat assignment');
//       }
      
//       const updatedRecord = await response.json();
//       setSeatAssignments(seatAssignments.map(record => 
//         record.assignment_id === updatedRecord.assignment_id ? updatedRecord : record
//       ));
//       setShowEditModal(false);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error updating seat assignment:', error);
//       setLoading(false);
//     }
//   };
  
//   const handleConfirmDelete = async () => {
//     setLoading(true);
    
//     try {
//       const response = await fetch(`http://localhost:8000/api/seat-assignments/${currentSeatAssignment.assignment_id}/`, {
//         method: 'DELETE',
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to delete seat assignment');
//       }
      
//       setSeatAssignments(seatAssignments.filter(record => record.assignment_id !== currentSeatAssignment.assignment_id));
//       setShowDeleteModal(false);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error deleting seat assignment:', error);
//       setLoading(false);
//     }
//   };
  
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
//   if (loading && seatAssignments.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Seat Assignment Management</h1>
      
//       {/* Search and Add Button */}
//       <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
//         <div className="relative flex items-center w-full md:w-2/3">
//           <Search className="absolute left-3 text-gray-400" size={20} />
//           <input
//             type="text"
//             placeholder="Search seat assignments by ticket number, seat number, or boarding group..."
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
//           <span>Add Seat Assignment</span>
//         </button>
//       </div>
      
//       {/* Table */}
//       <div className="overflow-x-auto shadow-md rounded-lg">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Ticket Number</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Seat Number</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Check-in Status</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Check-in Time</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Boarding Group</th>
//               <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {currentRecords.length > 0 ? (
//               currentRecords.map((record) => (
//                 <tr key={record.assignment_id} className="hover:bg-gray-50">
//                   <td className="py-3 px-4 font-medium">{record.ticket.ticket_number}</td>
//                   <td className="py-3 px-4">{record.seat_number}</td>
//                   <td className="py-3 px-4">{record.check_in_status ? 'Checked In' : 'Not Checked In'}</td>
//                   <td className="py-3 px-4">{record.check_in_time || 'N/A'}</td>
//                   <td className="py-3 px-4">{record.boarding_group || 'N/A'}</td>
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
//                 <td colSpan="6" className="py-8 text-center text-gray-500">
//                   No seat assignments found matching your search criteria
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
      
//       {/* Pagination */}
//       {filteredSeatAssignments.length > recordsPerPage && (
//         <div className="flex justify-between items-center mt-6">
//           <div className="text-sm text-gray-600">
//             Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredSeatAssignments.length)} of {filteredSeatAssignments.length} seat assignments
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => paginate(Math.max(1, currentPage - 1))}
//               disabled={currentPage === 1}
//               className={`flex items-center px-3 py-1 rounded border ${
//                 currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'
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
//                   if (idx > 0 && array[idx - 1] !== number - 1) {
//                     return (
//                       <React.Fragment key={`ellipsis-${number}`}>
//                         <span className="px-3 py-1 text-gray-400">...</span>
//                         <button
//                           onClick={() => paginate(number)}
//                           className={`px-3 py-1 rounded border ${
//                             currentPage === number ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
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
//                         currentPage === number ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
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
//                 currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'
//               }`}
//             >
//               <span className="mr-1">Next</span>
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>
//       )}
      
//       {/* Add Seat Assignment Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Add New Seat Assignment</h2>
//             <form onSubmit={handleSubmitAdd}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-gray-700 mb-1">Ticket ID</label>
//                   <input
//                     type="number"
//                     name="ticket"
//                     value={formData.ticket}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Seat Number</label>
//                   <input
//                     type="text"
//                     name="seat_number"
//                     value={formData.seat_number}
//                     onChange={handleInputChange}
//                     required
//                     maxLength={10}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Check-in Status</label>
//                   <input
//                     type="checkbox"
//                     name="check_in_status"
//                     checked={formData.check_in_status}
//                     onChange={handleInputChange}
//                     className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Check-in Time (Optional)</label>
//                   <input
//                     type="datetime-local"
//                     name="check_in_time"
//                     value={formData.check_in_time}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Boarding Group (Optional)</label>
//                   <input
//                     type="text"
//                     name="boarding_group"
//                     value={formData.boarding_group}
//                     onChange={handleInputChange}
//                     maxLength={10}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
//                   Add Seat Assignment
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
      
//       {/* Edit Seat Assignment Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Edit Seat Assignment</h2>
//             <form onSubmit={handleSubmitEdit}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-gray-700 mb-1">Ticket ID</label>
//                   <input
//                     type="number"
//                     name="ticket"
//                     value={formData.ticket}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Seat Number</label>
//                   <input
//                     type="text"
//                     name="seat_number"
//                     value={formData.seat_number}
//                     onChange={handleInputChange}
//                     required
//                     maxLength={10}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Check-in Status</label>
//                   <input
//                     type="checkbox"
//                     name="check_in_status"
//                     checked={formData.check_in_status}
//                     onChange={handleInputChange}
//                     className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Check-in Time (Optional)</label>
//                   <input
//                     type="datetime-local"
//                     name="check_in_time"
//                     value={formData.check_in_time}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Boarding Group (Optional)</label>
//                   <input
//                     type="text"
//                     name="boarding_group"
//                     value={formData.boarding_group}
//                     onChange={handleInputChange}
//                     maxLength={10}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
//               Are you sure you want to delete the seat assignment for ticket <span className="font-semibold">{currentSeatAssignment?.ticket.ticket_number}</span> (Seat: {currentSeatAssignment?.seat_number})? This action cannot be undone.
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

// export default SeatAssignmentManagement;
import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const SeatAssignmentManagement = () => {
  const [seatAssignments, setSeatAssignments] = useState([]);
  const [filteredSeatAssignments, setFilteredSeatAssignments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSeatAssignment, setCurrentSeatAssignment] = useState(null);
  const [formData, setFormData] = useState({
    ticket: '',
    seat_number: '',
    check_in_status: false,
    check_in_time: '',
    boarding_group: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  // Utility function to convert datetime-local to ISO 8601
  const toISODateTime = (dateTimeString) => {
    if (!dateTimeString) return null;
    return `${dateTimeString}:00Z`; // Append seconds and UTC timezone
  };

  // Fetch seat assignments and tickets from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [seatResponse, ticketResponse] = await Promise.all([
          fetch('http://localhost:8000/api/seat-assignments/'),
          fetch('http://localhost:8000/api/tickets/')
        ]);

        if (!seatResponse.ok || !ticketResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const seatData = await seatResponse.json();
        const ticketData = await ticketResponse.json();

        console.log('Seat Assignments Data:', JSON.stringify(seatData, null, 2));
        console.log('Tickets Data:', JSON.stringify(ticketData, null, 2));

        setSeatAssignments(seatData);
        setFilteredSeatAssignments(seatData);
        setTickets(ticketData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter seat assignments based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSeatAssignments(seatAssignments);
    } else {
      const results = seatAssignments.filter(record =>
        (record.ticket?.ticket_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.seat_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.boarding_group || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSeatAssignments(results);
    }
    setCurrentPage(1);
  }, [searchTerm, seatAssignments]);

  // Get current records for pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSeatAssignments.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredSeatAssignments.length / recordsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddClick = () => {
    if (tickets.length === 0) {
      alert('No tickets available. Please add a ticket first.');
      return;
    }
    setFormData({
      ticket: tickets[0]?.ticket_id || '',
      seat_number: '',
      check_in_status: false,
      check_in_time: '',
      boarding_group: ''
    });
    setShowAddModal(true);
  };

  const handleEditClick = (seatAssignment) => {
    setCurrentSeatAssignment(seatAssignment);
    setFormData({
      ticket: seatAssignment.ticket?.ticket_id || '',
      seat_number: seatAssignment.seat_number || '',
      check_in_status: seatAssignment.check_in_status || false,
      check_in_time: seatAssignment.check_in_time ? seatAssignment.check_in_time.slice(0, 16) : '',
      boarding_group: seatAssignment.boarding_group || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (seatAssignment) => {
    setCurrentSeatAssignment(seatAssignment);
    setShowDeleteModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    const ticketId = parseInt(formData.ticket);
    const payload = {
      ticket: ticketId,
      seat_number: formData.seat_number,
      check_in_status: formData.check_in_status,
      check_in_time: toISODateTime(formData.check_in_time),
      boarding_group: formData.boarding_group || null
    };

    if (!payload.ticket || !payload.seat_number) {
      alert('Please select a valid ticket and enter a seat number.');
      setLoading(false);
      return;
    }

    console.log('Add Seat Assignment Payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch('http://localhost:8000/api/seat-assignments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', JSON.stringify(errorData, null, 2));
        let errorMessage = 'Failed to add seat assignment.';
        if (errorData.ticket) {
          errorMessage = `Ticket error: ${errorData.ticket.join(', ')}`;
        } else {
          errorMessage = JSON.stringify(errorData, null, 2);
        }
        throw new Error(errorMessage);
      }

      const newRecord = await response.json();
      setSeatAssignments([...seatAssignments, newRecord]);
      setFilteredSeatAssignments([...seatAssignments, newRecord]);
      setShowAddModal(false);
      setLoading(false);
      alert('Seat assignment added successfully!');
    } catch (error) {
      console.error('Error adding seat assignment:', error);
      alert('Failed to add seat assignment: ' + error.message);
      setLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const ticketId = parseInt(formData.ticket);
    const payload = {
      ticket: ticketId,
      seat_number: formData.seat_number,
      check_in_status: formData.check_in_status,
      check_in_time: toISODateTime(formData.check_in_time),
      boarding_group: formData.boarding_group || null
    };

    if (!payload.ticket || !payload.seat_number) {
      alert('Please select a valid ticket and enter a seat number.');
      setLoading(false);
      return;
    }

    console.log('Edit Seat Assignment Payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(`http://localhost:8000/api/seat-assignments/${currentSeatAssignment.assignment_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', JSON.stringify(errorData, null, 2));
        let errorMessage = 'Failed to update seat assignment.';
        if (errorData.ticket) {
          errorMessage = `Ticket error: ${errorData.ticket.join(', ')}`;
        } else {
          errorMessage = JSON.stringify(errorData, null, 2);
        }
        throw new Error(errorMessage);
      }

      const updatedRecord = await response.json();
      setSeatAssignments(seatAssignments.map(record =>
        record.assignment_id === updatedRecord.assignment_id ? updatedRecord : record
      ));
      setFilteredSeatAssignments(seatAssignments.map(record =>
        record.assignment_id === updatedRecord.assignment_id ? updatedRecord : record
      ));
      setShowEditModal(false);
      setLoading(false);
      alert('Seat assignment updated successfully!');
    } catch (error) {
      console.error('Error updating seat assignment:', error);
      alert('Failed to update seat assignment: ' + error.message);
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/seat-assignments/${currentSeatAssignment.assignment_id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', JSON.stringify(errorData, null, 2));
        throw new Error(JSON.stringify(errorData, null, 2));
      }

      setSeatAssignments(seatAssignments.filter(record => record.assignment_id !== currentSeatAssignment.assignment_id));
      setFilteredSeatAssignments(filteredSeatAssignments.filter(record => record.assignment_id !== currentSeatAssignment.assignment_id));
      setShowDeleteModal(false);
      setLoading(false);
      alert('Seat assignment deleted successfully!');
    } catch (error) {
      console.error('Error deleting seat assignment:', error);
      alert('Failed to delete seat assignment: ' + error.message);
      setLoading(false);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && seatAssignments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Seat Assignment Management</h1>

      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <Search className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search seat assignments by ticket number, seat number, or boarding group..."
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
          <span>Add Seat Assignment</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Ticket Number</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Seat Number</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Check-in Status</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Check-in Time</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Boarding Group</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentRecords.length > 0 ? (
              currentRecords.map((record) => (
                <tr key={record.assignment_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{record.ticket?.ticket_number || 'N/A'}</td>
                  <td className="py-3 px-4">{record.seat_number || 'N/A'}</td>
                  <td className="py-3 px-4">{record.check_in_status ? 'Checked In' : 'Not Checked In'}</td>
                  <td className="py-3 px-4">{record.check_in_time ? record.check_in_time.slice(0, 16) : 'N/A'}</td>
                  <td className="py-3 px-4">{record.boarding_group || 'N/A'}</td>
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
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No seat assignments found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredSeatAssignments.length > recordsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredSeatAssignments.length)} of {filteredSeatAssignments.length} seat assignments
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`flex items-center px-3 py-1 rounded border ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'
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
                            currentPage === number ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
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
                        currentPage === number ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
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
                currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-1">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Add Seat Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Seat Assignment</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Ticket</label>
                  <select
                    name="ticket"
                    value={formData.ticket}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Ticket</option>
                    {tickets.map(ticket => (
                      <option key={ticket.ticket_id} value={ticket.ticket_id}>
                        {ticket.ticket_number}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Seat Number</label>
                  <input
                    type="text"
                    name="seat_number"
                    value={formData.seat_number}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Check-in Status</label>
                  <input
                    type="checkbox"
                    name="check_in_status"
                    checked={formData.check_in_status}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Check-in Time (Optional)</label>
                  <input
                    type="datetime-local"
                    name="check_in_time"
                    value={formData.check_in_time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Boarding Group (Optional)</label>
                  <input
                    type="text"
                    name="boarding_group"
                    value={formData.boarding_group}
                    onChange={handleInputChange}
                    maxLength={10}
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
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Add Seat Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Seat Assignment Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Seat Assignment</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Ticket</label>
                  <select
                    name="ticket"
                    value={formData.ticket}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Ticket</option>
                    {tickets.map(ticket => (
                      <option key={ticket.ticket_id} value={ticket.ticket_id}>
                        {ticket.ticket_number}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Seat Number</label>
                  <input
                    type="text"
                    name="seat_number"
                    value={formData.seat_number}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Check-in Status</label>
                  <input
                    type="checkbox"
                    name="check_in_status"
                    checked={formData.check_in_status}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Check-in Time (Optional)</label>
                  <input
                    type="datetime-local"
                    name="check_in_time"
                    value={formData.check_in_time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Boarding Group (Optional)</label>
                  <input
                    type="text"
                    name="boarding_group"
                    value={formData.boarding_group}
                    onChange={handleInputChange}
                    maxLength={10}
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
              Are you sure you want to delete the seat assignment for ticket <span className="font-semibold">{currentSeatAssignment?.ticket?.ticket_number || 'N/A'}</span> (Seat: {currentSeatAssignment?.seat_number || 'N/A'})? This action cannot be undone.
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

export default SeatAssignmentManagement;