const logger = require('./logger');

/**
 * Filter Utilities
 * Handles data filtering logic based on user-defined rules
 */
class FilterUtils {
    /**
     * Apply filters to extracted data
     * @param {Object} data - Extracted webhook data
     * @param {Array} filters - Array of filter rules
     * @returns {Object} { passed: boolean, reason: string }
     */
    static applyFilters(data, filters) {
        if (!filters || filters.length === 0) {
            return { passed: true, reason: 'No filters configured' };
        }

        for (const filter of filters) {
            const result = this.applyFilter(data, filter);
            if (!result.passed) {
                return result;
            }
        }

        return { passed: true, reason: 'All filters passed' };
    }

    /**
     * Apply a single filter rule
     * @param {Object} data - Data to filter
     * @param {Object} filter - Filter rule { field, op, value }
     * @returns {Object} { passed: boolean, reason: string }
     */
    static applyFilter(data, filter) {
        const { field, op, value } = filter;
        const fieldValue = data[field];

        logger.debug(`Applying filter: ${field} ${op} ${value} (actual: ${fieldValue})`);

        // Check if field exists in data
        if (fieldValue === undefined || fieldValue === null) {
            return {
                passed: false,
                reason: `Field '${field}' not found in data`
            };
        }

        // Apply operator
        switch (op) {
            case '=':
            case '==':
            case 'equals':
                return this.compareEquals(fieldValue, value, field);
            
            case '!=':
            case 'not_equals':
                return this.compareNotEquals(fieldValue, value, field);
            
            case 'contains':
                return this.compareContains(fieldValue, value, field);
            
            case 'not_contains':
                return this.compareNotContains(fieldValue, value, field);
            
            case 'starts_with':
                return this.compareStartsWith(fieldValue, value, field);
            
            case 'ends_with':
                return this.compareEndsWith(fieldValue, value, field);
            
            case '>':
            case 'greater_than':
                return this.compareGreaterThan(fieldValue, value, field);
            
            case '<':
            case 'less_than':
                return this.compareLessThan(fieldValue, value, field);
            
            case '>=':
            case 'greater_equal':
                return this.compareGreaterEqual(fieldValue, value, field);
            
            case '<=':
            case 'less_equal':
                return this.compareLessEqual(fieldValue, value, field);
            
            case 'in':
                return this.compareIn(fieldValue, value, field);
            
            case 'not_in':
                return this.compareNotIn(fieldValue, value, field);
            
            case 'regex':
                return this.compareRegex(fieldValue, value, field);
            
            default:
                return {
                    passed: false,
                    reason: `Unknown operator: ${op}`
                };
        }
    }

    static compareEquals(fieldValue, filterValue, field) {
        const passed = String(fieldValue).toLowerCase() === String(filterValue).toLowerCase();
        return {
            passed,
            reason: passed ? `${field} equals ${filterValue}` : `${field} "${fieldValue}" does not equal "${filterValue}"`
        };
    }

    static compareNotEquals(fieldValue, filterValue, field) {
        const passed = String(fieldValue).toLowerCase() !== String(filterValue).toLowerCase();
        return {
            passed,
            reason: passed ? `${field} does not equal ${filterValue}` : `${field} "${fieldValue}" equals "${filterValue}"`
        };
    }

    static compareContains(fieldValue, filterValue, field) {
        const passed = String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
        return {
            passed,
            reason: passed ? `${field} contains ${filterValue}` : `${field} "${fieldValue}" does not contain "${filterValue}"`
        };
    }

    static compareNotContains(fieldValue, filterValue, field) {
        const passed = !String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
        return {
            passed,
            reason: passed ? `${field} does not contain ${filterValue}` : `${field} "${fieldValue}" contains "${filterValue}"`
        };
    }

    static compareStartsWith(fieldValue, filterValue, field) {
        const passed = String(fieldValue).toLowerCase().startsWith(String(filterValue).toLowerCase());
        return {
            passed,
            reason: passed ? `${field} starts with ${filterValue}` : `${field} "${fieldValue}" does not start with "${filterValue}"`
        };
    }

