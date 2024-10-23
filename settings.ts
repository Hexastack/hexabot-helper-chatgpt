/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { HelperSetting } from '@/helper/types';
import { SettingType } from '@/setting/schemas/types';

export const CHATGPT_HELPER_NAME = 'chatgpt-helper';

export const CHATGPT_HELPER_NAMESPACE: HyphenToUnderscore<
  typeof CHATGPT_HELPER_NAME
> = 'chatgpt_helper';

export default [
  {
    label: 'token',
    group: CHATGPT_HELPER_NAMESPACE,
    type: SettingType.secret,
    value: '', // Default value
  },
  {
    label: 'model',
    group: CHATGPT_HELPER_NAMESPACE,
    type: SettingType.text,
    value: 'gpt-4o-mini', // Default model
  },
  {
    label: 'temperature',
    group: CHATGPT_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.number,
    value: 0.8, // Default value, between 0 and 2
  },
  {
    label: 'max_completion_tokens',
    group: CHATGPT_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.number,
    value: 1000, // Default value
  },
  {
    label: 'frequency_penalty',
    group: CHATGPT_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.number,
    value: 0, // Default value, between -2.0 and 2.0
  },
  {
    label: 'function_call',
    group: CHATGPT_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.text,
    value: 'none', // Default value ('none' or 'auto')
  },
  {
    label: 'logit_bias',
    group: CHATGPT_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.textarea,
    value: '{}', // Default empty JSON object
  },
  {
    label: 'logprobs',
    group: CHATGPT_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.checkbox,
    value: false, // Default value
  },
  {
    label: 'n',
    group: CHATGPT_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.number,
    value: 1, // Default value
  },
  {
    label: 'parallel_tool_calls',
    group: CHATGPT_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.checkbox,
    value: false, // Default value
  },
  {
    label: 'presence_penalty',
    group: CHATGPT_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.number,
    value: 0, // Default value, between -2.0 and 2.0
  },
  {
    label: 'response_format',
    group: CHATGPT_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.text,
    value: 'text', // Default value ('text' or 'json')
  },
  {
    label: 'seed',
    group: CHATGPT_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.number,
    value: null, // Default value (null for no seed)
  },
  {
    label: 'stop',
    group: CHATGPT_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.text,
    value: null, // Default value (null or stop sequence)
  },
  {
    label: 'store',
    group: CHATGPT_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.checkbox,
    value: false, // Default value
  },
  // {
  //   label: 'stream',
  //   group: CHATGPT_HELPER_NAMESPACE,
  //   subgroup: 'options',
  //   type: SettingType.checkbox,
  //   value: false, // Default value
  // },
  {
    label: 'tool_choice',
    group: CHATGPT_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.text,
    value: 'auto', // Default value ('none', 'auto', 'required')
  },
  {
    label: 'top_logprobs',
    group: CHATGPT_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.number,
    value: null, // Default value (null or number between 0 and 20)
  },
  {
    label: 'top_p',
    group: CHATGPT_HELPER_NAMESPACE,
    subgroup: 'options',
    type: SettingType.number,
    value: 0.9, // Default value
  },
] as const satisfies HelperSetting<typeof CHATGPT_HELPER_NAME>[];
