# 3. Create the models.py file in the flight_api app
# flight_api/models.py

from django.db import models

class Airport(models.Model):
    airport_id = models.AutoField(primary_key=True)
    airport_name = models.CharField(max_length=100)
    airport_code = models.CharField(max_length=10, unique=True)
    city = models.CharField(max_length=50)
    country = models.CharField(max_length=50)
    latitude = models.DecimalField(max_digits=10, decimal_places=6)
    longitude = models.DecimalField(max_digits=10, decimal_places=6)
    timezone_offset = models.IntegerField()
    
    def __str__(self):
        return f"{self.airport_code} - {self.airport_name}"
    class Meta:
        managed = False  # Django won't create/manage this table
        db_table = 'airport'

class Terminal(models.Model):
    terminal_id = models.AutoField(primary_key=True)
    airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='terminals')
    terminal_name = models.CharField(max_length=50)
    distance_miles = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    terminal_number_code = models.CharField(max_length=10, null=True, blank=True)
    gate_count = models.IntegerField(null=True, blank=True)
    international = models.BooleanField()
    
    def __str__(self):
        return f"{self.airport.airport_code} - {self.terminal_name}"
    class Meta:
        managed = False  # Django won't create/manage this table
        db_table = 'terminal'

class Route(models.Model):
    route_id = models.AutoField(primary_key=True)
    origin_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='origin_routes')
    destination_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='destination_routes')
    
    def __str__(self):
        return f"{self.origin_airport.airport_code} to {self.destination_airport.airport_code}"
    class Meta:
        managed = False
        db_table = 'route'

class Airline(models.Model):
    airline_id = models.AutoField(primary_key=True)
    airline_name = models.CharField(max_length=100)
    airline_code = models.CharField(max_length=10, unique=True)
    headquarters = models.CharField(max_length=100)
    founding_date = models.DateField(null=True, blank=True)
    logo_url = models.CharField(max_length=255, null=True, blank=True)
    contact_info = models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return f"{self.airline_code} - {self.airline_name}"
    class Meta:
        managed = False
        db_table = 'airline'


class AirlinePartner(models.Model):
    partnership_id = models.AutoField(primary_key=True)
    airline_id1 = models.ForeignKey(Airline, on_delete=models.CASCADE, related_name='partnerships_as_first', db_column='airline_id1')
    airline_id2 = models.ForeignKey(Airline, on_delete=models.CASCADE, related_name='partnerships_as_second', db_column='airline_id2')
    partnership_type = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.airline_id1.airline_code} - {self.airline_id2.airline_code} ({self.partnership_type})"
    class Meta:
        managed = False
        db_table = 'airline_partner'

class Aircraft(models.Model):
    aircraft_id = models.AutoField(primary_key=True)
    airline = models.ForeignKey(Airline, on_delete=models.CASCADE, related_name='aircraft')
    registration_number = models.CharField(max_length=20, unique=True)
    model = models.CharField(max_length=50)
    manufacturer = models.CharField(max_length=50)
    status = models.CharField(max_length=20)
    manufacture_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.registration_number} - {self.model}"
    class Meta:
        managed = False
        db_table = 'aircraft'

class AircraftSeatConfig(models.Model):
    config_id = models.AutoField(primary_key=True)
    aircraft = models.ForeignKey(Aircraft, on_delete=models.CASCADE, related_name='seat_configs')
    class_type = models.CharField(max_length=20)
    seat_count = models.IntegerField()
    seat_pitch = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return f"{self.aircraft.registration_number} - {self.class_type}"
    class Meta:
        managed = False  # Django won't create/manage this table
        db_table = 'aircraft_seat_config'


class FlightSchedule(models.Model):
    schedule_id = models.AutoField(primary_key=True)
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='schedules')
    flight_number = models.CharField(max_length=20)
    airline = models.ForeignKey(Airline, on_delete=models.CASCADE, related_name='flight_schedules', db_column='airline')
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.flight_number} - {self.route}"
    class Meta:
        managed = False
        db_table = 'flight_schedule'

class CrewMember(models.Model):
    crew_id = models.AutoField(primary_key=True)
    airline = models.ForeignKey(Airline, on_delete=models.CASCADE, related_name='crew_members')
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    staff_id = models.CharField(max_length=20)
    position = models.CharField(max_length=50)
    hire_date = models.DateField()
    certification = models.CharField(max_length=100, null=True, blank=True)
    duty_hours = models.IntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.position}"
    class Meta:
        managed = False
        db_table = 'crew_member'

class Flight(models.Model):
    flight_id = models.AutoField(primary_key=True)
    schedule = models.ForeignKey(FlightSchedule, on_delete=models.CASCADE, related_name='flights')
    aircraft = models.ForeignKey(Aircraft, on_delete=models.CASCADE, related_name='flights')
    flight_date = models.DateField()
    actual_departure = models.DateTimeField(null=True, blank=True)
    actual_arrival = models.DateTimeField(null=True, blank=True)
    gate_departure = models.CharField(max_length=10, null=True, blank=True)
    gate_arrival = models.CharField(max_length=10, null=True, blank=True)
    flight_status = models.CharField(max_length=20)
    
    def __str__(self):
        return f"{self.schedule.flight_number} on {self.flight_date}"
    class Meta:
        managed = False  # Django won't create/manage this table
        db_table = 'flight'

