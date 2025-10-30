export const validateForm = (formData, file) => {
    const errors = {};

    if (!formData.user_category_main) {
        errors.user_category_main = 'User main category is required.';
    }

    if (!formData.category_type) {
        errors.category_type = 'Category type is required.';
    }

    if (!formData.sub_category_type) {
        errors.sub_category_type = 'Sub-category type is required.';
    }

    if (!file) {
        errors.file = 'File is required.';
    } else if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        errors.file = 'Only Excel files are supported.';
    }

    return errors;
};

export const validateSubCategorySelection = (formData) => {
    const errors = {};

    if (!formData.category_type) {
        errors.category_type = 'Please select a category type first.';
    }

    return errors;
};