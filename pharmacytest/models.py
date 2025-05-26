from django.db import models

class Supplier(models.Model):
    supplier_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    contact_email = models.EmailField()
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    address = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class Medicine(models.Model):
    medicine_id = models.AutoField(primary_key=True)  # Auto-increment ID
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255)
    expiry_date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField()
    meta_data = models.JSONField(null=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='medicines', null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.brand})"
