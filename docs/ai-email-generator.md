# Open AI Email Generate

We're using OpenAI API to generate emails.

There were some choices made in the process of creating this email generator. These choices are documented here.

In the API, we're passing the following parameters.

```json
{
	model: 'text-curie-001',
	max_tokens: 512,
	n: 1,
	stop: '',
	temperature: 0.4,
}
```

- **Model:** The model, we've tested davinci, babbage and a few others. The best results were with text-curie-001. This is because text-curie-001 is closer to davinci than babbage. The other models are not as good as davinci. Also the pricing is different. text-curie-001 is `$0.0020/ 1K tokens`, davinci is `$0.0200/ 1K tokens` and babbage is `$0.0005/ 1K tokens`. Now while babbage was our obvious choice at first, it was making mistakes and didn't generate too much descriptive text. So we decided to go with text-curie-001. It's a bit more expensive but it's worth it because it's more accurate, and it's more descriptive.

- **Max Tokens:** The maximum number of tokens to generate. We're using 512 tokens. This is because we want to generate a long email. The greater the number of tokens, the longer the model is allowed to generate. Greater values don't always necessarily mean longer emails. It depends on the model and the context.

- **n:** The number of samples to return. We're using 1 sample. This is because we want to generate a single email and let users re-generate more emails if they want to.

- **Temperature:** Temperature is used to control the randomness of the model. We're using 0.4. This is because we want to generate a long but accurate email. We're not using other values because it was either generating random emails or very short emails.