import InputLocale from '@/components/inputLocale';
import SelectMonth from '@/components/selectMonth';
import { Button } from '@/components/ui/button';

export default function FormGenerateEmail() {
  return (
    <form className="space-y-4">
      <SelectMonth />
      <InputLocale />
      <Button
        formAction="/api/generate-email"
        formMethod="POST"
        type="submit"
        className="w-full"
      >
        Generate email
      </Button>
    </form>
  );
}
