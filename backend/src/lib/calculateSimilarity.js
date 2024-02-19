async function calculateSimilarity(userPrefernces, gpttags, producttags) {
  //   const commonElements = userPrefernces.filter((preference) => gpttags.includes(preference));
  //   return (commonElements.length / userPrefernces.length) * 100;
  const styles = [
    'Classic and timeless',
    'Comfortable yet stylish',
    'Premium brands',
    'Minimalistic',
    'Practical',
    'Chill',
    'Bougie',
  ];

  const interests = [
    'Tech and Gadgets',
    'Fitness and Wellness',
    'Fashion and Accessories',
    'Books and Learning',
    'Travel and Adventure',
    'Food and Cooking',
    'Arts and Crafts',
    'Music and Entertainment',
    'Outdoor and Nature',
    'Beauty and Self-Care',
    'Home and Decor',
    'Sports and Hobbies',
    'Pets and Animal Lovers',
    'Art and Culture',
    'Social Impact and Charity',
    'Spirituality',
  ];

  let Fproducttags = producttags.map((ptag) => ptag.toLowerCase());
  let FuserPrefernces = userPrefernces.preferences.map((utag) => utag.toLowerCase());
  let Finterests = interests.map((itag) => itag.toLowerCase());
  let FStyles = styles.map((stag) => stag.toLowerCase());
  let Frelationship = userPrefernces.relationship.toLowerCase();
  let FOccassion = userPrefernces.Occassion.toLowerCase();

  let relationshipPercentage = Fproducttags.includes(Frelationship) ? 100 : 0;
  let occasionPercentage = Fproducttags.includes(FOccassion) ? 100 : 0;

  let interestPercentage = 0;
  let stylePercentage = 0;
  let productStyles = FStyles.filter((item) => Fproducttags.includes(item));
  let userinterest = Finterests.filter((item) => FuserPrefernces.includes(item));
let userStyles = FStyles.filter((item) => FuserPrefernces.includes(item));
let productinterest = Finterests.filter((item) => Fproducttags.includes(item));
  for (let i = 0; i < FuserPrefernces.length; i++) {
    if (productStyles.includes(FuserPrefernces[i])) {
      stylePercentage += 100;
    } else if (productinterest.includes(FuserPrefernces[i])) {
      interestPercentage += 100;
    }
  }

  if (interestPercentage !== 0 && userinterest.length !== 0) {
    interestPercentage /= userinterest.length;
  }
  if (stylePercentage !== 0 && userStyles.length !== 0) {
    stylePercentage /= userStyles.length;
  }

  let overallPercentage =
    0.4 * occasionPercentage + 0.3 * relationshipPercentage + 0.2 * interestPercentage + 0.1 * stylePercentage;
  
  return overallPercentage;
}

module.exports = calculateSimilarity;
