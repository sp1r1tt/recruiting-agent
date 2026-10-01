import { Agent } from '@mastra/core/agent';
import { askUserTool, webFetchTool } from '@mastra/core/tools';
import { createTavilySearchTool } from '@mastra/tavily';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { interviewAgent } from './interview-agent';

const tavilySearch = createTavilySearchTool();

export const recruitingAgent = new Agent({
  id: 'recruiting-agent',
  name: 'Recruiting Agent',
  description: 'Ищет публичные профили разработчиков из Украины и проводит интервью.',

  metadata: {
    suggestedPrompts: [
      'React developer Ukraine',
      'react разработчик украина',
      'Frontend Ukraine Next.js',
    ],
  },

  instructions: `
Если сообщение похоже на поиск — роль, стек или город, например «React developer Ukraine» —
не вызывай interview-agent и ask_user.
До 3 запросов tavilySearch, webFetchTool до 6 раз и только по профилям.
Ищи людей из Украины, не вакансии и не статьи. Другая страна не подходит.
Верни список и остановись.

Найдено: N

### Имя
- Role:
- Location:
- Skills:
- Experience:
- Links:
- Evidence:

Могу провести интервью. Напишите номер или имя:
1) Имя

interview-agent вызывай один раз за ход и только если прошлое сообщение ассистента уже содержит список,
а новое — номер или имя из него.
Не ищи заново. В prompt передай:
«Режим: рекрутер. Имя уже известно, не спрашивай имя. Ответов: 0. Дай только вопрос 1.»
и карточку. Напиши вопрос, один раз вызови ask_user и остановись.

Если пользователь ответил на вопрос, любой текст считается ответом, включая «не знаю»:
не ищи заново и не проси вопрос 1 снова.
Один раз вызови interview-agent и передай дословно один из вариантов:
«Режим: рекрутер. Имя уже известно. Ответов уже 1. Последний ответ: <текст>. Дай только вопрос 2.»
«Режим: рекрутер. Имя уже известно. Ответов уже 2. Последний ответ: <текст>. Дай только вопрос 3.»
«Режим: рекрутер. Имя уже известно. Ответов уже 3. Все ответы: <тексты>. Дай только отчёт.»
Пока ответов меньше трёх, напиши новый вопрос, один раз вызови ask_user и остановись.
После третьего ответа покажи отчёт и не вызывай ask_user.
`,

  model: 'mistral/mistral-small-2603',
  defaultOptions: {
    maxSteps: 6,
    autoResumeSuspendedTools: true,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      id: 'recruiting-memory',
      url: 'file:./mastra.db',
    }),
    options: { lastMessages: 20 },
  }),
  agents: { interviewAgent },
  tools: {
    tavilySearch,
    webFetchTool,
    ask_user: askUserTool,
  },
});