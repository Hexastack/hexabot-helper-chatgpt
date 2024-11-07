# Hexabot ChatGPT Helper Extension

The **Hexabot ChatGPT Helper Extension** is a utility class designed to facilitate interaction with the ChatGPT API from other Hexabot extensions (such as plugins, channels, etc.). This helper allows developers to easily invoke the ChatGPT API and integrate natural language understanding and response generation into Hexabot's chatbot builder.


[Hexabot](https://hexabot.ai/) is an open-source chatbot / agent solution that allows users to create and manage AI-powered, multi-channel, and multilingual chatbots with ease. If you would like to learn more, please visit the [official github repo](https://github.com/Hexastack/Hexabot/).

## Features

- **API Integration**: Seamlessly connect to OpenAI's ChatGPT API, enabling other extensions within Hexabot to access ChatGPT's capabilities.
- **Configurable Settings**: Configure parameters like model type, temperature, maximum tokens, penalties, and more for customized behavior.
- **Easy Integration**: Use as a helper utility to invoke the ChatGPT API from any other extension within Hexabot.
- **Flexible Options**: Supports various options such as response format, stop sequences, log probabilities, and more to customize the behavior of ChatGPT.

## Installation

To use the ChatGPT Helper Extension within Hexabot, follow these steps:

```
cd ~/projects/my-chatbot
npm install hexabot-helper-chatgpt
hexabot dev
```

Make sure you have the appropriate access credentials for the ChatGPT API.

## Usage

The ChatGPT Helper can be used to generate responses based on user input or integrate into more complex workflows involving conversation history and system prompts. Here's an overview of how to use this helper:

### Settings

The extension provides configurable settings that can be adjusted to suit your needs. Below are the available settings:

- **API Token**: The API key to authenticate with the ChatGPT API.
- **Model**: Specifies which model to use (default: `gpt-4o-mini`).
- **Temperature**: Controls the randomness of the output (default: `0.8`).
- **Max Completion Tokens**: The maximum number of tokens for the completion (default: `1000`).
- **Frequency Penalty**: Controls the repetition of words (default: `0`).
- **Presence Penalty**: Controls the introduction of new topics (default: `0`).
- **Tool Choice**: Option for using specific tools (`none`, `auto`, or `required`).
- **Response Format**: Format of the response (`text` or `json`).

These settings can be customized using the Hexabot admin interface or programmatically via the Hexabot API.

### Example Integration

To use the ChatGPT Helper, simply inject the `ChatGptLlmHelper` class and use it as shown below:

```typescript
const chatGptHelper = this.helperService.use(
  HelperType.LLM,
  ChatGptLlmHelper,
);
// ...
const text = await chatGptHelper.generateChatCompletion(
  context.text,
  args.model,
  systemPrompt,
  history,
  {
    ...options,
    user: context.user.id,
  },
);
```

## Contributing

We welcome contributions from the community! Whether you want to report a bug, suggest new features, or submit a pull request, your input is valuable to us.

Please refer to our contribution policy first : [How to contribute to Hexabot](https://github.com/Hexastack/Hexabot/blob/main/CONTRIBUTING.md)

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://github.com/Hexastack/Hexabot/blob/main/CODE_OF_CONDUCT.md)

Feel free to join us on [Discord](https://discord.gg/rNb9t2MFkG)

## License

This software is licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:

1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).

---

_Happy Chatbot Building!_
