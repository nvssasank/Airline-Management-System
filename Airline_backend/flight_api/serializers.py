
# from rest_framework import serializers
# from .models import *

# class AirportSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Airport
#         fields = '__all__'

# class TerminalSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Terminal
#         fields = '__all__'

# class RouteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Route
#         fields = '__all__'
        
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['origin_airport'] = AirportSerializer(instance.origin_airport).data
#         representation['destination_airport'] = AirportSerializer(instance.destination_airport).data
#         return representation

# class AirlineSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Airline
#         fields = '__all__'

# class AirlinePartnerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AirlinePartner
#         fields = '__all__'
        
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['airline_id1'] = AirlineSerializer(instance.airline_id1).data
#         representation['airline_id2'] = AirlineSerializer(instance.airline_id2).data
#         return representation

# class AircraftSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Aircraft
#         fields = '__all__'
        
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['airline'] = AirlineSerializer(instance.airline).data
#         return representation

# class AircraftSeatConfigSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AircraftSeatConfig
#         fields = '__all__'

# class FlightScheduleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FlightSchedule
#         fields = '__all__'
        
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['route'] = RouteSerializer(instance.route).data
#         representation['airline'] = AirlineSerializer(instance.airline).data
#         return representation

# class CrewMemberSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CrewMember
#         fields = '__all__'

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['airline'] = AirlineSerializer(instance.airline).data
#         return representation

# class FlightSerializer(serializers.ModelSerializer):
#     flight_number = serializers.CharField(source='schedule.flight_number', read_only=True)
#     aircraft_registration = serializers.CharField(source='aircraft.registration_number', read_only=True)

#     class Meta:
#         model = Flight
#         fields = '__all__'
        
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['schedule'] = FlightScheduleSerializer(instance.schedule).data
#         representation['aircraft'] = AircraftSerializer(instance.aircraft).data
#         return representation

# class FlightCrewSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FlightCrew
#         fields = '__all__'
        
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['crew'] = CrewMemberSerializer(instance.crew).data
#         return representation

# class PassengerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Passenger
#         fields = '__all__'

# class TravelAgentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TravelAgent
#         fields = '__all__'

# class FrequentFlyerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FrequentFlyer
#         fields = '__all__'
        
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['passenger'] = PassengerSerializer(instance.passenger).data
#         representation['airline'] = AirlineSerializer(instance.airline).data
#         return representation

# class BookingSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Booking
#         fields = '__all__'
        
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['passenger'] = PassengerSerializer(instance.passenger).data
#         if instance.travel_agent:
#             representation['travel_agent'] = TravelAgentSerializer(instance.travel_agent).data
#         return representation

# class MaintenanceRecordSerializer(serializers.ModelSerializer):
#     aircraft = serializers.PrimaryKeyRelatedField(queryset=Aircraft.objects.all())

#     class Meta:
#         model = MaintenanceRecord
#         fields = '__all__'

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['aircraft_registration'] = instance.aircraft.registration_number
#         representation['aircraft_details'] = AircraftSerializer(instance.aircraft).data
#         return representation

# class TicketSerializer(serializers.ModelSerializer):
#     flight_number = serializers.CharField(source='flight.schedule.flight_number', read_only=True)
#     passenger_name = serializers.SerializerMethodField()

#     class Meta:
#         model = Ticket
#         fields = '__all__'

#     def get_passenger_name(self, obj):
#         return f"{obj.passenger.first_name} {obj.passenger.last_name}"

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['booking'] = BookingSerializer(instance.booking).data
#         representation['flight'] = FlightSerializer(instance.flight).data
#         representation['passenger'] = PassengerSerializer(instance.passenger).data
#         return representation

# class PaymentSerializer(serializers.ModelSerializer):
#     booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True)

#     class Meta:
#         model = Payment
#         fields = '__all__'

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['booking'] = BookingSerializer(instance.booking).data
#         return representation

# class CustomerFeedbackSerializer(serializers.ModelSerializer):
#     passenger_name = serializers.SerializerMethodField()
#     flight_number = serializers.CharField(source='flight.schedule.flight_number', read_only=True)

