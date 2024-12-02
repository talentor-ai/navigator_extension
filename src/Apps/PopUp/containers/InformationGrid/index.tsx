import { isEmpty } from 'lodash';
import InformationItem from './InformationItem';
import { UserJobProfile } from '@popup:models/model.user';
import { InputFieldType } from '@popup:models/model.form';

const mockData = [
  { fieldKey: 'aboutMe', type: InputFieldType.textarea },
  { fieldKey: 'briefDescription', type: InputFieldType.text },
  { fieldKey: 'additionalSkills', type: InputFieldType.multiselect },
  { fieldKey: 'softSkills', type: InputFieldType.multiselect },
  { fieldKey: 'languages', type: InputFieldType.multiselect },
  { fieldKey: 'userJobProfileExperience', type: InputFieldType.subForm },
  { fieldKey: 'userJobProfileSkills', type: InputFieldType.subForm },
  { fieldKey: 'githubURL', type: InputFieldType.text },
  { fieldKey: 'portfolioUrl', type: InputFieldType.text },
  { fieldKey: 'linkedInUrl', type: InputFieldType.text },
];

const InformationGrid = ({ jobProfile }: { jobProfile: UserJobProfile }) => {
  if (isEmpty(jobProfile)) return <>Loading...</>;
  return (
    <section className="grid grid-cols-3 grid-flow-dense gap-x-2 gap-y-4">
      {mockData.map(({ fieldKey, type }: { [key: string]: string }) => {
        if (isEmpty(jobProfile[fieldKey as keyof UserJobProfile])) return null;
        switch (type) {
          case InputFieldType.subForm:
            return null;
          case InputFieldType.multiselect: {
            // @ts-expect-error - TODO: Fix this
            const valueToDisplay: string[] = jobProfile[fieldKey] || [];
            return (
              <InformationItem
                key={fieldKey}
                keyLabel={fieldKey}
                span={2}
                value={valueToDisplay.join(', ')}
              />
            );
          }
          case InputFieldType.textarea:
            return (
              <InformationItem
                key={fieldKey}
                keyLabel={fieldKey}
                span={3}
                value={jobProfile[fieldKey as keyof UserJobProfile] as string}
              />
            );
          default:
            return (
              <InformationItem
                key={fieldKey}
                keyLabel={fieldKey}
                span={1}
                value={jobProfile[fieldKey as keyof UserJobProfile] as string}
              />
            );
        }
      })}
    </section>
  );
};

export default InformationGrid;
