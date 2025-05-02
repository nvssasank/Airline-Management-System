// import { useState } from 'react'
// import AirportManagement from './Components/Airport'
// import RouteManagement from './Components/Route'
// import TerminalManagement from './Components/Terminal'
// import AirlineManagement from './Components/Airlines'
// import AirlinePartnerManagement from './Components/Airline_Partners'
// import AircraftManagement from './Components/Aircraft'
// import AircraftSeatConfigManagement from './Components/AircraftSeatConfig'
// import FlightScheduleManagement from './Components/FlightSchedule'
// import CrewMemberManagement from './Components/CrewMember'
// import FlightManagement from './Components/Flights'
// import FlightCrewManagement from './Components/FlightCrewMember'
// import PassengerManagement from './Components/Passengers'
// import TravelAgentManagement from './Components/TravelAgent'
// import FrequentFlyerManagement from './Components/FrequentFlyer'
// import BookingManagement from './Components/Bookings'
// import MaintenanceRecordManagement from './Components/MaintenanceRecord'
// import TicketsManagement from './Components/Tickets'
// import PaymentManagement from './Components/Payments'
// import CustomerFeedbackManagement from './Components/CustomerFeedback'
// import InFlightServicesManagement from './Components/InFlightService'
// import BaggageManagement from './Components/Baggage'
// import SeatAssignmentManagement from './Components/SeatAssignments'
// import SpecialRequestManagement from './Components/SpecialRequest'

// function App() {

//   return (
//     // <RouteManagement/>
//     <AirlinePartnerManagement/>//1
//     // <BaggageManagement/>
//     // <SeatAssignmentManagement/>
//     // <SpecialRequestManagement/>
//     // <InFlightServicesManagement/>
//     // <CustomerFeedbackManagement/>
//     // <PaymentManagement/>
//     // <TicketsManagement/>
//     // <MaintenanceRecordManagement/>
//     // <BookingManagement/>
//     // <FrequentFlyerManagement/>
//     // <TravelAgentManagement/>
//     // <PassengerManagement/>
//     // <FlightCrewManagement/>
//     // <FlightManagement/>
//     // <CrewMemberManagement/>
//     // <FlightScheduleManagement/>
//     // <AircraftSeatConfigManagement/>
//     // <AircraftManagement/>
//     // <AirlineManagement/>
//     // <TerminalManagement/>
//     // <AirportManagement/>
//   )
// }

// export default App
import { useState, lazy, Suspense } from 'react'

// Use lazy loading for components to improve initial load time
const AirportManagement = lazy(() => import('./Components/Airport'))
const RouteManagement = lazy(() => import('./Components/Route'))
const TerminalManagement = lazy(() => import('./Components/Terminal'))
const AirlineManagement = lazy(() => import('./Components/Airlines'))
const AirlinePartnerManagement = lazy(() => import('./Components/Airline_Partners'))
const AircraftManagement = lazy(() => import('./Components/Aircraft'))
const AircraftSeatConfigManagement = lazy(() => import('./Components/AircraftSeatConfig'))
const FlightScheduleManagement = lazy(() => import('./Components/FlightSchedule'))
const CrewMemberManagement = lazy(() => import('./Components/CrewMember'))
const FlightManagement = lazy(() => import('./Components/Flights'))
const FlightCrewManagement = lazy(() => import('./Components/FlightCrewMember'))
const PassengerManagement = lazy(() => import('./Components/Passengers'))
const TravelAgentManagement = lazy(() => import('./Components/TravelAgent'))
const FrequentFlyerManagement = lazy(() => import('./Components/FrequentFlyer'))
const BookingManagement = lazy(() => import('./Components/Bookings'))
const MaintenanceRecordManagement = lazy(() => import('./Components/MaintenanceRecord'))
const TicketsManagement = lazy(() => import('./Components/Tickets'))
const PaymentManagement = lazy(() => import('./Components/Payments'))
const CustomerFeedbackManagement = lazy(() => import('./Components/CustomerFeedback'))
const InFlightServicesManagement = lazy(() => import('./Components/InFlightService'))
const BaggageManagement = lazy(() => import('./Components/Baggage'))
const SeatAssignmentManagement = lazy(() => import('./Components/SeatAssignments'))
const SpecialRequestManagement = lazy(() => import('./Components/SpecialRequest'))

