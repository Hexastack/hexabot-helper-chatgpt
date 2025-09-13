/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import OpenAI from 'openai';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

import { AnyMessage } from '@/chat/schemas/types/message';
import { HelperService } from '@/helper/helper.service';
import BaseLlmHelper from '@/helper/lib/base-llm-helper';
import { LLM } from '@/helper/types';
import { LoggerService } from '@/logger/logger.service';
import { Setting } from '@/setting/schemas/setting.schema';
import { SettingService } from '@/setting/services/setting.service';

import { CHATGPT_HELPER_NAME } from './settings';

type ChatGptOptions = Omit<
  ChatCompletionCreateParamsBase,
  'messages' | 'model'
>;

@Injectable()
export default class ChatGptLlmHelper
  extends BaseLlmHelper<typeof CHATGPT_HELPER_NAME>
  implements OnApplicationBootstrap
{
  private client: OpenAI;

  /**
   * Instantiate the LLM helper
   *
   * @param logger - Logger service
   */
  constructor(
    settingService: SettingService,
    helperService: HelperService,
    protected readonly logger: LoggerService,
  ) {
    super('chatgpt-helper', settingService, helperService, logger);
  }

  getPath(): string {
    return __dirname;
  }

  async onApplicationBootstrap() {
    const settings = await this.getSettings();

    this.client = new OpenAI({
      apiKey: settings.token,
    });
  }

  @OnEvent('hook:chatgpt_helper:token')
  handleApiUrlChange(setting: Setting) {
    this.client = new OpenAI({
      apiKey: setting.value,
    });
  }

  /**
   * Merge Provided options with the settings options
   *
   * @param options Caller function's options
   * @returns ChatGpt Options
   */
  private async buildOptions(options: ChatGptOptions): Promise<ChatGptOptions> {
    // Retrieve global settings
    const {
      model: _model,
      token: _token,
      ...globalSettings
    } = await this.getSettings();

    // Merge options: argument options take precedence over global settings
    return {
      ...{
        ...globalSettings,
        seed:
          typeof options.seed === 'number' && options.seed >= 0
            ? options.seed
            : null,
        stop: !!options.stop ? options.stop : null,
        top_logprobs:
          options.logprobs && typeof options.top_logprobs === 'number' && options.top_logprobs >= 0
            ? options.top_logprobs
            : null,
        logit_bias: JSON.parse(globalSettings.logit_bias),
        max_completion_tokens: parseInt(
          globalSettings.max_completion_tokens.toString(),
        ),
      },
      ...options,
    };
  }

  /**
   * Generates a response using OpenAI ChatGPT
   *
   * @param prompt - The input text from the user
   * @param model - The model to be used
   * @param systemPrompt - The input text from the system
   * @returns - The generated response from the OpenAI ChatGPT
   */
  async generateResponse(
    prompt: string,
    model: string,
    systemPrompt: string,
    options: ChatGptOptions = {},
  ): Promise<string> {
    // Merge options: argument options take precedence over global settings
    const opts = await this.buildOptions(options);
    const completion = await this.client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      ...opts,
      stream: false,
      response_format: {
        type: 'text',
      },
    });

    const response = completion.choices[0].message.content;

    if (!response) {
      throw new Error('ChatGPT generateResponse method: no generated response');
    }

    return response;
  }

  /**
   * Generates a response using OpenAI ChatGPT
   *
   * @param prompt - The input text from the user
   * @param model - The model to be used
   * @param systemPrompt - The input text from the system
   * @param schema - The OpenAPI data schema
   * @returns - The generated response from the OpenAI ChatGPT
   */
  async generateStructuredResponse<T>(
    prompt: string,
    model: string,
    systemPrompt: string,
    schema: LLM.ResponseSchema,
    options: ChatGptOptions = {},
  ): Promise<T> {
    const { model: globalModel } = await this.getSettings();
    // Merge options: argument options take precedence over global settings
    const opts = await this.buildOptions(options);
    const completion = await this.client.chat.completions.create({
      model: model || globalModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      ...opts,
      // Temperature should ideally be zero to be deterministic
      temperature: opts.temperature || 0,
      stream: false,
      response_format: {
        json_schema: {
          strict: true,
          name: 'result',
          schema: {
            type: 'object',
            properties: {
              result: schema,
            },
            required: ['result'],
            additionalProperties: false,
          },
        },
        type: 'json_schema',
      },
    });

    const response = completion.choices[0].message.content;

    if (!response) {
      throw new Error(
        'ChatGPT generateStructuredResponse method: no generated response',
      );
    }

    const { result } = JSON.parse(response);
    return result as T;
  }

  /**
   * Formats messages to the OpenAI ChatGPT required data structure
   *
   * @param messages - Message history to include
   * @returns OpenAI ChatGPT message array
   */
  private formatMessages(
    messages: AnyMessage[],
  ): { role: 'user' | 'assistant'; content: string }[] {
    return messages.map((m) => {
      const text =
        'text' in m.message && m.message.text
          ? m.message.text
          : JSON.stringify(m.message);
      return {
        role: 'sender' in m && m.sender ? 'user' : 'assistant',
        content: text,
      };
    });
  }

  /**
   * Send a chat completion request with the conversation history.
   * You can use this same approach to start the conversation
   * using multi-shot or chain-of-thought prompting.
   *
   * @param prompt - The input text from the user
   * @param model - The model to be used
   * @param history - Array of messages
   * @returns {Promise<string>} - The generated response from the LLM
   */
  public async generateChatCompletion(
    prompt: string,
    model: string,
    systemPrompt: string,
    history: AnyMessage[] = [],
    options: Omit<ChatCompletionCreateParamsBase, 'messages' | 'model'>,
  ) {
    const completion = await this.client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...this.formatMessages(history),
        { role: 'user', content: prompt },
      ],
      ...options,
      stream: false,
    });

    const response = completion.choices[0].message.content;

    if (!response) {
      throw new Error(
        'ChatGPT generateChatCompletion method: no generated response',
      );
    }

    return response;
  }
}
