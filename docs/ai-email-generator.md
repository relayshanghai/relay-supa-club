# Open AI Email Generate

We're using OpenAI API to generate emails. The choices for variables are documented here.

In the API, we're passing the following parameters.

```json
{
    "model": "text-curie-001",
    "max_tokens": 512,
    "n": 1,
    "stop": "",
    "temperature": 0.4
}
```

-   **Model:**
    **March 2, 2023 - Update** :
    ChatGPT API has been released by OpenAI. Which means we don't need to use the older curie model and the results are also much better than any other model we've used before. This requires a small change in the 'prompt' structure. We were using the following prompt earlier:

    ```json
    {
        "prompt": "..."
    }
    ```

    but now, we do this:

    ```json
    {
    	messages: [
    		{
      		role: 'user', // The user role makes the model follow instructions instead of having a conversation
    		content: prompt,
      		},
      	],
    }
    ```

    **February 2023:**
    The model, we've tested davinci, babbage and a few others. The best results were with text-curie-001. This is because text-curie-001 is closer to davinci than babbage. The other models are not as good as davinci. Also the pricing is different. text-curie-001 is `$0.0020/ 1K tokens`, davinci is `$0.0200/ 1K tokens` and babbage is `$0.0005/ 1K tokens`. 1000 Tokens is 750 words, so it's important to note spend too much money. Now while babbage was our obvious choice at first because of the pricing, it was making mistakes and didn't generate too much descriptive text. So we decided to go with text-curie-001. It's a bit more expensive but it's worth it because it's more accurate, and it's more descriptive. Davinci was also the other obvious choice but Curie does just as good while being cheaper.

-   **Max Tokens:** The maximum number of characters to generate. We're using 512 tokens. 1000 tokens is around 750 words (more or less). This is because we want to generate a long email. The greater the number of tokens, the longer the model is allowed to generate. Greater values don't always necessarily mean longer emails. It depends on the model and the context.

-   **n:** The number of samples to return. We're using 1 sample. This is because we want to generate a single email and let users re-generate more emails if they want to.

-   **Temperature:** Temperature is used to control the randomness of the model. We're using 0.4. This is because we want to generate a long but accurate email. We're not using other values because it was either generating random emails or very short emails. The higher the temperature, the higher the model would take risks with the text. In the subject line, we wanted to generate a catchy text so randomness/temperature of 1 gave us expected results but the same wasn't the case with the emails since we wanted to generate text within the proper context, so 0.4 felt fine.

-   **role:** The new GPT 3.5 API requires a role to be passed. We're using 'user' because we want the model to follow instructions instead of having a conversation. The three roles we can use are: 'user', 'assistant' and 'system'[3]. The 'assistant' role is used to generate responses to user input, so a reply by a bot. The 'system' role is define the pre-determined behavior of the assistant. The 'user' role is used to define the user's input. We're using 'user' because we want the model to follow instructions instead of having a conversation.

**References:**

-   [1] https://openai.com/pricing
-   [2] https://platform.openai.com/docs/introduction
-   [3] https://platform.openai.com/docs/guides/chat/introduction
