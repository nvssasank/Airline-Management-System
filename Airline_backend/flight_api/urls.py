# 6. Create the urls.py file for your app
# flight_api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'airports', AirportViewSet)
router.register(r'terminals', TerminalViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'airlines', AirlineViewSet)
router.register(r'airline-partners', AirlinePartnerViewSet)
router.register(r'aircraft', AircraftViewSet)
router.register(r'aircraft-seat-configs', AircraftSeatConfigViewSet)
router.register(r'flight-schedules', FlightScheduleViewSet)
router.register(r'crew-members', CrewMemberViewSet)
router.register(r'flights', FlightViewSet)
router.register(r'flight-crews', FlightCrewViewSet)
router.register(r'passengers', PassengerViewSet)
router.register(r'travel-agents', TravelAgentViewSet)
router.register(r'frequent-flyers', FrequentFlyerViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'maintenance-records', MaintenanceRecordViewSet)
router.register(r'tickets', TicketViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'customer-feedback', CustomerFeedbackViewSet)
router.register(r'in-flight-services', InFlightServiceViewSet)
router.register(r'baggage', BaggageViewSet)
router.register(r'seat-assignments', SeatAssignmentViewSet)
router.register(r'special-requests', SpecialRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]