#     class Meta:
#         model = CustomerFeedback
#         fields = '__all__'

#     def get_passenger_name(self, obj):
#         return f"{obj.passenger.first_name} {obj.passenger.last_name}"

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['passenger'] = PassengerSerializer(instance.passenger).data
#         representation['flight'] = FlightSerializer(instance.flight).data
#         return representation

# class InFlightServiceSerializer(serializers.ModelSerializer):
#     flight_number = serializers.CharField(source='flight.schedule.flight_number', read_only=True)

#     class Meta:
#         model = InFlightService
#         fields = '__all__'

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['flight'] = FlightSerializer(instance.flight).data
#         return representation

# class BaggageSerializer(serializers.ModelSerializer):
#     ticket_number = serializers.CharField(source='ticket.ticket_number', read_only=True)
#     passenger_name = serializers.SerializerMethodField()

#     class Meta:
#         model = Baggage
#         fields = '__all__'

#     def get_passenger_name(self, obj):
#         return f"{obj.ticket.passenger.first_name} {obj.ticket.passenger.last_name}"

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['ticket'] = TicketSerializer(instance.ticket).data
#         return representation

# class SeatAssignmentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = SeatAssignment
#         fields = '__all__'

# class SpecialRequestSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = SpecialRequest
#         fields = '__all__'
from rest_framework import serializers
from .models import *

class AirportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airport
        fields = '__all__'

class TerminalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Terminal
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['origin_airport'] = AirportSerializer(instance.origin_airport).data
        representation['destination_airport'] = AirportSerializer(instance.destination_airport).data
        return representation

class AirlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airline
        fields = '__all__'

class AirlinePartnerSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = AirlinePartner
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['airline_id1'] = AirlineSerializer(instance.airline_id1).data
        representation['airline_id2'] = AirlineSerializer(instance.airline_id2).data
        return representation

class AircraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aircraft
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['airline'] = AirlineSerializer(instance.airline).data
        return representation

# class AircraftSeatConfigSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AircraftSeatConfig
#         fields = '__all__'

class AircraftSeatConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = AircraftSeatConfig
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['aircraft'] = AircraftSerializer(instance.aircraft).data
        return representation

class FlightScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlightSchedule
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['route'] = RouteSerializer(instance.route).data
        representation['airline'] = AirlineSerializer(instance.airline).data
        return representation

class CrewMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrewMember
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['airline'] = AirlineSerializer(instance.airline).data
        return representation

class FlightSerializer(serializers.ModelSerializer):
    flight_number = serializers.CharField(source='schedule.flight_number', read_only=True)
    aircraft_registration = serializers.CharField(source='aircraft.registration_number', read_only=True)

    class Meta:
        model = Flight
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['schedule'] = FlightScheduleSerializer(instance.schedule).data
        representation['aircraft'] = AircraftSerializer(instance.aircraft).data
        return representation

class FlightCrewSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlightCrew
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['crew'] = CrewMemberSerializer(instance.crew).data
        return representation

class PassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = '__all__'

class TravelAgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelAgent
        fields = '__all__'

class FrequentFlyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrequentFlyer
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['passenger'] = PassengerSerializer(instance.passenger).data
        representation['airline'] = AirlineSerializer(instance.airline).data
        return representation

# class BookingSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Booking
#         fields = '__all__'
        
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['passenger'] = PassengerSerializer(instance.passenger).data
#         if instance.travel_agent:
#             representation['travel_agent'] = TravelAgentSerializer(instance.travel_agent).data
#         return representation
class BookingSerializer(serializers.ModelSerializer):
    passenger = PassengerSerializer(read_only=True)
    travel_agent = TravelAgentSerializer(read_only=True)
    passenger_id = serializers.PrimaryKeyRelatedField(
        queryset=Passenger.objects.all(), source='passenger', write_only=True
    )
    agent_id = serializers.PrimaryKeyRelatedField(
        queryset=TravelAgent.objects.all(), source='travel_agent', write_only=True, allow_null=True
    )

    class Meta:
        model = Booking
        fields = [
            'booking_id', 'booking_reference', 'passenger', 'passenger_id',
            'booking_date', 'booking_status', 'booking_source',
            'total_amount', 'currency', 'travel_agent', 'agent_id'
        ]

    def validate_currency(self, value):
        if len(value) != 3:
            raise serializers.ValidationError("Currency must be a 3-character code (e.g., USD).")
        return value

    def validate_total_amount(self, value):
        if value < 0:
            raise serializers.ValidationError("Total amount cannot be negative.")
        return value

