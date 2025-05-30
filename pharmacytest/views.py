from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from drf_spectacular.utils import extend_schema
from .models import Medicine
from .serializers import MedicineSerializer, CreateMedicineSerializer

@extend_schema(
    summary="Get all medicines",
    description="Retrieves a list of all available medicines",
    responses={200: MedicineSerializer(many=True)}
)
@api_view(['GET'])
def get_medicines(_):
  medicines = Medicine.objects.all()
  serializer = MedicineSerializer(medicines, many=True)
  return Response(serializer.data)

@extend_schema(
    summary="Create a new medicine",
    description="Accepts medicine details in the request body and saves a new medicine entry.",
    request=CreateMedicineSerializer,  # This is correct
    responses={201: MedicineSerializer, 400: "Bad Request"},
)
@api_view(['POST'])
def create_medicines(request):
  data = request.data
  Medicine.objects.create(**data)
  return Response(data, status=200)

@extend_schema(
    summary="Deletes a medicine by id",
)
@api_view(['DELETE'])
def delete_medicine(_, pk: int):
  try:
    medicine = Medicine.objects.get(medicine_id=pk)
  except:
    return Response({"error": "Medicine not found"}, status=404)
  
  medicine.delete()

  return Response("Successfully deleted medicine of id {pk}.".format(pk=pk), status=200)

def home(_):
  return HttpResponse("hello, django")