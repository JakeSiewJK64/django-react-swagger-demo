import csv
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from .models import Medicine
from .serializers import MedicineSerializer, CreateMedicineSerializer

@extend_schema(
    summary="Get all medicines",
    description="Retrieves a list of all available medicines. You can filter by name using the 'name' query parameter.",
    responses={200: MedicineSerializer(many=True)},
    parameters=[
        OpenApiParameter(
            name='name',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            required=False,
            description='Filter medicines by name (case-insensitive, partial match)'
        )
    ]
)
@api_view(['GET'])
def get_medicines(request):
  name_query = request.query_params.get('name', None)

  if name_query:
    medicines = Medicine.objects.filter(name__icontains=name_query)
  else:
    medicines = Medicine.objects.all()
  
  serializer = MedicineSerializer(medicines, many=True)
  return Response(serializer.data)

@extend_schema(
    summary="Exprt all medicines to csv",
    responses={200: OpenApiTypes.STR},
    parameters=[
        OpenApiParameter(
            name='name',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            required=False,
            description='Filter medicines by name (case-insensitive, partial match)'
        )
    ]
)
@api_view(["GET"])
def export_medicines_csv(request):
  name_query = request.query_params.get('name', None)

  if name_query:
    medicines = Medicine.objects.filter(name__icontains=name_query)
  else:
    medicines = Medicine.objects.all()
  
  response = HttpResponse(content_type='text/csv')
  response['Content-Disposition'] = 'attachment; filename="medicines_export.csv"'
  
  writer = csv.writer(response)
  writer.writerow(['ID', 'Name', 'Brand', 'Price', 'Expiry date'])

  for medicine in medicines:
    writer.writerow([medicine.medicine_id, medicine.name, medicine.brand, medicine.price, medicine.expiry_date])

  return response

@extend_schema(
    summary="Create a new medicine",
    description="Accepts medicine details in the request body and saves a new medicine entry.",
    request=CreateMedicineSerializer,
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