from django.urls import re_path
from pharmacyProject import views 
 
urlpatterns = [ 
    re_path(r'^api/pharmacy$', views.pharmacy_list),
    re_path(r'^api/pharmacy/(?P<pk>[0-9]+)$', views.pharmacy_detail),
    re_path(r'^api/pharmacy/published$', views.pharmacy_list_published)
]