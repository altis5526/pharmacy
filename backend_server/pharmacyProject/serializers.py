from rest_framework import serializers 
from pharmacyProject.models import pharmacyProject
 
 
class PharmacySerializer(serializers.ModelSerializer):
 
    class Meta:
        model = pharmacyProject
        fields = ('id',
                  'title',
                  'description',
                  'published')