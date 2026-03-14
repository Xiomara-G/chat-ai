import { AGENT_IDENTITY, RESPONSE_RULES } from './Core/BaseRules';
import { SUPPORT_AREAS, IMPORTANT_RULES, PROHIBITED_PHRASES, ADDITIONAL_CONTEXT } from './Core/SupportAreas';
import { DEPOSIT_FLOW } from './Flows/DepositFlow';
import { WITHDRAWAL_FLOW } from './Flows/WithdrawalFlow';
import { BONUS_FLOW } from './Flows/BonusFlow';
import { VERIFICATION_FLOW } from './Flows/VerificationFlow';
import { SPORTS_BET_FLOW } from './Flows/SportsBetFlow';

export const CUSTOMER_SERVICE_AGENT_PROMPT = `${AGENT_IDENTITY}

${RESPONSE_RULES}

${SUPPORT_AREAS}

${DEPOSIT_FLOW}

${WITHDRAWAL_FLOW}

${BONUS_FLOW}

${VERIFICATION_FLOW}

${SPORTS_BET_FLOW}

${IMPORTANT_RULES}

${PROHIBITED_PHRASES}

${ADDITIONAL_CONTEXT}`;

export const getCustomerServicePrompt = (): string => CUSTOMER_SERVICE_AGENT_PROMPT;

// Exportaciones individuales para casos de uso específicos
export {
  AGENT_IDENTITY,
  RESPONSE_RULES,
  SUPPORT_AREAS,
  IMPORTANT_RULES,
  PROHIBITED_PHRASES,
  ADDITIONAL_CONTEXT,
  DEPOSIT_FLOW,
  WITHDRAWAL_FLOW,
  BONUS_FLOW,
  VERIFICATION_FLOW,
  SPORTS_BET_FLOW,
};
