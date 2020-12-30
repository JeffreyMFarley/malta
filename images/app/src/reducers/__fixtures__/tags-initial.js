/* eslint-disable max-len */

module.exports = Object.freeze( {
  dimensions: [
    { Stack: [
      { UI: [ 'Browser', 'Desktop', 'Visualization', 'Charts' ]},
      { BI: [
        'Reports', 'KPI', 'Analytics', 'machine learning',
        'artificial intelligence', 'Map/Reduce' ]},
      { API: []},
      { Database: [ 'Relational', 'Warehouse' ]},
      { ETL: [ 'data extraction' ]},
      { Integration: [ 'CI/CD', 'orchestration' ]},
      { Security: [ 'authentication', 'authorization', 'encryption' ]},
      { Infrastructure: [ 'Windows', 'Linux', 'IaaS', 'Cloud', 'containers' ]},
      { Policy: []}
    ]},
    { Tasks: [
      { start: []},
      { 'Project Management': [
        'track budget', 'manage resources', 'agile', 'change management',
        'schedule', 'status'
      ]},
      { plan: [ 'analysis', 'requirements', 'user stories' ]},
      { design: [ 'ux', 'data modeling', 'architecture', 'solution' ]},
      { build: [ 'code', 'test', 'migrate' ]},
      { train: []},
      { operate: [
        'configure', 'release', 'monitor', 'service desk', 'maintain',
        'disaster recovery', 'identity management'
      ]},
      { close: []}
    ]}
  ]
} )