class MaintenanceRecordSerializer(serializers.ModelSerializer):
    aircraft = serializers.PrimaryKeyRelatedField(queryset=Aircraft.objects.all())

    class Meta:
        model = MaintenanceRecord
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['aircraft_registration'] = instance.aircraft.registration_number
        representation['aircraft_details'] = AircraftSerializer(instance.aircraft).data
        return representation

class TicketSerializer(serializers.ModelSerializer):
    flight_number = serializers.CharField(source='flight.schedule.flight_number', read_only=True)
    passenger_name = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = '__all__'

    def get_passenger_name(self, obj):
        return f"{obj.passenger.first_name} {obj.passenger.last_name}"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['booking'] = BookingSerializer(instance.booking).data
        representation['flight'] = FlightSerializer(instance.flight).data
        representation['passenger'] = PassengerSerializer(instance.passenger).data
        return representation

class PaymentSerializer(serializers.ModelSerializer):
    booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['booking'] = BookingSerializer(instance.booking).data
        return representation

class CustomerFeedbackSerializer(serializers.ModelSerializer):
    passenger_name = serializers.SerializerMethodField()
    flight_number = serializers.CharField(source='flight.schedule.flight_number', read_only=True)

    class Meta:
        model = CustomerFeedback
        fields = '__all__'

    def get_passenger_name(self, obj):
        return f"{obj.passenger.first_name} {obj.passenger.last_name}"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['passenger'] = PassengerSerializer(instance.passenger).data
        representation['flight'] = FlightSerializer(instance.flight).data
        return representation

# class InFlightServiceSerializer(serializers.ModelSerializer):
#     flight_number = serializers.CharField(source='flight.schedule.flight_number', read_only=True)
#     flight = FlightSerializer(read_only=True)
#     flight_id = serializers.PrimaryKeyRelatedField(
#         queryset=Flight.objects.all(), source='flight', write_only=True
#     )

#     class Meta:
#         model = InFlightService
#         fields = '__all__'

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['flight'] = FlightSerializer(instance.flight).data
#         return representation
class InFlightServiceSerializer(serializers.ModelSerializer):
    flight_number = serializers.CharField(source='flight.schedule.flight_number', read_only=True)
    flight = FlightSerializer(read_only=True)
    flight_id = serializers.PrimaryKeyRelatedField(
        queryset=Flight.objects.all(), source='flight', write_only=True
    )

    class Meta:
        model = InFlightService
        fields = [
            'service_id',
            'flight',
            'flight_id',
            'flight_number',
            'meal_service',
            'entertainment_options',
            'special_services'
        ]

class BaggageSerializer(serializers.ModelSerializer):
    ticket_number = serializers.CharField(source='ticket.ticket_number', read_only=True)
    passenger_name = serializers.SerializerMethodField()

    class Meta:
        model = Baggage
        fields = '__all__'

    def get_passenger_name(self, obj):
        return f"{obj.ticket.passenger.first_name} {obj.ticket.passenger.last_name}"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['ticket'] = TicketSerializer(instance.ticket).data
        return representation

class SeatAssignmentSerializer(serializers.ModelSerializer):
    ticket_number = serializers.CharField(source='ticket.ticket_number', read_only=True)

    class Meta:
        model = SeatAssignment
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['ticket'] = TicketSerializer(instance.ticket).data
        return representation

class SpecialRequestSerializer(serializers.ModelSerializer):
    ticket_number = serializers.CharField(source='ticket.ticket_number', read_only=True)

    class Meta:
        model = SpecialRequest
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['ticket'] = TicketSerializer(instance.ticket).data
        return representation
    