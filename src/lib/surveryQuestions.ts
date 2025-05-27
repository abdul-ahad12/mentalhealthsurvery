import { IQuestion } from "@/models/Questions";

export const INITIAL_QUESTIONS: Array<Pick<IQuestion, 'qid'|'text'|'options'>> = [
  {
    qid: 'q1',
    text: 'I have not been feeling cheerful or in good spirits.',
    options: [
      { key: 'a', text: 'Not at all',              weight: 3 },
      { key: 'b', text: 'Several days',            weight: 2 },
      { key: 'c', text: 'More than half the days', weight: 1 },
      { key: 'd', text: 'Nearly every day',        weight: 0 },
    ],
  },
  {
    qid: 'q2',
    text: 'I have had trouble sleeping (too much or too little).',
    options: [
      { key: 'a', text: 'Not at all',              weight: 3 },
      { key: 'b', text: 'Several days',            weight: 2 },
      { key: 'c', text: 'More than half the days', weight: 1 },
      { key: 'd', text: 'Nearly every day',        weight: 0 },
    ],
  },
  {
    qid: 'q3',
    text: 'I have felt downhearted, depressed, or hopeless.',
    options: [
      { key: 'a', text: 'Not at all',              weight: 3 },
      { key: 'b', text: 'Several days',            weight: 2 },
      { key: 'c', text: 'More than half the days', weight: 1 },
      { key: 'd', text: 'Nearly every day',        weight: 0 },
    ],
  },
  {
    qid: 'q4',
    text: 'I have found it difficult to relax.',
    options: [
      { key: 'a', text: 'Not at all',              weight: 3 },
      { key: 'b', text: 'Several days',            weight: 2 },
      { key: 'c', text: 'More than half the days', weight: 1 },
      { key: 'd', text: 'Nearly every day',        weight: 0 },
    ],
  },
  {
    qid: 'q5',
    text: 'I have been feeling nervous, anxious, or on edge.',
    options: [
      { key: 'a', text: 'Not at all',              weight: 3 },
      { key: 'b', text: 'Several days',            weight: 2 },
      { key: 'c', text: 'More than half the days', weight: 1 },
      { key: 'd', text: 'Nearly every day',        weight: 0 },
    ],
  },
  {
    qid: 'q6',
    text: 'I have not been able to stop or control worrying.',
    options: [
      { key: 'a', text: 'Not at all',              weight: 3 },
      { key: 'b', text: 'Several days',            weight: 2 },
      { key: 'c', text: 'More than half the days', weight: 1 },
      { key: 'd', text: 'Nearly every day',        weight: 0 },
    ],
  },
  {
    qid: 'q7',
    text: 'I have experienced no interest or pleasure in doing things.',
    options: [
      { key: 'a', text: 'Not at all',              weight: 3 },
      { key: 'b', text: 'Several days',            weight: 2 },
      { key: 'c', text: 'More than half the days', weight: 1 },
      { key: 'd', text: 'Nearly every day',        weight: 0 },
    ],
  },
  {
    qid: 'q8',
    text: 'I have felt tired or had little energy.',
    options: [
      { key: 'a', text: 'Not at all',              weight: 3 },
      { key: 'b', text: 'Several days',            weight: 2 },
      { key: 'c', text: 'More than half the days', weight: 1 },
      { key: 'd', text: 'Nearly every day',        weight: 0 },
    ],
  },
  {
    qid: 'q9',
    text: 'I have had a poor appetite or been overeating.',
    options: [
      { key: 'a', text: 'Not at all',              weight: 3 },
      { key: 'b', text: 'Several days',            weight: 2 },
      { key: 'c', text: 'More than half the days', weight: 1 },
      { key: 'd', text: 'Nearly every day',        weight: 0 },
    ],
  },
  {
    qid: 'q10',
    text: 'I have felt I am a failure or have let myself or my family down.',
    options: [
      { key: 'a', text: 'Not at all',              weight: 3 },
      { key: 'b', text: 'Several days',            weight: 2 },
      { key: 'c', text: 'More than half the days', weight: 1 },
      { key: 'd', text: 'Nearly every day',        weight: 0 },
    ],
  },
  {
    qid: 'q11',
    text: 'I have had trouble concentrating on things like reading or watching TV.',
    options: [
      { key: 'a', text: 'Not at all',              weight: 3 },
      { key: 'b', text: 'Several days',            weight: 2 },
      { key: 'c', text: 'More than half the days', weight: 1 },
      { key: 'd', text: 'Nearly every day',        weight: 0 },
    ],
  },
  {
    qid: 'q12',
    text: 'I have been more irritable, feeling easily annoyed.',
    options: [
      { key: 'a', text: 'Not at all',              weight: 3 },
      { key: 'b', text: 'Several days',            weight: 2 },
      { key: 'c', text: 'More than half the days', weight: 1 },
      { key: 'd', text: 'Nearly every day',        weight: 0 },
    ],
  },
  {
    qid: 'q13',
    text: 'I have felt restless and found it hard to sit still.',
    options: [
      { key: 'a', text: 'Not at all',              weight: 3 },
      { key: 'b', text: 'Several days',            weight: 2 },
      { key: 'c', text: 'More than half the days', weight: 1 },
      { key: 'd', text: 'Nearly every day',        weight: 0 },
    ],
  },
  {
    qid: 'q14',
    text: 'I have felt hopeless about the future.',
    options: [
      { key: 'a', text: 'Not at all',              weight: 3 },
      { key: 'b', text: 'Several days',            weight: 2 },
      { key: 'c', text: 'More than half the days', weight: 1 },
      { key: 'd', text: 'Nearly every day',        weight: 0 },
    ],
  },
  {
    qid: 'q15',
    text: 'I have had thoughts that I would be better off dead or hurting myself.',
    options: [
      { key: 'a', text: 'Not at all',              weight: 3 },
      { key: 'b', text: 'Several days',            weight: 2 },
      { key: 'c', text: 'More than half the days', weight: 1 },
      { key: 'd', text: 'Nearly every day',        weight: 0 },
    ],
  },
];
