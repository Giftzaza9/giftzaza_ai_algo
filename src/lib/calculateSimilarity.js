function calculateSimilarity(userPrefernces, gpttags, producttags) {
  //   const commonElements = userPrefernces.filter((preference) => gpttags.includes(preference));
  //   return (commonElements.length / userPrefernces.length) * 100;
  const styles = [
    'Classic and Timeless',
    'Comfortable Yet Stylish',
    'Premium Brands',
    'Minimalistic',
    'Practical',
    'Chill',
    'Bougie',
  ];

  let relationshipPercentage = producttags.includes(userPrefernces.relationship) ? 100 : 0;
  let occasionPercentage = producttags.includes(userPrefernces.Occassion) ? 100 : 0;

  let interestPercentage = 0;
  let stylePercentage = 0;

  for (let i = 0; i < userPrefernces.preferences.length; i++) {
    if (producttags.includes(userPrefernces.preferences[i])) {
      stylePercentage += 100;
    } else if (producttags.includes(userPrefernces.preferences[i])) {
      interestPercentage += 100;
    }
  }
  let productStyles = styles.filter((item) => producttags.include(item));
  let productinterest = styles.filter((item) => !producttags.include(item));
  interestPercentage /= productinterest.length;
  stylePercentage /= productStyles.length;

  let overallPercentage =
    0.4 * occasionPercentage + 0.3 * relationshipPercentage + 0.2 * interestPercentage + 0.1 * stylePercentage;

  return overallPercentage;
}

module.exports = calculateSimilarity;