export default function App() {
  const [activeComponent, setActiveComponent] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Sidebar hidden by default
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Component mapping object
  const components = {
    dashboard: <Dashboard setActiveComponent={setActiveComponent} />,
    airport: <AirportManagement />,
    route: <RouteManagement />,
    terminal: <TerminalManagement />,
    airline: <AirlineManagement />,
    airlinePartner: <AirlinePartnerManagement />,
    aircraft: <AircraftManagement />,
    aircraftSeatConfig: <AircraftSeatConfigManagement />,
    flightSchedule: <FlightScheduleManagement />,
    crewMember: <CrewMemberManagement />,
    flight: <FlightManagement />,
    flightCrew: <FlightCrewManagement />,
    passenger: <PassengerManagement />,
    travelAgent: <TravelAgentManagement />,
    frequentFlyer: <FrequentFlyerManagement />,
    booking: <BookingManagement />,
    maintenanceRecord: <MaintenanceRecordManagement />,
    tickets: <TicketsManagement />,
    payment: <PaymentManagement />,
    customerFeedback: <CustomerFeedbackManagement />,
    inFlightService: <InFlightServicesManagement />,
    baggage: <BaggageManagement />,
    seatAssignment: <SeatAssignmentManagement />,
    specialRequest: <SpecialRequestManagement />
  }

  // Sidebar toggle handler
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
    if (isMobileMenuOpen) setIsMobileMenuOpen(false)
  }

  // Mobile menu toggle handler
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (!isMobileMenuOpen && !isSidebarOpen) setIsSidebarOpen(true)
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - hidden by default, shows when toggled */}
      <div 
        className={`
          fixed md:relative h-full z-30
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-0'}
          bg-indigo-900 text-white overflow-y-auto
        `}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">AirMS</h1>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-indigo-800 text-white"
            aria-label="Collapse sidebar"
          >
            ←
          </button>
        </div>
        <SidebarMenu 
          setActiveComponent={setActiveComponent} 
          activeComponent={activeComponent}
          isSidebarOpen={isSidebarOpen}
          closeMobileMenu={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Top navigation */}
        <nav className="bg-white shadow-sm p-4 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {/* Menu toggle button */}
              <button 
                className="p-2 rounded-full hover:bg-slate-100" 
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-800 truncate">
                  {activeComponent === 'dashboard' 
                    ? 'Dashboard' 
                    : activeComponent.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="p-2 pl-8 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-60"
                  aria-label="Search"
                />
                <svg className="absolute left-2 top-2.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <div className="relative">
                <button aria-label="Notifications" className="cursor-pointer p-2 rounded-full hover:bg-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </button>
                <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Component content */}
        <div className="p-4 sm:p-6 flex-1 overflow-auto">
          <Suspense fallback={
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
            </div>
          }>
            {components[activeComponent]}
          </Suspense>
        </div>
      </div>
    </div>
  )
}

