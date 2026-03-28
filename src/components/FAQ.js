import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const FAQ = ({ faqs }) => {
  return (
    <div className="mt-20" data-testid="faq-section">
      <h2 className="text-3xl font-bold text-neutral-900 mb-8 tracking-tight">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border border-neutral-200 rounded-xl px-6">
            <AccordionTrigger className="text-left font-semibold text-neutral-900 hover:no-underline" data-testid={`faq-question-${index}`}>
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-neutral-600 leading-relaxed" data-testid={`faq-answer-${index}`}>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};