class FlightCrew(models.Model):
    flight_crew_id = models.AutoField(primary_key=True)
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name='crews')
    crew = models.ForeignKey(CrewMember, on_delete=models.CASCADE, related_name='flight_assignments')
    role = models.CharField(max_length=50)
    
    def __str__(self):
        return f"{self.crew.last_name} - {self.flight}"
    class Meta:
        managed = False  # Django won't create/manage this table
        db_table = 'flight_crew'

class Passenger(models.Model):
    passenger_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    passport_expiry = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=50, null=True, blank=True)
    address2 = models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    class Meta:
        managed = False  # Django won't create/manage this table
        db_table = 'passenger'

class TravelAgent(models.Model):
    agent_id = models.AutoField(primary_key=True)
    agency_name = models.CharField(max_length=100)
    contact_person = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255, null=True, blank=True)
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    affiliate_from = models.DateField(null=True, blank=True)
    affiliate_to = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return self.agency_name
    class Meta:
        managed = False
        db_table = 'travel_agent'

class FrequentFlyer(models.Model):
    ff_id = models.AutoField(primary_key=True)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name='frequent_flyer_accounts')
    airline = models.ForeignKey(Airline, on_delete=models.CASCADE, related_name='frequent_flyers')
    membership_number = models.CharField(max_length=20)
    tier_status = models.CharField(max_length=20)
    join_date = models.DateField()
    tier_expiry = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.passenger.last_name} - {self.airline.airline_code}"
    class Meta:
        managed = False  # Django won't create/manage this table
        db_table = 'frequent_flyer'

class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    booking_reference = models.CharField(max_length=20, unique=True)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name='bookings')
    booking_date = models.DateTimeField()
    booking_status = models.CharField(max_length=20)
    booking_source = models.CharField(max_length=50)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3)
    travel_agent = models.ForeignKey(TravelAgent, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    
    def __str__(self):
        return f"{self.booking_reference} - {self.passenger.last_name}"
    class Meta:
        managed = False
        db_table = 'booking'

class MaintenanceRecord(models.Model):
    record_id = models.AutoField(primary_key=True)
    aircraft = models.ForeignKey(Aircraft, on_delete=models.CASCADE, related_name='maintenance_records')
    maintenance_date = models.DateField()
    maintenance_type = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)
    performed_by = models.CharField(max_length=100)
    status = models.CharField(max_length=20)
    next_due_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.aircraft.registration_number} - {self.maintenance_date}"
    class Meta:
        managed = False  # Django won't create/manage this table
        db_table = 'maintenance_record'

class Ticket(models.Model):
    ticket_id = models.AutoField(primary_key=True)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='tickets')
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name='tickets')
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name='tickets')
    ticket_number = models.CharField(max_length=20, unique=True)
    fare_class = models.CharField(max_length=10)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2)
    base_amount = models.DecimalField(max_digits=10, decimal_places=2)
    issue_date = models.DateTimeField()
    
    def __str__(self):
        return self.ticket_number
    class Meta:
        managed = False
        db_table = 'ticket'

class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    payment_status = models.CharField(max_length=20)
    payment_date = models.DateTimeField()
    transaction_reference = models.CharField(max_length=50, unique=True, null=True, blank=True)
    
    def __str__(self):
        return f"{self.booking.booking_reference} - {self.amount}"
    class Meta:
        managed = False  # Django won't create/manage this table
        db_table = 'payment'

class CustomerFeedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name='feedback')
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name='feedback')
    rating = models.IntegerField()
    comment = models.TextField(null=True, blank=True)
    submission_date = models.DateTimeField()
    
    def __str__(self):
        return f"{self.passenger.last_name} - {self.flight.schedule.flight_number}"
    class Meta:
        managed = False  # Django won't create/manage this table
        db_table = 'customer_feedback'

class InFlightService(models.Model):
    service_id = models.AutoField(primary_key=True)
    flight = models.OneToOneField(Flight, on_delete=models.CASCADE, related_name='service')
    meal_service = models.CharField(max_length=50, null=True, blank=True)
    entertainment_options = models.TextField(null=True, blank=True)
    special_services = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"Services for {self.flight}"
    class Meta:
        managed = False
        db_table = 'in_flight_service'

class Baggage(models.Model):
    baggage_id = models.AutoField(primary_key=True)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='baggage')
    baggage_tag = models.CharField(max_length=20)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    baggage_status = models.CharField(max_length=20)
    checked_bags_count = models.IntegerField()
    
    def __str__(self):
        return f"{self.baggage_tag} - {self.ticket.ticket_number}"
    class Meta:
        managed = False
        db_table = 'baggage'

class SeatAssignment(models.Model):
    assignment_id = models.AutoField(primary_key=True)
    ticket = models.OneToOneField(Ticket, on_delete=models.CASCADE, related_name='seat_assignment')
    seat_number = models.CharField(max_length=10)
    check_in_status = models.BooleanField(default=False)
    check_in_time = models.DateTimeField(null=True, blank=True)
    boarding_group = models.CharField(max_length=10, null=True, blank=True)
    
    def __str__(self):
        return f"{self.ticket.ticket_number} - {self.seat_number}"
    class Meta:
        managed = False
        db_table = 'seat_assignment'

class SpecialRequest(models.Model):
    request_id = models.AutoField(primary_key=True)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='special_requests')
    request_type = models.CharField(max_length=50)
    request_details = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20)
    
    def __str__(self):
        return f"{self.ticket.ticket_number} - {self.request_type}"
    class Meta:
        managed = False
        db_table = 'special_request'