    static compareEndsWith(fieldValue, filterValue, field) {
        const passed = String(fieldValue).toLowerCase().endsWith(String(filterValue).toLowerCase());
        return {
            passed,
            reason: passed ? `${field} ends with ${filterValue}` : `${field} "${fieldValue}" does not end with "${filterValue}"`
        };
    }

    static compareGreaterThan(fieldValue, filterValue, field) {
        const numField = parseFloat(fieldValue);
        const numFilter = parseFloat(filterValue);
        
        if (isNaN(numField) || isNaN(numFilter)) {
            return {
                passed: false,
                reason: `Cannot compare non-numeric values: ${fieldValue} > ${filterValue}`
            };
        }
        
        const passed = numField > numFilter;
        return {
            passed,
            reason: passed ? `${field} (${numField}) > ${numFilter}` : `${field} (${numField}) <= ${numFilter}`
        };
    }

    static compareLessThan(fieldValue, filterValue, field) {
        const numField = parseFloat(fieldValue);
        const numFilter = parseFloat(filterValue);
        
        if (isNaN(numField) || isNaN(numFilter)) {
            return {
                passed: false,
                reason: `Cannot compare non-numeric values: ${fieldValue} < ${filterValue}`
            };
        }
        
        const passed = numField < numFilter;
        return {
            passed,
            reason: passed ? `${field} (${numField}) < ${numFilter}` : `${field} (${numField}) >= ${numFilter}`
        };
    }

    static compareGreaterEqual(fieldValue, filterValue, field) {
        const numField = parseFloat(fieldValue);
        const numFilter = parseFloat(filterValue);
        
        if (isNaN(numField) || isNaN(numFilter)) {
            return {
                passed: false,
                reason: `Cannot compare non-numeric values: ${fieldValue} >= ${filterValue}`
            };
        }
        
        const passed = numField >= numFilter;
        return {
            passed,
            reason: passed ? `${field} (${numField}) >= ${numFilter}` : `${field} (${numField}) < ${numFilter}`
        };
    }

    static compareLessEqual(fieldValue, filterValue, field) {
        const numField = parseFloat(fieldValue);
        const numFilter = parseFloat(filterValue);
        
        if (isNaN(numField) || isNaN(numFilter)) {
            return {
                passed: false,
                reason: `Cannot compare non-numeric values: ${fieldValue} <= ${filterValue}`
            };
        }
        
        const passed = numField <= numFilter;
        return {
            passed,
            reason: passed ? `${field} (${numField}) <= ${numFilter}` : `${field} (${numField}) > ${numFilter}`
        };
    }

    static compareIn(fieldValue, filterValue, field) {
        // filterValue should be an array
        const values = Array.isArray(filterValue) ? filterValue : [filterValue];
        const passed = values.some(val => String(fieldValue).toLowerCase() === String(val).toLowerCase());
        return {
            passed,
            reason: passed ? `${field} is in [${values.join(', ')}]` : `${field} "${fieldValue}" is not in [${values.join(', ')}]`
        };
    }

    static compareNotIn(fieldValue, filterValue, field) {
        // filterValue should be an array
        const values = Array.isArray(filterValue) ? filterValue : [filterValue];
        const passed = !values.some(val => String(fieldValue).toLowerCase() === String(val).toLowerCase());
        return {
            passed,
            reason: passed ? `${field} is not in [${values.join(', ')}]` : `${field} "${fieldValue}" is in [${values.join(', ')}]`
        };
    }

    static compareRegex(fieldValue, filterValue, field) {
        try {
            const regex = new RegExp(filterValue, 'i'); // case insensitive
            const passed = regex.test(String(fieldValue));
            return {
                passed,
                reason: passed ? `${field} matches regex ${filterValue}` : `${field} "${fieldValue}" does not match regex ${filterValue}`
            };
        } catch (error) {
            return {
                passed: false,
                reason: `Invalid regex pattern: ${filterValue}`
            };
        }
    }
}

module.exports = FilterUtils;
