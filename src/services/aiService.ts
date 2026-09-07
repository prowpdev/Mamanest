// Mama AI Service Layer
// Future Django backend handles server-side LLM credentials (OpenAI/Anthropic/Gemini)

import { AIMessage } from '../types';

export const SUGGESTED_QUESTIONS = [
  'Why does my baby wake up so often?',
  'How can I establish a bedtime routine?',
  'What should I prepare for my baby\'s next checkup?',
  'What milestones are common at this age?',
  'How can I tell if baby is getting enough milk?',
  'What are gentle ways to relieve baby gas?',
];

export const GENERAL_MEDICAL_DISCLAIMER =
  'Mama AI provides general educational guidance only and is not a substitute for professional pediatric medical advice, diagnosis, or treatment. Always consult your pediatrician or healthcare provider for specific medical concerns.';

class AiService {
  async sendMessage(userInput: string, chatHistory: AIMessage[] = []): Promise<AIMessage> {
    // Check if backend API is configured
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl && apiUrl.startsWith('http') && !apiUrl.includes('localhost:8000')) {
      try {
        const response = await fetch(`${apiUrl}/ai/chat/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userInput, history: chatHistory }),
        });
        if (response.ok) {
          const data = await response.json();
          return {
            id: `ai_${Date.now()}`,
            sender: 'assistant',
            content: data.reply,
            timestamp: new Date().toISOString(),
            disclaimer: GENERAL_MEDICAL_DISCLAIMER,
            suggestedFollowUps: data.followUps || [],
          };
        }
      } catch (e) {
        console.warn('[AiService] Backend AI not reached, using local pediatric intelligence model:', e);
      }
    }

    // Local smart pediatric knowledge-base simulation for seamless offline / client use
    await new Promise((r) => setTimeout(r, 650)); // natural typing sensation

    const query = userInput.toLowerCase();
    let reply = '';
    let followUps: string[] = [];

    // Urgent symptom detection
    if (query.includes('fever') || query.includes('temperature') || query.includes('hot to touch') || query.includes('difficulty breathing') || query.includes('lethargic') || query.includes('vomit') || query.includes('blood')) {
      reply =
        "⚠️ **Pediatric Safety Priority:**\n\nFor infants—especially under 3 months—any rectal temperature of 100.4°F (38.0°C) or higher, difficulty breathing, persistent vomiting, or noticeable lethargy requires **immediate evaluation by a pediatrician or emergency urgent care**.\n\nPlease do not give over-the-counter medications without your doctor's explicit dosage instructions. Contact your pediatric on-call service right away.";
      followUps = ['How do I check baby temperature rectally?', 'What is normal newborn breathing like?'];
    } else if (query.includes('wake') || query.includes('often') || query.includes('sleep cycle')) {
      reply =
        "It is completely normal and biologically protective for babies to wake frequently!\n\n" +
        "• **Short Sleep Cycles:** Infants have 45–50 minute sleep cycles (compared to 90–120 minutes in adults) and spend about half their sleep in light REM sleep.\n" +
        "• **Small Tummy Capacity:** Breast milk digests in about 90 minutes. Frequent waking helps ensure adequate hydration and caloric intake.\n" +
        "• **Developmental Leaps:** Growth spurts and new neural connections can cause temporary sleep regressions.\n\n" +
        "💡 *Gentle Tip:* Try pausing for 30–60 seconds before picking baby up; sometimes they are simply transitioning between sleep cycles and might resettle on their own.";
      followUps = ['How can I establish a bedtime routine?', 'What are early tired signs?'];
    } else if (query.includes('bedtime') || query.includes('routine')) {
      reply =
        "A simple, predictable bedtime routine signals to your baby's developing circadian rhythm that night is approaching:\n\n" +
        "1. **Warm Bath or Gentle Wipe-Down:** Soothing warm water relaxes muscles.\n" +
        "2. **Infant Massage:** A gentle 3-minute leg and tummy massage with baby-safe lotion.\n" +
        "3. **Fresh Diaper & Cozy Sleepwear:** Room temperature is best kept between 68°F–72°F (20°C–22°C).\n" +
        "4. **Dim Lights & Sound Machine:** Soft pink/white noise masks household sounds.\n" +
        "5. **Feeding & Bedtime Lullaby:** A calm final feed and a familiar soft song.\n\n" +
        "Aim to keep the whole sequence around 20 to 30 minutes at roughly the same time every evening.";
      followUps = ['What is the best room temperature for baby?', 'How do I know when baby is overtired?'];
    } else if (query.includes('checkup') || query.includes('pediatrician') || query.includes('prepare')) {
      reply =
        "Here is a handy checklist for your baby's upcoming well-child visit:\n\n" +
        "📋 **What to Bring:**\n" +
        "• Health insurance card & vaccination booklet\n" +
        "• 2 extra diapers, wipes, and a change of clothes (diaper-only exam)\n" +
        "• Feed logs and sleep summary from your MamaNest app!\n" +
        "• Favorite soothing pacifier or blanket\n\n" +
        "💬 **Good Questions to Ask Your Pediatrician:**\n" +
        "• \"How is baby's weight and height percentile progressing?\"\n" +
        "• \"Are their current developmental milestones on track?\"\n" +
        "• \"What should I watch for after today's scheduled immunizations?\"\n" +
        "• \"Any recommendations for introducing tummy time or upcoming routines?\"";
      followUps = ['What vaccines are given at 4 months?', 'How do I track growth percentiles?'];
    } else if (query.includes('milestone') || query.includes('age') || query.includes('development')) {
      reply =
        "Between 3 and 4 months, babies undergo marvelous social and motor transformations!\n\n" +
        "✨ **Common Milestones:**\n" +
        "• Smiling socially at loved ones\n" +
        "• Cooing and echoing vowel sounds (ooh, aah)\n" +
        "• Pushing up onto forearms during tummy time with steady head control\n" +
        "• Bringing hands together and toward the mouth\n" +
        "• Tracking moving objects smoothly with both eyes\n\n" +
        "🌱 *Remember:* Every baby develops at their own unique pace. If you have concerns about head lag or responsiveness, discuss them with your pediatrician.";
      followUps = ['How to make tummy time more enjoyable?', 'When do babies roll over?'];
    } else if (query.includes('milk') || query.includes('enough') || query.includes('feeding')) {
      reply =
        "A very common worry for new mothers! The most reliable indicators that baby is receiving plenty of milk include:\n\n" +
        "• **Diaper Output:** At least 5 to 6 heavy wet diapers per 24 hours.\n" +
        "• **Steady Growth:** Following their own pediatric growth percentile curve.\n" +
        "• **Swallow Sounds:** Audible rhythmic swallowing during feeds.\n" +
        "• **Contentment:** Baby appears relaxed with uncurled, open hands after a feed.\n" +
        "• **Alertness:** Bright-eyed and interactive during awake windows.";
      followUps = ['What is cluster feeding?', 'How do I relieve gas after feeds?'];
    } else if (query.includes('gas') || query.includes('colic') || query.includes('fuss')) {
      reply =
        "Newborn digestive tracts are still maturing, which can lead to trapped gas bubbles. Here are gentle, proven techniques:\n\n" +
        "🚲 **Bicycle Legs:** Gently pedal baby's legs toward their tummy in a slow, rhythmic circular motion.\n" +
        "🌀 **\"I Love You\" Tummy Massage:** Clockwise circular strokes on baby's tummy (following intestinal direction).\n" +
        "👶 **The \"Colic Hold\" (Tiger in the Tree):** Drape baby tummy-down along your forearm, resting their chin in your hand.\n" +
        "🫧 **Mid-Feed Burping:** Burp halfway through nursing or every 1–2 ounces of bottle feeding.";
      followUps = ['Can nursing moms eat certain foods for gas?', 'How to tell reflux apart from normal spit up?'];
    } else {
      reply =
        `Thank you for asking, Mom ❤️\n\nWhen caring for a young baby, your maternal instincts combined with gentle observation are your best guides. Here are three key principles to keep in mind:\n\n` +
        `1. **Follow Baby's Cues:** Observe subtle signs of hunger, tiredness, or overstimulation before crying begins.\n` +
        `2. **Prioritize Connection:** Skin-to-skin contact, gentle voice tones, and eye contact regulate baby's nervous system (and boost your oxytocin!).\n` +
        `3. **Be Kind to Yourself:** No parent has all the answers on day one. You are doing important, loving work every single day.`;
      followUps = [
        'Why does my baby wake up so often?',
        'How can I establish a bedtime routine?',
        'What milestones are common at this age?',
      ];
    }

    return {
      id: `ai_${Date.now()}`,
      sender: 'assistant',
      content: reply,
      timestamp: new Date().toISOString(),
      disclaimer: GENERAL_MEDICAL_DISCLAIMER,
      suggestedFollowUps: followUps,
    };
  }
}

export const aiService = new AiService();
