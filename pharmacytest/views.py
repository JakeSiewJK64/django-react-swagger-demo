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

def home(_):
  return HttpResponse("hello, django")