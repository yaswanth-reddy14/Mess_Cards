from django.contrib import admin
from .models import Mess, Menu, MessPlan, PlanMenuItem

admin.site.register(Mess)
admin.site.register(Menu)
admin.site.register(MessPlan)
admin.site.register(PlanMenuItem)
