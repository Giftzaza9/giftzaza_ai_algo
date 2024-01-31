function calculateSimilarity(userPrefernces, gpttags, producttags) {
  //   const commonElements = userPrefernces.filter((preference) => gpttags.includes(preference));
  //   return (commonElements.length / userPrefernces.length) * 100;

  let relationshipPercentage = gpttags[0].relationship.includes(userPrefernces.relationship) ? 100 : 0;
  let occasionPercentage = gpttags[0].occasion.includes(userPrefernces.Occassion) ? 100 : 0;

  
  let interestPercentage = 0;
  let stylePercentage = 0;
  let 
  for (let i = 0; i < userPrefernces.preferences.length; i++) {
    if (gpttags[0].style.includes(userPrefernces.preferences[i])) {
      stylePercentage += 100;
    }else if(gpttags[0].interest.includes(userPrefernces.preferences[i])){
      interestPercentage += 100;
    }
  }
  interestPercentage /= userPrefernces.preferences.length;
  stylePercentage /= userPrefernces.preferences.length;


  let overallPercentage = 0.4 * occasionPercentage + 0.3 * relationshipPercentage + 0.2 * interestPercentage + 0.1 * stylePercentage;

  return overallPercentage;
}

module.exports = calculateSimilarity;
