/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AnyMessage } from '@/chat/schemas/types/message';
import { HelperService } from '@/helper/helper.service';
import BaseLlmHelper from '@/helper/lib/base-llm-helper';
import { LoggerService } from '@/logger/logger.service';
import { Setting } from '@/setting/schemas/setting.schema';
import { SettingService } from '@/setting/services/setting.service';

import OpenAI from 'openai';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
import { CHATGPT_HELPER_NAME } from './settings';

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
   * Generates a response using LLM
   *
   * @param prompt - The input text from the user
   * @param model - The model to be used
   * @param systemPrompt - The input text from the system
   * @returns {Promise<string>} - The generated response from the LLM
   */
  async generateResponse(
    prompt: string,
    model: string,
    systemPrompt: string,
    options: Omit<ChatCompletionCreateParamsBase, 'messages' | 'model'>,
  ): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      ...options,
      stream: false,
    });

    return completion.choices[0].message.content;
  }

  /**
   * Formats messages to the Ollama required data structure
   *
   * @param messages - Message history to include
   *
   * @returns Ollama message array
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

    return completion.choices[0].message.content;
  }
}
