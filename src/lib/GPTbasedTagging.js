const OpenAI = require("openai");
const category_jsonData = require("./category.json")

const openai = new OpenAI({
    apiKey: "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",
});

String.prototype.interpolate = function (params) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${this}\`;`)(...vals);
}

prompt_template = Object.entries(category_jsonData).map(([key, value]) => {
    if (value['keyword_search']) {
        return value.gpt_template.interpolate({ list: "'" + Object.keys(value.category).join("','") + "'" })
    }
    else {
        return value.gpt_template.interpolate({ list: "'" + value.category.join("','") + "'" })
    }
})

var system = `Given product information:
${prompt_template.join("\n")}

Please provide responses in JSON format with keys: ${"'" + Object.keys(category_jsonData).join("','") + "'"} and values as list respectively.
`
const assistance = [{
    "role": "user",
    "content": "Fire-Boltt Phoenix Pro 1.39' Bluetooth Calling Smartwatch, AI Voice Assistant, Metal Body with 120+ Sports Modes, SpO2, Heart Rate Monitoring (Black)1.39' Bigger Round Display- Comes with a 1.39' TFT Color Full Touch Screen and a 240*240 Pixel High Resolution this watch is covered to flaunt the sleek looks with a 280 NITS peak brightness The watch will work on a single charge for about 7 days (without Bluetooth calling) and about 4 Days with Bluetooth calling.Charging Specs - The watch needs to be charged for 3 hours to reach 100%. The charger should be a 3.7V to 5V adapter or any laptop output. For a bare minimum of 20% charge the watch needs to be charged for about 30-40 mins You cannot store Music in the watch, you can only control the music. 120+ Sports Modes- Track each activity effectively with this smartwatch & activity tracker. Track your calories, steps and much more while you are on your fitness journey. This fitness tracker has it all There is no volume control, however when connected to bt calling you can control the volume of the call. Metal Body- Fire-Boltt Phoenix Pro possess a metal body that is durable and long lasting, The watch gives a sleek look and gloss finish with shiny and is anti-corrosive Supported Applications - Notifcations from all social media channels (Instagram, Whatsapp, Facebook), Call Notifications, Health Tracking (SpO2, Heart Rate, Sleep), Sports Tracking & many more (This is not a medical device) AI Voice Assistant- The smartwatch comes with a AI Voice assistant that can with one tap wake up Siri/Google on your phone and you can give the commands to get your work accomplished Smartphone Notifications- Get all your mobile phone notifications on this 1.39' Round Display Full touch smartwatch and never be late for a meeting, party or date. Gaming On Wrist- Enjoy playing games on the wrist itself as you are on the go.Breathe Function- Ensure your breathing exercise is fit and healthy with the breathing function Package Contains - 1 Smartwatch, 1 Charging Cable, 1 Manual, 1 Warranty Card"
}, {
    "role": "assistant",
    "content": JSON.stringify({
        gender: ['Male', 'Female'],
        age_category: ['12 - 18', '18 - 25', '25 - 45', '45 - 65', '65 +'],
        interest: ['Tech and Gadgets', 'Fitness and Wellness', 'Sports and Hobbies'],
        occasion: [
            'Birthdays',
            'Anniversaries',
            'Promotions and Achievements',
            'Graduations',
            "Valentine's Day",
            'Appreciation',
            'Get Well Soon',
            'Thank You Gifts',
        ],
        relationship: ['Colleague', 'Friend', 'Girlfriend'],
        style: []
    })
}]

async function GPTbasedTagging(content) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            temperature: 0,
            messages: [
                {
                    "role": "system",
                    "content": system,
                },
                ...assistance,
                {
                    "role": "user",
                    "content": content,
                }
            ],
            response_format: { "type": "json_object" },
        })

        JSON_response = JSON.parse(response['choices'][0]['message']['content'])
        return JSON_response
    }
    catch (err) {
        return {}
    }
}

module.exports = GPTbasedTagging