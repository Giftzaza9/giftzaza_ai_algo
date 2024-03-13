/* eslint-disable prefer-template */
/* eslint-disable no-extend-native */
/* eslint-disable no-new-func */
const OpenAI = require('openai');
const category_data = require('./category.json');
const { gpt_assistance, ...category_jsonData } = category_data;

gpt_assistance.map((each_prompt) =>
  each_prompt['role'] === 'assistant' ? (each_prompt['content'] = JSON.stringify(each_prompt)) : false
);

const openai = new OpenAI({
  apiKey: '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',
});

String.prototype.interpolate = function (params) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  return new Function(...names, `return \`${this}\`;`)(...vals);
};

prompt_template = Object.entries(category_jsonData).map(([key, value]) => {
  if (value['keyword_search']) {
    return value.gpt_template.interpolate({ list: "'" + Object.keys(value.category).join("','") + "'" });
  } else {
    return value.gpt_template.interpolate({ list: "'" + value.category.join("','") + "'" });
  }
});

var system = `You are an assistant tasked with analyzing a product description and title to determine suitable attributes for gifting the product. Here are the tasks you need to accomplish.

${prompt_template.join('\n')}

Please provide responses in JSON format with keys: ${"'" + Object.keys(category_jsonData).join("','") + "'"
  } and values as list respectively.
`;

async function GPTbasedTagging(content, title) {
  try {
    product_info = `Product Title : ${title}
    Product Description : ${content}`
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: system,
        },
        // ...gpt_assistance,
        {
          role: 'user',
          content: product_info,
        },
      ],
      response_format: { type: 'json_object' },
    });

    let JSON_response = JSON.parse(response['choices'][0]['message']['content']);
    if (JSON_response?.content) JSON_response = JSON_response.content;
    let preferenceData = JSON_response?.content
      ? Object.values(JSON_response.content).flat()
      : Object.values(JSON_response).flat();
    console.log({ content, preferenceData, JSON_response });
    return { JSON_response, preferenceData };
  } catch (err) {
    return {};
  }
}

module.exports = GPTbasedTagging;
