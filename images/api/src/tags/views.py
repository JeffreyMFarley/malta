from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

DEFAULT_TAGS = {
  'dimensions': [
    { 'Stack': [
      { 'UI': [ 'browser', 'desktop', 'visualization', 'charts' ]},
      { 'BI': [
        'reports', 'KPI', 'analytics', 'machine learning',
        'artificial intelligence' ]},
      { 'API': [ 'REST', 'RPC' ]},
      { 'Database': [ 'relational', 'warehouse', 'NoSQL', 'data lake' ]},
      { 'ETL': [ 'data extraction', 'data cleansing' ]},
      { 'Integration': [ 'CI/CD', 'orchestration' ]},
      { 'Security': [
        'authentication', 'authorization', 'encryption',
        'vulnerability scanning', 'intrusion detection'
      ]},
      { 'Platform': [
        'Windows', 'Linux', 'Mac'
      ]},
      { 'Infrastructure': [
        'IaaS', 'Cloud', 'containers'
      ]},
      { 'Policy': []}
    ]},
    { 'Tasks': [
      { 'start': []},
      { 'Project Management': [
        'agile', 'track budget', 'manage scope', 'meet schedule',
        'manage people', 'manage change', 'report status', 'waterfall'
      ]},
      { 'plan': [ 'analysis', 'requirements', 'user stories' ]},
      { 'design': [ 'ux', 'data modeling', 'architecture', 'solution' ]},
      { 'build': [ 'code', 'test', 'migrate' ]},
      { 'train': []},
      { 'operate': [
        'configure', 'release', 'monitor performance', 'service desk', 'maintain',
        'disaster recovery', 'identity management'
      ]},
      { 'close': []}
    ]}
  ]
}

# -----------------------------------------------------------------------------
# Header methods

def _buildHeaders():
    headers = {}
    # Local development requires CORS support
    if settings.DEBUG:
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'GET'
        }
    return headers

# -----------------------------------------------------------------------------
# Request Handlers: Complaints
@api_view(['GET'])
def index(request):
    data = DEFAULT_TAGS
    return Response(data, headers=_buildHeaders())
