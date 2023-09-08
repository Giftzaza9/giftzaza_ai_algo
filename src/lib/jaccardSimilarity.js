function jaccardSimilarity(conjuntoA, conjuntoB) {
    const interseccion = conjuntoA.filter(item => conjuntoB.includes(item));
    const union = [...new Set([...conjuntoA, ...conjuntoB])];
    const similitudJaccard = interseccion.length / union.length;
    return similitudJaccard;
}

module.exports = jaccardSimilarity