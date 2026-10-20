import type { Language } from '../contexts/LanguageContext'
import type { ProfileId } from '../contexts/ProfileContext'

export const profileCVs: Record<ProfileId, Record<Language, string>> = {
  'data-ai': {
    fr: '/cv/CV_Jad_Falaq_Portfolio_Data_AI_Engineer.pdf',
    en: '/cv/CV_Jad_Falaq_Portfolio_Data_AI_Engineer_EN.pdf',
  },
  genai: {
    fr: '/cv/CV_Jad_Falaq_Portfolio_GenAI_Engineer.pdf',
    en: '/cv/CV_Jad_Falaq_Portfolio_GenAI_Engineer_EN.pdf',
  },
  mlops: {
    fr: '/cv/CV_Jad_Falaq_Portfolio_ML_Engineer.pdf',
    en: '/cv/CV_Jad_Falaq_Portfolio_ML_Engineer_EN.pdf',
  },
}
