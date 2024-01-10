const fuzz = require("fuzzball")
const category_jsonData = require("./category.json")

function rulebasedTagging(product_description) {
    options = { scorer: fuzz.token_set_ratio, full_process: true, force_ascii: true, cutoff: 80 };
    res_each = Object.entries(category_jsonData).map(([profile, profile_obj]) => {
        if (profile_obj['keyword_search']) {
            category_matched = Object.entries(profile_obj.category).filter(([category, keyword_list]) => {
                keyword_matched = fuzz.extract(product_description, keyword_list, options);
                return keyword_matched.length
            })
            return [profile, category_matched.map(([category, _]) => category)]
        }
        else {
            results = fuzz.extract(product_description, profile_obj.category, options);
            return [profile, results.map((each) => { return each[0]; })]
        }
    })
    return Object.fromEntries(res_each)
}

module.exports = rulebasedTagging