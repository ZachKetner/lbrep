from django.contrib import admin
from listings.models import Listing
from listings.models import Poi
from .forms import PoisForm

# Register your models here.

class PoisAdmin(admin.ModelAdmin):
    form = PoisForm

admin.site.register(Listing)
admin.site.register(Poi, PoisAdmin)