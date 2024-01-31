function calculateSimilarity(userPrefernces, gpttags, producttags) {
  //   const commonElements = userPrefernces.filter((preference) => gpttags.includes(preference));
  //   return (commonElements.length / userPrefernces.length) * 100;

  let relationshipPercentage = gpttags[0].relationship.includes(userPrefernces.relationship) ? 100 : 0;
  let occasionPercentage = gpttags[0].occasion.includes(userPrefernces.Occassion) ? 100 : 0;

  let preferencePercentage = 0;
  for (let i = 0; i < userPrefernces.preferences.length; i++) {
    if (producttags.includes(userPrefernces.preferences[i])) {
      preferencePercentage += 100;
    }
  }
  preferencePercentage /= userPrefernces.preferences.length;

  overallPercentage = 0.4 * occasionPercentage + 0.3 * relationshipPercentage + 0.3 * preferencePercentage;

  return overallPercentage;
}

module.exports = calculateSimilarity;
