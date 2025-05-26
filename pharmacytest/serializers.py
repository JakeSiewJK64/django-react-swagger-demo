from rest_framework import serializers
from .models import Medicine, Supplier

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['supplier_id', 'name', 'contact_email', 'phone_number', 'address']

class MedicineSerializer(serializers.ModelSerializer):
    supplier = SupplierSerializer(required=False)
    class Meta:
        model = Medicine
        fields = '__all__'  # Serialize all fields
