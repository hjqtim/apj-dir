const locationImg = require('../public/assets/images/location.jpg');
// const InstitutionLocationImg = require('../public/assets/images/InstitutionLocation.jpg');
// const NetworkLocationImg = require('../public/assets/images/NetworkLocation.jpg');

const locationTypes = [
  { label: 'Location', to: '/locations', img: locationImg }
  // { label: 'Institution Location', to: '/institutions', img: InstitutionLocationImg },
  // { label: 'Network Location', to: '/network-locations', img: NetworkLocationImg }
];

const elementTypes = [
  { label: 'Cluster', to: '/clusters' },
  // { label: 'Institution', to: '/institutions' },
  { label: 'Category', to: '/categories' },
  // { label: 'Site', to: '/sites' },
  // { label: 'Building Zone', to: '/building-zones' },
  // { label: 'Building', to: '/buildings' },
  // { label: 'Floor Zone', to: '/floor-zones' },
  // { label: 'Floor', to: '/floors' },
  // { label: 'Room', to: '/rooms' },
  { label: 'Status', to: '/statuses' }
];

exports.locationTypes = locationTypes;
exports.elementTypes = elementTypes;