// Sidebar Menu Component
function SidebarMenu({ setActiveComponent, activeComponent, isSidebarOpen, closeMobileMenu }) {
  // Menu items grouping
  const menuGroups = [
    {
      title: "Administration",
      items: [
        { id: "dashboard", label: "Dashboard", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        )},
        { id: "airport", label: "Airports", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        )},
        { id: "terminal", label: "Terminals", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        )},
        { id: "airline", label: "Airlines", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        )},
        { id: "airlinePartner", label: "Airline Partners", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        )}
      ]
    },
    {
      title: "Fleet Management",
      items: [
        { id: "aircraft", label: "Aircraft", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13"></path>
            <path d="M6 8l-4 4 4 4"></path>
            <path d="M2 12h20"></path>
          </svg>
        )},
        { id: "aircraftSeatConfig", label: "Seat Configurations", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        )},
        { id: "maintenanceRecord", label: "Maintenance", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
        )}
      ]
    },
    {
      title: "Flight Operations",
      items: [
        { id: "route", label: "Routes", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
            <line x1="8" y1="2" x2="8" y2="18"></line>
            <line x1="16" y1="6" x2="16" y2="22"></line>
          </svg>
        )},
        { id: "flightSchedule", label: "Flight Schedules", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        )},
        { id: "flight", label: "Flights", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
            <polygon points="12 15 17 21 7 21 12 15"></polygon>
          </svg>
        )},
        { id: "crewMember", label: "Crew Members", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        )},
        { id: "flightCrew", label: "Flight Crew", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        )}
      ]
    },
    {
      title: "Customer Management",
      items: [
        { id: "passenger", label: "Passengers", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        )},
        { id: "frequentFlyer", label: "Frequent Flyers", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        )},
        { id: "travelAgent", label: "Travel Agents", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        )},
        { id: "customerFeedback", label: "Feedback", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      ]
    },
    {
      title: "Booking & Services",
      items: [
        { id: "booking", label: "Bookings", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        )},
        { id: "tickets", label: "Tickets", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5v2"></path>
            <path d="M15 11v2"></path>
            <path d="M15 17v2"></path>
            <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"></path>
          </svg>
        )},
        { id: "payment", label: "Payments", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
        )},
        { id: "seatAssignment", label: "Seat Assignments", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        )},
        { id: "baggage", label: "Baggage", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="6" width="18" height="14" rx="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        )},
        { id: "specialRequest", label: "Special Requests", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        )},
        { id: "inFlightService", label: "In-Flight Services", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
        )}
      ]
    }
  ]

  const handleMenuItemClick = (id) => {
    setActiveComponent(id)
    closeMobileMenu() // Close mobile menu when an item is clicked
  }

  return (
    <nav className="mt-4 pb-20 overflow-y-auto max-h-screen space-y-4">
      {menuGroups.map((group, index) => (
        <div key={index} className="px-3">
          <h3 className="px-2 text-xs font-semibold uppercase text-indigo-300 mb-3">{group.title}</h3>
          <ul className="space-y-1">
            {group.items.map(item => (
              <li 
                key={item.id}
                className={`
                  rounded-md overflow-hidden
                  ${activeComponent === item.id ? 'bg-indigo-800' : 'hover:bg-indigo-800/60'}
                  transition-colors duration-150
                `}
              >
                <button
                  onClick={() => handleMenuItemClick(item.id)}
                  className="flex items-center w-full px-2 py-2 text-left"
                  aria-label={item.label}
                >
                  <span className="inline-flex items-center justify-center w-8 h-8">
                    {item.icon}
                  </span>
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

// Dashboard Component
function Dashboard({ setActiveComponent }) {
  const statCards = [
    { 
      title: "Active Flights", 
      value: "127", 
      change: "+12%", 
      trend: "up", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13"></path>
          <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
        </svg>
      ), 
      color: "bg-blue-600" 
    },
    { 
      title: "Today's Bookings", 
      value: "842", 
      change: "+24%", 
      trend: "up", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ), 
      color: "bg-emerald-600" 
    },
    { 
      title: "Active Aircraft", 
      value: "56", 
      change: "-5%", 
      trend: "down", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      ), 
      color: "bg-purple-600" 
    },
    { 
      title: "On-Duty Crew", 
      value: "183", 
      change: "+8%", 
      trend: "up", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ), 
      color: "bg-amber-600" 
    }
  ]

  const quickActions = [
    { id: "booking", label: "New Booking", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14"></path>
        <path d="M5 12h14"></path>
      </svg>
    )},
    { id: "flight", label: "Flight Status", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
      </svg>
    )},
    { id: "passenger", label: "Passenger Check-in", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <polyline points="17 11 19 13 23 9"></polyline>
      </svg>
    )},
    { id: "aircraft", label: "Aircraft Status", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.5 8.5l2-2 2 2-2 2-2-2z"></path>
        <path d="M6 11l2-2 2 2-2 2-2-2z"></path>
        <path d="M15.5 17.5l2-2 2 2-2 2-2-2z"></path>
        <path d="M4 22h16"></path>
        <path d="M10 22V4c0-1.1.9-2 2-2v0c1.1 0 2 .9 2 2v18"></path>
      </svg>
    )},
    { id: "payment", label: "Process Payment", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"></rect>
        <line x1="2" y1="10" x2="22" y2="10"></line>
      </svg>
    )},
    { id: "customerFeedback", label: "Customer Support", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    )}
  ]

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="overflow-hidden">
                <p className="text-gray-500 text-sm font-medium truncate">{card.title}</p>
                <h2 className="text-2xl sm:text-3xl font-bold mt-2">{card.value}</h2>
                <p className={`text-sm font-medium flex items-center mt-1 
                  ${card.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {card.trend === 'up' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                    </svg>
                  )}
                  {card.change}
                </p>
              </div>
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setActiveComponent(action.id)}
              className="flex flex-col items-center justify-center p-4 sm:p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100 hover:border-slate-200"
              aria-label={action.label}
            >
              <div className="text-indigo-700 mb-2">
                {action.icon}
              </div>
              <span className="text-xs sm:text-sm text-gray-700 text-center truncate w-full">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activities and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Activities</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-80">
            {[
              { time: "10:45 AM", action: "Flight BA-287 departed from Terminal 3", user: "System", avatar: "S", color: "bg-blue-600" },
              { time: "10:30 AM", action: "Passenger check-in completed for LH-391", user: "Jane Cooper", avatar: "JC", color: "bg-emerald-600" },
              { time: "10:15 AM", action: "New booking created for route JFK-LAX", user: "Michael Brown", avatar: "MB", color: "bg-purple-600" },
              { time: "09:58 AM", action: "Maintenance completed for Aircraft A320-214", user: "Robert Chen", avatar: "RC", color: "bg-amber-600" },
              { time: "09:45 AM", action: "Customer feedback submitted for Flight UA-124", user: "Emma Watson", avatar: "EW", color: "bg-pink-600" }
            ].map((activity, index) => (
              <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`${activity.color} w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3 flex-shrink-0`}>
                  {activity.avatar}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-gray-800 truncate font-medium">{activity.action}</p>
                  <div className="flex justify-between">
                    <p className="text-gray-500 text-sm truncate">by {activity.user}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Alerts & Notifications</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-80">
            {[
              { type: "warning", message: "Flight AA-453 delayed by 45 minutes due to weather", time: "11:00 AM", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )},
              { type: "error", message: "Maintenance required for Aircraft B737-824 before next flight", time: "10:28 AM", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )},
              { type: "info", message: "New schedule changes approved for next week", time: "09:15 AM", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )},
              { type: "success", message: "All crew members assigned for today's flights", time: "08:45 AM", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )},
              { type: "warning", message: "Terminal 2 Gate 7 requires technical support", time: "08:20 AM", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            ].map((alert, index) => (
              <div key={index} className={`
                flex items-center p-3 rounded-md
                ${alert.type === 'warning' ? 'bg-amber-50 text-amber-800' : ''}
                ${alert.type === 'error' ? 'bg-red-50 text-red-800' : ''}
                ${alert.type === 'info' ? 'bg-blue-50 text-blue-800' : ''}
                ${alert.type === 'success' ? 'bg-green-50 text-green-800' : ''}
              `}>
                <div className="mr-2 flex-shrink-0">
                  {alert.icon}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-medium">{alert.message}</p>
                  <p className="text-sm opacity-75">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}