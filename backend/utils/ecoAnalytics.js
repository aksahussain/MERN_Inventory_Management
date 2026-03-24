const calculateEcoImpact = (product, quantity) => {
    // Simple calculation: carbon footprint * quantity
    // In a real app, this could be more complex (shipping distance, packaging, etc.)
    const footprintPerUnit = product.ecoConfig?.carbonFootprint || 0;

    if (product.ecoConfig?.recyclable) {
        // Discount impact if recyclable
        return (footprintPerUnit * quantity) * 0.8;
    }

    return footprintPerUnit * quantity;
};

module.exports = { calculateEcoImpact };
