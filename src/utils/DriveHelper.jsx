// Ensure isExists function is defined and exported
export const isExists = (id, array) => {
    // Use Array.some() to check if any item matches the condition
    return array.some(item => item.id === id);
};


