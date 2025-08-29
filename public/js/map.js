

async function initMap(listing) {
  const apiKey = mapToken; // your MapTiler API key

  // If listing has coordinates already, use them
  if (listing.geometry && listing.geometry.coordinates.length === 2) {
    showMap(listing.geometry.coordinates, listing.title);
    return;
  }

  // Otherwise, geocode the country name
  if (listing.country) {
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(listing.country)}.json?key=${apiKey}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;

        // Save it back (optional: update DB with coordinates later)
        listing.geometry = { type: "Point", coordinates: [lng, lat] };

        showMap([lng, lat], listing.title);
      } else {
        console.error("No coordinates found for:", listing.country);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  } else {
    console.error("Listing has no country name!");
  }
}

// Helper function to display map
function showMap(coords, title) {
  const map = new maplibregl.Map({
    container: "map",
    style: `https://api.maptiler.com/maps/streets/style.json?key=${mapToken}`,
    center: coords,
    zoom: 5,
  });

  map.addControl(new maplibregl.NavigationControl());

  new maplibregl.Marker({ color: "red" })
    .setLngLat(coords)
    .setPopup(
      new maplibregl.Popup({ offset: 25 }).setHTML(`
        <h3>${title}</h3>
        <p><em>Exact location will be provided after booking!</em></p>
      `)
    )
    .addTo(map);
}

// Call function
initMap(listing);
