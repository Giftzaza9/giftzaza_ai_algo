const OpenAI = require("openai");
const all_tags = require("../variables/tags");

const openai = new OpenAI({
    apiKey: "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",
});

async function classificateProduct(product_description) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": "You will be presented with a product description and your job is to associate it with the gender, age, interests, style of a person and the possible gift occasions from the following list. Provide your answer in bullet point form. Choose ONLY from the list provided here:\n\n- Male\n- Female\n- Baby  \n- Child\n- Teenager\n- Young Adult\n- Adult\n- Elder\n- Fitness and Wellness\n- Tech and Gadgets\n- Fashion and Accessories\n- Books and Learning\n- Travel and Adventure\n- Food and Cooking\n- Arts and Crafts\n- Music and Entertainment\n- Outdoor and Nature\n- Beauty and Self-care\n- Home and Decor\n- Sports and Hobbies\n- Pets and Animal Lovers\n- Art and Culture\n- Social Impact and Charity\n- Spirituality\n- Cars and Automotive\n- Collectibles\n- Science and Learning\n- Classic and Timeless\n- Comfortable Yet Stylish\n- Premium Brands  \n- Minimalistic\n- Practical\n- Chill\n- Bougie\n- Birthdays\n- Anniversaries\n- Holidays\n- Promotions and Achievements\n- Graduations\n- Valentine's Day\n- Appreciation\n- Get Well Soon\n- Thank You Gifts\n- Apologies"
                },
                {
                    "role": "user",
                    "content": product_description
                }
            ],
            temperature: 0,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        const lines = response.choices[0].message.content.split('\n');

        tags = []

        lines.forEach(line => {
            if (line.trim() === '') {
                return;
            }
            if (line.includes(":")) {
                line.split(":")[1].split(",").forEach(tag => tags.push(tag.replace("-", "").trim()))
            } else if (line.includes(",")) {
                line.split(",").forEach(tag => tags.push(tag.replace("-", "").trim()))
            } else {
                tags.push(line.replace("-", "").trim());
            }
        });

        return tags.filter(tag => all_tags.includes(tag))

    } catch (error) {
        return []
    }
}

module.exports = classificateProduct

