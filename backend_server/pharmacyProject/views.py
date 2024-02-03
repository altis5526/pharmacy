from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status
 
from pharmacyProject.models import pharmacyProject
from pharmacyProject.serializers import PharmacySerializer
from rest_framework.decorators import api_view


@api_view(['GET', 'POST', 'DELETE'])
def pharmacy_list(request):
    # GET list of tutorials, POST a new tutorial, DELETE all tutorials
    if request.method == 'GET':
        pharmacy= pharmacyProject.objects.all()
        
        title = request.GET.get('title', None)
        if title is not None:
            pharmacy = pharmacyProject.objects.filter(title__icontains=title)
        
        pharmacy_serializer = PharmacySerializer(pharmacy, many=True)
        return JsonResponse(pharmacy_serializer.data, safe=False)
        # 'safe=False' for objects serialization
    
    elif request.method == 'POST':
        pharmacy_data = JSONParser().parse(request)
        pharmacy_serializer = PharmacySerializer(data=pharmacy_data)
        if pharmacy_serializer.is_valid():
            pharmacy_serializer.save()
            return JsonResponse(pharmacy_serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(pharmacy_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        count = pharmacyProject.objects.all().delete()
        return JsonResponse({'message': '{} Pharmacies were deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)
 
 
@api_view(['GET', 'PUT', 'DELETE'])
def pharmacy_detail(request, pk):
    # find tutorial by pk (id)
    try: 
        pharmacy = pharmacyProject.objects.get(pk=pk) 
    except pharmacyProject.DoesNotExist: 
        return JsonResponse({'message': 'The pharmacy does not exist'}, status=status.HTTP_404_NOT_FOUND) 
 
    # GET / PUT / DELETE tutorial
    if request.method == 'GET': 
        pharmacy_serializer = PharmacySerializer(pharmacy) 
        return JsonResponse(pharmacy_serializer.data) 
    
    elif request.method == 'PUT': 
        pharmacy_data = JSONParser().parse(request) 
        pharmacy_serializer = PharmacySerializer(pharmacy, data=pharmacy_data) 
        if pharmacy_serializer.is_valid(): 
            pharmacy_serializer.save() 
            return JsonResponse(pharmacy_serializer.data) 
        return JsonResponse(pharmacy_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE': 
        pharmacy.delete() 
        return JsonResponse({'message': 'Pharmacy was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)

    
        
@api_view(['GET'])
def pharmacy_list_published(request):
    # GET all published tutorials
    pharmacy = pharmacyProject.objects.filter(published=True)
        
    if request.method == 'GET': 
        pharmacy_serializer = PharmacySerializer(pharmacy, many=True)
        return JsonResponse(pharmacy_serializer.data, safe=False)
