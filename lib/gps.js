// Haversine formula to calculate distance between two GPS coordinates
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance; // Returns distance in kilometers
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Check if coordinates are within Maharashtra bounds
export function isInMaharashtra(lat, lon) {
  // Maharashtra approximate boundaries
  const MIN_LAT = 15.6;
  const MAX_LAT = 22.0;
  const MIN_LON = 72.6;
  const MAX_LON = 80.9;
  
  return lat >= MIN_LAT && lat <= MAX_LAT && lon >= MIN_LON && lon <= MAX_LON;
}

// Filter farmers within radius
export function filterFarmersWithinRadius(farmers, buyerLat, buyerLon, radiusKm = 10) {
  return farmers.filter(farmer => {
    if (!farmer.farmerProfile?.latitude || !farmer.farmerProfile?.longitude) {
      return false;
    }
    
    const distance = calculateDistance(
      buyerLat,
      buyerLon,
      farmer.farmerProfile.latitude,
      farmer.farmerProfile.longitude
    );
    
    return distance <= radiusKm;
  });
}