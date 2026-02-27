import { TabsContent } from '@/components/ui/tabs';
import { Accordion } from '@/components/ui/accordion';
import { PersonalInfoSection } from '../sections/PersonalInfoSection';
import { SummarySection } from '../sections/SummarySection';
import { ExperienceSection } from '../sections/ExperienceSection';
import { EducationSection } from '../sections/EducationSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { SkillsSection } from '../sections/SkillsSection';

export function ContentTab() {
  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={['personal-info', 'summary']} className="w-full space-y-4">
        <PersonalInfoSection isProUser={true} />
        <SummarySection isProUser={true} />
        <ExperienceSection isProUser={true} />
        <EducationSection />
        <ProjectsSection />
        <SkillsSection />
      </Accordion>
    </div>
  );
}
