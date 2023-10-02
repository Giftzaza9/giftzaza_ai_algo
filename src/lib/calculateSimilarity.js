function calculateSimilarity(userPrefernces, productTags) {
    const commonElements = userPrefernces.filter(preference => productTags.includes(preference));
    return (commonElements.length / userPrefernces.length)*100;
}

module.exports = calculateSimilarity