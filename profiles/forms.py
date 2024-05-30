from django import forms
from .models import Profile

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('default_phone_number', 'default_street_address1', 'default_street_address2', 
                  'default_town_or_city', 'default_county', 'default_postcode', 'default_country')
