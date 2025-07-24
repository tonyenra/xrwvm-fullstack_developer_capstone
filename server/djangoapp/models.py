# server/djangoapp/models.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# ---------- CarMake ----------
class CarMake(models.Model):
    name        = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    # Puedes agregar más campos opcionales (country, founded_year, etc.)

    def __str__(self):
        return self.name


# ---------- CarModel ----------
class CarModel(models.Model):
    car_make  = models.ForeignKey(CarMake, related_name='models', on_delete=models.CASCADE)
    dealer_id = models.IntegerField()  # ID del dealer en tu DB externa (Mongo/Cloudant)
    name      = models.CharField(max_length=100)

    # Tipos de auto
    SEDAN = 'SEDAN'
    SUV   = 'SUV'
    WAGON = 'WAGON'
    COUPE = 'COUPE'
    TRUCK = 'TRUCK'
    CAR_TYPES = [
        (SEDAN, 'Sedan'),
        (SUV,   'SUV'),
        (WAGON, 'Wagon'),
        (COUPE, 'Coupe'),
        (TRUCK, 'Truck'),
    ]
    type = models.CharField(max_length=10, choices=CAR_TYPES, default=SUV)

    # Año con validaciones pedidas (2015–2023)
    year = models.IntegerField(
        validators=[MinValueValidator(2015), MaxValueValidator(2023)]
    )

    color = models.CharField(max_length=30, blank=True)

    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.year})"
