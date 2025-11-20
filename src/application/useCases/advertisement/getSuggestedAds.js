const adRepository = require('../../../domain/repositories/adRepository');

const getSuggestedAds = async (searchString, limit = 5) => {
  try {
    if (!searchString || String(searchString).trim() === '') {
      return [];
    }

    const ads = await adRepository.findBySearchString(searchString, limit);

    // Return only the ad titles (trimmed strings)
    const titles = (ads || [])
      .map(a => (a && (a.adTitle || a.adTitle_ar || a.title) ? String(a.adTitle || a.adTitle_ar || a.title).trim() : ''))
      .filter(Boolean);

    return titles;
  } catch (err) {
    throw err;
  }
};

module.exports = getSuggestedAds;
