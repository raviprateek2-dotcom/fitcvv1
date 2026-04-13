'use client';

import { useEffect, useState } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { PersonalInfoSection } from '../sections/PersonalInfoSection';
import { SummarySection } from '../sections/SummarySection';
import { ExperienceSection } from '../sections/ExperienceSection';
import { EducationSection } from '../sections/EducationSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { SkillsSection } from '../sections/SkillsSection';

function useMobileAccordionMode() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return isMobile;
}

export function ContentTab() {
  const isMobile = useMobileAccordionMode();

  const sections = (
    <>
      <PersonalInfoSection isProUser={true} />
      <SummarySection isProUser={true} />
      <ExperienceSection isProUser={true} />
      <EducationSection />
      <ProjectsSection />
      <SkillsSection />
    </>
  );

  return (
    <div className="space-y-6">
      {isMobile ? (
        <Accordion
          type="single"
          collapsible={false}
          defaultValue="personal-info"
          className="w-full space-y-4"
        >
          {sections}
        </Accordion>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={['personal-info', 'summary']}
          className="w-full space-y-4"
        >
          {sections}
        </Accordion>
      )}
    </div>
  );
}
