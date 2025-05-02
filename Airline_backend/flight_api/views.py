# 5. Create the views.py file
# flight_api/views.py

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from .models import *
from .serializers import *

class AirportViewSet(viewsets.ModelViewSet):
    queryset = Airport.objects.all()
    serializer_class = AirportSerializer
    
    @action(detail=True, methods=['get'])
    def terminals(self, request, pk=None):
        airport = self.get_object()
        terminals = Terminal.objects.filter(airport=airport)
        serializer = TerminalSerializer(terminals, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def departing_flights(self, request, pk=None):
        airport = self.get_object()
        routes = Route.objects.filter(origin_airport=airport)
        schedules = FlightSchedule.objects.filter(route__in=routes)
        flights = Flight.objects.filter(schedule__in=schedules)
        serializer = FlightSerializer(flights, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def arriving_flights(self, request, pk=None):
        airport = self.get_object()
        routes = Route.objects.filter(destination_airport=airport)
        schedules = FlightSchedule.objects.filter(route__in=routes)
        flights = Flight.objects.filter(schedule__in=schedules)
        serializer = FlightSerializer(flights, many=True)
        return Response(serializer.data)

class TerminalViewSet(viewsets.ModelViewSet):
    queryset = Terminal.objects.all()
    serializer_class = TerminalSerializer

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    
    @action(detail=True, methods=['get'])
    def schedules(self, request, pk=None):
        route = self.get_object()
        schedules = FlightSchedule.objects.filter(route=route)
        serializer = FlightScheduleSerializer(schedules, many=True)
        return Response(serializer.data)

class AirlineViewSet(viewsets.ModelViewSet):
    queryset = Airline.objects.all()
    serializer_class = AirlineSerializer
    
    @action(detail=True, methods=['get'])
    def aircraft(self, request, pk=None):
        airline = self.get_object()
        aircraft = Aircraft.objects.filter(airline=airline)
        serializer = AircraftSerializer(aircraft, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def crew(self, request, pk=None):
        airline = self.get_object()
        crew = CrewMember.objects.filter(airline=airline)
        serializer = CrewMemberSerializer(crew, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def schedules(self, request, pk=None):
        airline = self.get_object()
        schedules = FlightSchedule.objects.filter(airline=airline)
        serializer = FlightScheduleSerializer(schedules, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def partners(self, request, pk=None):
        airline = self.get_object()
        partners1 = AirlinePartner.objects.filter(airline_id1=airline)
        partners2 = AirlinePartner.objects.filter(airline_id2=airline)
        serializer = AirlinePartnerSerializer(list(partners1) + list(partners2), many=True)
        return Response(serializer.data)

class AircraftViewSet(viewsets.ModelViewSet):
    queryset = Aircraft.objects.all()
    serializer_class = AircraftSerializer
    
    @action(detail=True, methods=['get'])
    def seat_configs(self, request, pk=None):
        aircraft = self.get_object()
        configs = AircraftSeatConfig.objects.filter(aircraft=aircraft)
        serializer = AircraftSeatConfigSerializer(configs, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def maintenance_records(self, request, pk=None):
        aircraft = self.get_object()
        records = MaintenanceRecord.objects.filter(aircraft=aircraft)
        serializer = MaintenanceRecordSerializer(records, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def flights(self, request, pk=None):
        aircraft = self.get_object()
        flights = Flight.objects.filter(aircraft=aircraft)
        serializer = FlightSerializer(flights, many=True)
        return Response(serializer.data)

class FlightScheduleViewSet(viewsets.ModelViewSet):
    queryset = FlightSchedule.objects.all()
    serializer_class = FlightScheduleSerializer
    
    @action(detail=True, methods=['get'])
    def flights(self, request, pk=None):
        schedule = self.get_object()
        flights = Flight.objects.filter(schedule=schedule)
        serializer = FlightSerializer(flights, many=True)
        return Response(serializer.data)

class FlightViewSet(viewsets.ModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    
    @action(detail=True, methods=['get'])
    def crew(self, request, pk=None):
        flight = self.get_object()
        crew = FlightCrew.objects.filter(flight=flight)
        serializer = FlightCrewSerializer(crew, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def tickets(self, request, pk=None):
        flight = self.get_object()
        tickets = Ticket.objects.filter(flight=flight)
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def service(self, request, pk=None):
        flight = self.get_object()
        try:
            service = InFlightService.objects.get(flight=flight)
            serializer = InFlightServiceSerializer(service)
            return Response(serializer.data)
        except InFlightService.DoesNotExist:
            return Response({"detail": "In-flight service not found"}, status=404)

class PassengerViewSet(viewsets.ModelViewSet):
    queryset = Passenger.objects.all()
    serializer_class = PassengerSerializer
    
    @action(detail=True, methods=['get'])
    def bookings(self, request, pk=None):
        passenger = self.get_object()
        bookings = Booking.objects.filter(passenger=passenger)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def tickets(self, request, pk=None):
        passenger = self.get_object()
        tickets = Ticket.objects.filter(passenger=passenger)
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def frequent_flyer(self, request, pk=None):
        passenger = self.get_object()
        ff_accounts = FrequentFlyer.objects.filter(passenger=passenger)
        serializer = FrequentFlyerSerializer(ff_accounts, many=True)
        return Response(serializer.data)

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    
    @action(detail=True, methods=['get'])
    def tickets(self, request, pk=None):
        booking = self.get_object()
        tickets = Ticket.objects.filter(booking=booking)
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def payments(self, request, pk=None):
        booking = self.get_object()
        payments = Payment.objects.filter(booking=booking)
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    
    @action(detail=True, methods=['get'])
    def baggage(self, request, pk=None):
        ticket = self.get_object()
        baggage = Baggage.objects.filter(ticket=ticket)
        serializer = BaggageSerializer(baggage, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def seat(self, request, pk=None):
        ticket = self.get_object()
        try:
            seat = SeatAssignment.objects.get(ticket=ticket)
            serializer = SeatAssignmentSerializer(seat)
            return Response(serializer.data)
        except SeatAssignment.DoesNotExist:
            return Response({"detail": "Seat assignment not found"}, status=404)
    
    @action(detail=True, methods=['get'])
    def special_requests(self, request, pk=None):
        ticket = self.get_object()
        requests = SpecialRequest.objects.filter(ticket=ticket)
        serializer = SpecialRequestSerializer(requests, many=True)
        return Response(serializer.data)

class TravelAgentViewSet(viewsets.ModelViewSet):
    queryset = TravelAgent.objects.all()
    serializer_class = TravelAgentSerializer
    
    @action(detail=True, methods=['get'])
    def bookings(self, request, pk=None):
        agent = self.get_object()
        bookings = Booking.objects.filter(travel_agent=agent)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

class FrequentFlyerViewSet(viewsets.ModelViewSet):
    queryset = FrequentFlyer.objects.all()
    serializer_class = FrequentFlyerSerializer

class MaintenanceRecordViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceRecord.objects.all()
    serializer_class = MaintenanceRecordSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class CustomerFeedbackViewSet(viewsets.ModelViewSet):
    queryset = CustomerFeedback.objects.all()
    serializer_class = CustomerFeedbackSerializer

class InFlightServiceViewSet(viewsets.ModelViewSet):
    queryset = InFlightService.objects.all()
    serializer_class = InFlightServiceSerializer

class BaggageViewSet(viewsets.ModelViewSet):
    queryset = Baggage.objects.all()
    serializer_class = BaggageSerializer

class SeatAssignmentViewSet(viewsets.ModelViewSet):
    queryset = SeatAssignment.objects.all()
    serializer_class = SeatAssignmentSerializer

class SpecialRequestViewSet(viewsets.ModelViewSet):
    queryset = SpecialRequest.objects.all()
    serializer_class = SpecialRequestSerializer

class AircraftSeatConfigViewSet(viewsets.ModelViewSet):
    queryset = AircraftSeatConfig.objects.all()
    serializer_class = AircraftSeatConfigSerializer

class FlightCrewViewSet(viewsets.ModelViewSet):
    queryset = FlightCrew.objects.all()
    serializer_class = FlightCrewSerializer

class CrewMemberViewSet(viewsets.ModelViewSet):
    queryset = CrewMember.objects.all()
    serializer_class = CrewMemberSerializer
    
    @action(detail=True, methods=['get'])
    def flight_assignments(self, request, pk=None):
        crew = self.get_object()
        assignments = FlightCrew.objects.filter(crew=crew)
        serializer = FlightCrewSerializer(assignments, many=True)
        return Response(serializer.data)

class AirlinePartnerViewSet(viewsets.ModelViewSet):
    queryset = AirlinePartner.objects.all()
    serializer_class = AirlinePartnerSerializer 