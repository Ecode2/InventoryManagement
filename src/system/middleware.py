from django.utils.deprecation import MiddlewareMixin

class AllowIframeFromSameOrigin(MiddlewareMixin):
    def process_response(self, request, response):
        response['X-Frame-Options'] = 'SAMEORIGIN'
        return response
